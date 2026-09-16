# Dreambase dataset lifecycle

Use this reference when a dataset already exists and the user wants to keep it,
get newer rows into it, or change what it contains. For discovering, planning,
and first-time saving, use [data-workflows.md](data-workflows.md) instead.

## Retention: scratch and durable

Every dataset is a stored snapshot. `expiresAt` says how long it survives.

- `expiresAt` set: **scratch**. It expires about seven days after its last write
  and a daily sweep deletes it. Scratch is the experimentation surface — save,
  inspect, iterate, and let the wrong ones expire on their own.
- `expiresAt: null`: **durable**. Nothing deletes it. A dataset reaches this
  state two ways: a dashboard owns it, or someone promoted it with
  `promote_dataset`.

Durability is retention, not permission. A handle does not say whether a
dashboard is bound to the dataset, so `expiresAt: null` alone does not tell you
whether `save_dataset` may target it. The next section is how to tell.

## Redefine or refresh

The guard on redefinition is dashboard linkage, not durability. Match the case
before writing:

- **Dashboard-linked**: `save_dataset` with that `datasetId` returns
  `VALIDATION_ERROR`. The check runs on the pre-execution read, so the source
  never ran, nothing was billed, and nothing changed. Use `refresh_dataset` to
  replay the stored definition, or omit `datasetId` to save a separate new
  dataset. The guard exists because a redefinition can return any column set,
  and every chart, metric, table, and filter bound to a column that disappears
  breaks with no repair tool on this surface.
- **Standalone durable (promoted, no dashboard)**: redefinable. The write
  preserves durability — a save on a promoted dataset does not quietly return it
  to scratch.
- **Scratch**: redefinable, and the write renews the TTL.

Choose by what is changing. The definition itself — different SQL, endpoint,
tool call, columns, or grain — is `save_dataset`. The same definition against
newer data is `refresh_dataset`.

One request often bundles both, as in "get current numbers, and the labels
changed." Split them and say which half you did. A refresh cannot apply a
definition change, and assuming the source already made that change for you
turns a guess into a reported result. Refresh for the rows, confirm what the
refreshed rows actually contain, then handle the definition change on its own
terms: redefine when the dataset is standalone, or save a separate new dataset
when a dashboard is bound to it.

## Keep a verified dataset

`promote_dataset` clears the expiry so the dataset stops being swept. It starts
durable-storage usage, and **a promoted dataset cannot currently be undone on
any surface** — no MCP tool, no REST endpoint, no app control removes it. That
irreversibility is why promotion takes its own consent step rather than riding
on the authorization that produced the dataset.

1. **Verify.** Read the saved preview and profile, then run targeted
   `query_dataset` checks against the claims that matter: the grain and key you
   assert, uniqueness, date coverage, row count, and headline totals. Report
   what those checks establish and what they leave open, including any
   truncation and any planner assumption you did not confirm.
2. **Present.** Give the exact `datasetId`, the exact `promote_dataset`
   arguments, that promotion starts durable-storage usage, and that it cannot
   currently be undone.
3. **Stop and wait** for a separate affirmative reply. Do not bundle the ask
   with another question, and do not read earlier authorization to build or save
   as authorization to keep.
4. **Call it**, then confirm `expiresAt: null` on the returned handle. Never
   claim correctness beyond the checks you actually ran.

Promotion changes retention only. It never re-runs the source or rewrites stored
rows, so it cannot change the numbers the user just verified, and repeating it
on an already-durable or dashboard-owned dataset is a no-op that returns the
current handle. Unlike `refresh_dataset`, it has no REST equivalent.

### `CONFLICT` on promotion

The write is a compare-and-swap over the dataset's storage path, expiry, and
cache timestamp, so `CONFLICT` means one of two things: the dataset was
refreshed or re-saved while you were promoting it, or its scratch window expired
between your read and the write. The remedies differ — rewritten rows need
re-verification, an expired dataset is gone and must be saved again rather than
promoted.

Re-read the handle, re-run the verification, and ask again. Never blind-retry: a
retry that happens to succeed promotes rows the user never verified, which is
the failure this gate exists to prevent.

## Refresh on demand

`refresh_dataset` replays one dataset's stored definition against the current
source and overwrites its rows. It does not change the definition and it does
not create or alter a schedule. It works on scratch, standalone durable, and
dashboard-owned datasets; a scratch TTL is renewed by each refresh and a durable
dataset stays durable, because retention comes from the target rather than the
calling surface.

Call it only when the user explicitly asks for fresh data. Each call executes
the real source and incurs source and compute usage, and API POST and MCP
sources may act on the connected system. After it succeeds, verify the new rows
with `query_dataset` before relying on them.

Do not blind-retry after a timeout or unclear failure. A failed refresh leaves
the previous rows intact as the readable truth, so `get_dataset` or
`query_dataset` tells you what actually happened.

Two limits that apply to `save_dataset` are **not** re-checked on refresh: the
GET/POST-only restriction on API sources and the rejection of an unscanned
api/mcp connection. A connection that has since lost its manifest surfaces here
as an execution failure rather than a clean validation error, so read the error
rather than assuming the input was fine.

For repeated fixed automation, prefer
`POST /api/v1/workspaces/{workspace_id}/datasets/{dataset_id}/refresh` over
looping MCP calls. Both surfaces run the same definition through the same
function.

## Freshness is not observable

A dataset handle carries `datasetId`, `name`, `columns`, `rowCount`,
`expiresAt`, `queryable`, `sizeBytes`, and sometimes `columnsTruncated`. It
carries no last-refreshed timestamp. There is also no per-dataset schedule:
dashboards refresh on a cron, but a promoted standalone dataset changes only
when someone calls `refresh_dataset`.

`list_datasets` is ordered by recency of caching, so relative freshness within a
page is readable, but absolute age is not available on this surface. When the
question is time-sensitive, say the rows are as of the dataset's last refresh,
say that the age is not visible here, and offer `refresh_dataset`. Do not assert
freshness you cannot observe, and do not describe durability as if it implied it.

## Paging and truncation

`list_datasets` pages with `nextCursor` under a byte budget as well as a row
limit, so a page shorter than the requested `limit` is not the end of the list —
page until `nextCursor` is absent.

`columnsTruncated: true` means the handle's column list was trimmed to fit.
Call `get_dataset` for the complete schema and per-column profile statistics
before writing SQL against it.
