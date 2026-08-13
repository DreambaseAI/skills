# Release checklist

Repository validation is automated, but a public plugin also depends on hosted
pages, publisher accounts, live MCP metadata, and legal/business decisions. Do
not submit or publish until every applicable item below is complete.

## Automated repository gates

- [ ] `pnpm check:plugin` passes and confirms every skill in
      `store/main-skills.json` still exists.
- [ ] `pnpm build:plugin` produces a complete, symlink-free
      `dist/dreambase/` artifact.
- [ ] Claude and Cursor marketplace validators pass.
- [ ] All skill validators pass.
- [ ] `node scripts/check-release-urls.mjs` passes against production.
- [ ] The `Build plugin submission artifact` workflow produces the ZIP used for
      portal upload; use that exact validated artifact for manual submissions.

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
- [ ] `plan_datasets` says only `save_dataset` persists plans, while its risk
      hints conservatively cover connected API/MCP probes until read semantics
      are enforced in code.
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
- [ ] Tag the plugin version intentionally after the store artifacts are final.
