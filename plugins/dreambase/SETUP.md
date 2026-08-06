# Setting up the Dreambase MCP connection

Read this when the Dreambase tools are not yet working — no `dreambase` server
listed, an `UNAUTHENTICATED` error, or `list_workspaces` returning nothing.

Walk the user through the steps below in order. Each one has a check; don't move
on until it passes.

## 1. A Dreambase account

The plugin talks to a hosted server, so the user needs an account.

> Go to **https://app.dreambase.com** and sign up — it's free to start. If you
> already have an account, just sign in.

**Check:** they can see the Dreambase app in their browser.

## 2. Connect a data source

A new account has no data. Everything the tools read — dashboards, datasets,
metric snapshots, health reports — comes from a connected source, and a Supabase
project is the fastest one to connect.

> In Dreambase, open **Connections** and add your Supabase project. You'll paste
> the project URL and a service-role key; Dreambase encrypts them and uses them
> to introspect your schema.

**Check:** the connection appears in the app and shows tables after its scan
finishes. Once it does, `list_connections` will return it here.

A workspace with no connection isn't broken — `whoami` and `list_workspaces`
still work — but every data question will come back empty until one exists.

## 3. Authorize this client

The MCP server uses OAuth. Your client handles the whole flow; it just needs to
be triggered.

> Restart your client so it picks up the plugin's MCP server, then run any
> Dreambase tool. A browser window will open asking you to authorize Dreambase
> for this client. Review the requested permissions and click **Allow**.

The consent screen lists the scopes being granted (reading workspaces,
dashboards, datasets, connections, health reports, skills; running health checks
and creating skills). Granting all of them is the normal setup — the tool list is
scope-gated, so a declined scope silently removes the matching tools.

**Check:** the browser shows a success page and the client reports the server as
connected.

If the browser never opens, or the client shows the server as failed:

- Confirm the client supports remote (`type: "http"`) MCP servers with OAuth.
  Claude Code and Cursor do. Claude Desktop does not from a config file — use the
  installer instead (`npx @dreambase/mcp`, see the repo README).
- Check the machine can reach `https://app.dreambase.com/mcp`.
- Re-run the client's own reconnect/re-authorize action rather than editing
  config by hand.

## 4. Verify

Run these two, in order:

1. **`whoami`** — should return a `userId`, a `clientId`, and a `scopes` array.
   This tool requires no scope, so it succeeding proves the token itself is good.
   Report the granted scopes back to the user; a scope they expected but don't
   see means they declined it at consent and should re-authorize.
2. **`list_workspaces`** — should return at least one workspace with an `id` and
   `name`. Every other tool takes one of those ids.

An empty workspace list on a valid token means the account isn't a member of any
workspace yet — have them create one in the app.

Once both pass, the connection is live. Read the `dreambase-mcp` skill for how to
drive the tools from here.
