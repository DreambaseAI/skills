# Release checklist

Repository validation is automated, but a public plugin also depends on hosted
pages, publisher accounts, live MCP metadata, and legal/business decisions. Do
not submit or publish until every applicable item below is complete.

## Automated repository gates

- [ ] `pnpm sync:plugin` produces no diff.
- [ ] `pnpm check:plugin` passes.
- [ ] Claude and Cursor marketplace validators pass.
- [ ] All skill validators and installer checks pass.
- [ ] `npm pack --dry-run` contains only intended files.
- [ ] `node scripts/check-release-urls.mjs` passes against production.
- [ ] The `Build plugin submission artifact` workflow produces the ZIP used for
      portal upload; do not zip a source tree containing symlinks.

## Hosted and legal gates

- [ ] `https://app.dreambase.com/privacy` is public, final, and returns 2xx.
- [ ] `https://app.dreambase.com/terms` is public, final, and returns 2xx.
- [ ] The policies accurately cover Dreambase account data, connected-source
      credentials, OAuth grants, retention/deletion, subprocessors, and support.
- [ ] A stable public support contact or support URL is available.
- [ ] OpenAI domain verification is completed with the portal-issued token.
- [ ] Anthropic publisher identity and all required listing assets are complete.
- [ ] Counsel/business owners confirm whether a SaaS-backed plugin with paid
      tiers complies with the current Cursor Marketplace Publisher Terms.

## Live MCP review gates

- [ ] Every tool declares accurate `readOnlyHint`, `openWorldHint`, and
      `destructiveHint` values with required justifications.
- [ ] `get_connection` discloses that it may perform a live remote scan.
- [ ] `create_skill` is marked billed, non-idempotent, and unsafe to blind-retry.
- [ ] `update_skill`, dataset writes, and health-report creation accurately
      describe mutation, overwrite, and retry behavior.
- [ ] Default consent is least privilege and write scopes are requested only
      for an explicit write workflow.
- [ ] Tool scan passes using dedicated reviewer/demo credentials containing
      representative but non-sensitive data.

## Submission collateral

- [ ] Review `store/openai/submission-tests.json`: five positive and three
      negative cases still match the production tool catalog.
- [ ] Record the required end-to-end demo using the reviewer account.
- [ ] Provide reviewer credentials through each store's secure submission flow.
- [ ] Capture screenshots and descriptions from the exact release artifact.
- [ ] Tag plugin and npm versions intentionally; do not infer one from the other.
