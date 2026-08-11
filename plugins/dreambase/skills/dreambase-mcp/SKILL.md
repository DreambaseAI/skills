---
name: dreambase-mcp
description: Operate the Dreambase MCP server correctly — orientation and call order (whoami → list_workspaces → list_dashboards/list_datasets → query_dataset), the DuckDB dialect and result caps on query_dataset, connection discovery before building any API/MCP source, polling create_health_report with get_health_report, retry rules for non-idempotent writes, and what FORBIDDEN vs NOT_FOUND mean. Use when a Dreambase tool is called, or when the user asks about their Dreambase workspace, dashboards, datasets, metrics, database health, workspace skills, or connected Supabase/API/MCP data sources.
---

# Dreambase MCP

The Dreambase MCP server exposes one workspace's analytics platform: dashboards,
their datasets and aggregation snapshots, the data-source connections behind
them, database health reports, and workspace Skills.

The tool schemas describe *what each argument is*. This skill describes *how to
drive the server*: the order to call things in, where results get capped, which
calls are safe to retry, and what an error actually means.

## Orientation: always start from identity, then workspace

Every workspace-scoped tool takes a `workspaceId`, and there is no "current
workspace" — the server never infers one. So the opening sequence is:

1. `whoami` — the authenticated user id, the client id, and **the granted
   scopes**. Requires no scope, so it always succeeds on a live token. Read the
   returned `scopes` before planning: `tools/list` is scope-gated, so a tool the
   token lacks scope for is not advertised at all. If a capability the user
   asked for is missing from your tool list, that is a missing grant, not a
   missing feature — tell them to re-authorize with the scope rather than
   improvising a workaround.
2. `list_workspaces` — the workspaces this user belongs to. One result: use it.
   Several: ask the user which one rather than guessing, and carry that id for
   the rest of the conversation.
3. Then branch by the question (below).

Skip step 1 only when you already have a `whoami` result in this conversation.

## Which tool answers which question

| The user is asking about | Call |
|---|---|
| "what do I have / what's set up" | `list_dashboards`, `list_datasets`, `list_connections`, `list_skills` |
| a number, a trend, a breakdown, a cohort — anything computed from rows | `list_datasets` → `query_dataset` |
| "how did metric X move this week", insights, narratives | `list_aggregates`, then `get_aggregate` for one dashboard's full snapshot |
| the shape of the data: what tables/endpoints/tools exist | `list_connections` → `get_connection` |
| "is my database healthy", RLS, exposed tables, indexes, grades | `list_health_reports` / `get_health_report`; `create_health_report` for a fresh one |
| the business context behind a domain (what a metric means, which sources relate) | `list_skills` → `get_skill` before re-deriving schema from scratch |

Aggregates and datasets answer different questions. Aggregates are a
**pre-computed weekly snapshot** — per-metric daily values plus authored
insights, cheap to read, but only for dashboards that have metrics and have been
refreshed. Datasets are the **raw rows**, and answer anything the snapshot
doesn't. Check `list_dashboards`' `last_aggregated_at` before reaching for
`get_aggregate`: null means no snapshot exists and a `NOT_FOUND` is expected, not
a failure. When `list_aggregates` returns an empty `items` with no `nextCursor`,
the workspace has no snapshots at all — switch to the dataset tools instead of
retrying.

## query_dataset: the dialect and its edges

`query_dataset` runs **exactly one read-only DuckDB `SELECT`** against **one**
dataset, which is staged as the table named `dataset`. Not the dataset's real
name — literally `dataset`.

```sql
SELECT country, count(*) AS n
FROM dataset
GROUP BY country
ORDER BY n DESC
LIMIT 20
```

- **One statement, one dataset.** No `INSERT`/`UPDATE`/`CREATE`/`ATTACH`, no
  semicolon-chained statements, no second table. Self-joins against `dataset`
  are fine (`FROM dataset a JOIN dataset b ON …`). To combine two datasets,
  query each separately and reason over the two results — there is no way to
  join them server-side.
- **Get the schema first.** `list_datasets` returns each handle's column names
  and types; `get_dataset` returns one handle in full (use it when a handle came
  back with `columnsTruncated: true`). Write SQL against those columns rather
  than guessing names. `SELECT * FROM dataset LIMIT 5` is a fine way to eyeball
  raw rows.
- **`queryable: false`** on a handle means a legacy storage format, not a
  permissions problem. It becomes queryable after its dashboard next refreshes;
  don't retry it.

### Results are capped — aggregate, don't re-fetch

Responses pass through a shared envelope of roughly **500 rows and ~16 KiB**,
and set `truncated: true` (with a `note`) when they hit it.

When a result comes back truncated, the query was the wrong shape. Change it:

- Push the work into SQL — `GROUP BY`, `count`, `sum`, `avg`, `percentile_cont`,
  date bucketing — so the answer arrives as tens of rows, not thousands.
- Narrow with `WHERE` and select only the columns you need.
- Page deliberately with `LIMIT`/`OFFSET` and a stable `ORDER BY`, when you truly
  need every row.

Re-issuing the **same** query after a truncation returns the same truncated
result and wastes a turn. And never present a truncated result as if it were the
complete set — either aggregate properly or tell the user what you sampled.

## Connections: discover before you construct

Never write a query, endpoint path, or tool call against a connection you have
not inspected.

1. `list_connections` — the workspace's directory of Supabase databases, API
   connections, and MCP servers (id, type, name, `is_active`). Pass `type` to
   narrow. No secrets are ever returned.
2. `get_connection` — the planning detail for one id:
   - **Supabase**: the relations (schema, name, kind, columns, row counts) a SQL
     source may query. An empty relation list means the connection has not been
     introspected — it does **not** mean SQL is restricted.
   - **API**: the base URL and the enabled operations (method, path, summary).
     That list is the allowlist execution actually enforces.
   - **MCP**: the transport and the enabled tool names. A connection with no
     stored manifest gets scanned live by this call, so calling `get_connection`
     is itself the repair step.
   - `unscanned: true` on an API or MCP connection means no usable spec/manifest
     exists; for MCP that means even the live scan failed (server unreachable,
     or the grant needs reconnecting in the app). Tell the user to fix it in the
     app rather than attempting calls against it.
   - Long lists get cut (`relations_truncated`, `endpoints_truncated`,
     `tools_truncated`, `columns_truncated`) — treat a truncated list as
     incomplete evidence, not as the whole surface.

`updated_at` is the row's last-modified time — an upper bound on how stale the
stored schema is, not a guarantee of freshness. If a query fails on a column
that "should" exist, a stale introspection is the likely cause.

## Health reports are asynchronous

`create_health_report` starts generation against a Supabase connection and
returns **immediately** with a report id and `status: "generating"`. The report
is not in that response.

Poll `get_health_report` with the returned id until `status` is terminal
(`completed` — the full report is then inlined in the `report` field). Generation
usually finishes in a minute or two; poll at a sane interval (a few seconds
between calls) and tell the user it's running rather than sitting silent. Do not
call `create_health_report` again while one is generating — a concurrent
admission for the same connection is rejected as `CONFLICT`, and a recent report
may be reused instead of a fresh run.

`list_health_reports` is the cheaper path when the user just wants the latest
grade — check for an existing recent report before generating a new one.

## Writes: what is safe to retry, and what is not

Reads are safe to repeat. Writes are not.

**`create_skill` is not idempotent.** It runs a synchronous AI generation that
typically takes 30–90 seconds — long enough that a timeout, dropped connection,
or gateway 5xx can leave a skill created without you ever seeing the response. A
blind retry then creates a **second** skill and bills the workspace again.

So, after any `create_skill` call that does not return a clear success:

1. Do **not** retry automatically.
2. Call `list_skills` (newest first) and check whether a matching skill already
   exists.
3. If it does, use it. If it doesn't, surface the failure to the user along with
   the request text you sent, and let them decide — don't silently re-run.

The same rule applies to `save_dataset` **if it is available in your tool list**
(it is not exposed to every caller): a failure without a clear result means
check `list_datasets` for a matching dataset before doing anything else.

`update_skill` is a partial update and is safe to repeat: only the fields you
pass change, and a nullable field passed as `null` is cleared. Read the skill
with `get_skill` first so you patch fields rather than overwriting context you
didn't author.

## Permissions and what errors mean

Workspace **membership gates everything** — the OAuth token carries a user
identity, and every workspace-scoped call re-checks that user's membership.
Scopes gate *capabilities*; membership gates *rows*. Both must pass.

Writes are stricter than reads:

| Tool | Requires |
|---|---|
| `create_skill`, `update_skill` | explicit workspace **owner or admin** |
| `create_health_report` (and `save_dataset` where exposed) | any explicit workspace **member** |
| every read tool | any explicit workspace member |

Error codes and the right response:

| Code | Means | Do |
|---|---|---|
| `FORBIDDEN` | You're a member, but not at the required role (typically a write needing owner/admin) | Stop and tell the user which role they need. Retrying and rephrasing both fail. |
| `NOT_FOUND` | The id doesn't exist, isn't in that workspace, or you aren't a member of that workspace — deliberately indistinguishable, so a wrong id can't probe another tenant | Re-list to get a real id. Check you passed the right `workspaceId` — a valid id in the wrong workspace reads as `NOT_FOUND`. |
| `VALIDATION_ERROR` | Bad arguments or bad SQL — the message is client-safe and usually names the problem | Fix and retry once, with the fix. |
| `CONFLICT` | A competing operation is already in flight (e.g. a health report generating for that connection) | Poll the existing one instead of starting another. |
| `UNAUTHENTICATED` | The token is missing, expired, or wrong-audience | Tell the user to re-authorize. Don't retry. |
| `INTERNAL_ERROR` | Server-side failure; the detail is deliberately redacted | Retry a **read** once. Never blind-retry a write — see above. |

## Scratch vs durable datasets

Datasets come in two kinds, and it matters for writes:

- **Durable** datasets are owned by a dashboard. Its charts bind to their exact
  columns, so a write that replaced one would break the dashboard. They cannot
  be targeted by `save_dataset` and are rejected outright.
- **Scratch** datasets are the caller's own working snapshots and expire after
  about 7 days. `list_datasets` shows each handle's expiry — a handle with an
  expiry is scratch.

Read from either freely with `query_dataset`. When exposed, `save_dataset`
writes only scratch datasets: omit `datasetId` for a new one, or pass a scratch
id to re-execute and replace it in place.

## Reporting results

Answer the user's question in prose with the numbers inline; don't dump raw tool
JSON. When a chart or a written artifact is wanted, the sibling Dreambase skills
take over — `dreambase-visualization-design` to choose the chart,
`dreambase-echarts` to author the config, `dreambase-data-stories` for a report
or one-pager. Always say which dataset or snapshot the numbers came from, and
name it when a result was sampled or truncated.
