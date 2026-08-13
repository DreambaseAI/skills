# Dreambase connector workflow

Use this reference when required data lives outside Dreambase or a needed
connector is not active.

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

Connection setup is an external authorization flow. Never open the link or
claim authorization on the user's behalf.
