#!/usr/bin/env node

const urls = [
  "https://dreambase.com",
  "https://dreambase.com/legal/privacy",
  "https://dreambase.com/legal/terms",
  "https://dreambase.com/design.md",
];

let failed = false;
for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      console.error(`✗ ${url}: HTTP ${response.status}`);
      failed = true;
    } else {
      console.log(`✓ ${url}: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error(
      `✗ ${url}: ${error instanceof Error ? error.message : String(error)}`
    );
    failed = true;
  }
}

try {
  const metadataUrl =
    "https://app.dreambase.com/.well-known/oauth-protected-resource/mcp";
  const response = await fetch(metadataUrl);
  const metadata = await response.json();
  const issuer = metadata.authorization_servers?.[0];
  if (
    !response.ok ||
    metadata.resource !== "https://app.dreambase.com/mcp" ||
    typeof issuer !== "string"
  ) {
    throw new Error(
      "protected-resource metadata is incomplete or inconsistent"
    );
  }
  console.log("✓ MCP protected-resource metadata is consistent");

  const authorizationMetadata = await fetch(
    `${issuer.replace(/\/$/, "")}/.well-known/oauth-authorization-server`
  );
  const authorization = await authorizationMetadata.json();
  if (
    !authorizationMetadata.ok ||
    !authorization.code_challenge_methods_supported?.includes("S256") ||
    typeof authorization.registration_endpoint !== "string" ||
    !authorization.grant_types_supported?.includes("authorization_code")
  ) {
    throw new Error(
      "authorization-server metadata is missing OAuth requirements"
    );
  }
  console.log(
    "✓ OAuth authorization metadata advertises S256 and registration"
  );
} catch (error) {
  console.error(
    `✗ MCP/OAuth metadata: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  failed = true;
}

try {
  const response = await fetch("https://app.dreambase.com/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "dreambase-release-check", version: "1.0.0" },
      },
    }),
  });
  const challenge = response.headers.get("www-authenticate") ?? "";
  if (response.status !== 401 || !challenge.includes("resource_metadata=")) {
    console.error(
      `✗ MCP OAuth challenge: HTTP ${response.status}, ${
        challenge || "missing header"
      }`
    );
    failed = true;
  } else {
    console.log("✓ MCP OAuth challenge advertises protected-resource metadata");
  }
} catch (error) {
  console.error(
    `✗ MCP OAuth challenge: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  failed = true;
}

process.exit(failed ? 1 : 0);
