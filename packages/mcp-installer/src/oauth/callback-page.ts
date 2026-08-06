/**
 * The HTML the loopback server returns after a successful OAuth redirect. It is
 * fully self-contained (no external CSS/font/image requests) because the server
 * closes moments after responding — anything not inlined would never load.
 *
 * Styling mirrors the Dreambase app's design tokens (light gradient background,
 * white card, dark-gray foreground, Supabase-green accent, `Inter`/`Montserrat`
 * font stack, ~0.35rem radius) and adapts to the OS dark-mode preference. The
 * `<meta charset="utf-8">` + `charset=utf-8` response header fix the mojibake
 * that appeared when the em dash was decoded as latin-1.
 */
export function callbackSuccessHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dreambase MCP — authorized</title>
<style>
  :root {
    --bg-start: #ffffff;
    --bg-end: #fafafc;
    --card: #ffffff;
    --fg: #2e2e30;
    --muted: #6b7280;
    --border: #e6e6ea;
    --accent: #10b981;
    --accent-soft: rgba(16, 185, 129, 0.12);
    --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.08);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg-start: #161618;
      --bg-end: #101012;
      --card: #1c1c20;
      --fg: #ededef;
      --muted: #a1a1aa;
      --border: #2a2a2e;
      --accent-soft: rgba(16, 185, 129, 0.16);
      --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.4);
    }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    font-family: "Inter", "Montserrat", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--fg);
    background: linear-gradient(180deg, var(--bg-start), var(--bg-end));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 440px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 32px;
    text-align: center;
  }
  .brand {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }
  .icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: var(--accent-soft);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon svg { width: 28px; height: 28px; stroke: var(--accent); }
  h1 { font-size: 20px; font-weight: 650; margin: 0 0 8px; letter-spacing: -0.01em; }
  p { font-size: 14px; line-height: 1.5; color: var(--muted); margin: 0; }
</style>
</head>
<body>
  <main class="card">
    <div class="brand">Dreambase MCP</div>
    <div class="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
    <h1>Authorization complete</h1>
    <p>You can close this tab and return to your terminal.</p>
  </main>
</body>
</html>`;
}
