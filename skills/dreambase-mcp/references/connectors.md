# Dreambase connector workflow

Use this reference when required data lives outside Dreambase or a needed
connector is not active.

`list_connectors` returns the whole marketplace catalog, but only some entries
can be connected through an agent-issued link: `supabase`, `github`, `slack`,
`posthog`, `clickhouse`, `bigquery`, and `ordinal`. Everything else — Stripe,
for instance — comes back with `connectLinkAvailable: false`. That connector
exists and is connectable in the Dreambase app; it simply has no link for you to
issue, so route the user there rather than reporting it as unsupported.

1. Call `list_connectors` for the selected workspace.
2. If the connector is active, continue with `list_connections`.
3. If `connected: false` and `connectLinkAvailable: true`, call
   `request_connector_connection` only when the user requested connection
   setup. Present the returned URL as a clickable link.
4. Poll `get_connection_request` every 5–10 seconds for a few minutes while
   keeping the user informed.
5. Continue only when both `status: "completed"` and
   `connectorConnected: true` are present.

Special cases:

- `already_connected`: continue without presenting a link.
- `expired`: create a fresh request only with continuing user authorization.
- `completed` plus `connectorConnected: false`: the connector or grant is no
  longer live. Do not query it; create a fresh link or direct the user to the
  Dreambase data catalog.
- `connectLinkAvailable: false`: direct the user to connect it in the Dreambase
  data catalog.
- `FORBIDDEN` on the request: every connector except Supabase needs an active
  workspace subscription, and a connector can also be unavailable on the
  deployment. Both arrive as a message explaining which. Relay it instead of
  retrying.

`get_connection` is annotated read-only, but a connection with no stored
manifest is scanned live and the recovered catalog is cached. Recovered MCP
tools are stored disabled until a workspace admin approves them, so a tool you
can see listed may still be refused by `save_dataset` or `plan_datasets`. Read
that as pending approval, not as a malformed call.

Connection setup is an external authorization flow. Never open the link or
claim authorization on the user's behalf.
