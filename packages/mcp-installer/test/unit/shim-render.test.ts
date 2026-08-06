import { describe, expect, it } from "vitest";
import { augmentReportResult, augmentToolsList } from "../../src/shim";

describe("augmentToolsList", () => {
  it("appends render guidance to the get_health_report tool description", () => {
    const input = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      result: {
        tools: [
          { name: "whoami", description: "who" },
          { name: "get_health_report", description: "Get a report." },
        ],
      },
    });
    const out = JSON.parse(augmentToolsList(input));
    const report = out.result.tools.find(
      (t: { name: string }) => t.name === "get_health_report",
    );
    expect(report.description).toContain("Get a report.");
    expect(report.description).toContain("inline artifact canvas");
    // Other tools untouched.
    expect(
      out.result.tools.find((t: { name: string }) => t.name === "whoami")
        .description,
    ).toBe("who");
  });

  it("appends the design directive to chart-worthy data tools, not to metadata reads", () => {
    const input = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      result: {
        tools: [
          { name: "list_datasets", description: "list handles" },
          { name: "query_dataset", description: "run SQL" },
          { name: "list_aggregates", description: "metric series" },
          { name: "get_aggregate", description: "one snapshot" },
        ],
      },
    });
    const out = JSON.parse(augmentToolsList(input));
    const byName = (n: string) =>
      out.result.tools.find((t: { name: string }) => t.name === n).description;

    for (const n of ["query_dataset", "list_aggregates", "get_aggregate"]) {
      expect(byName(n)).toContain("dreambase.com/design.md");
      expect(byName(n)).toContain("render this data as an artifact");
    }
    // Metadata-only reads don't get the design directive.
    expect(byName("list_datasets")).toBe("list handles");
  });

  it("returns the input unchanged when it is not valid JSON", () => {
    expect(augmentToolsList("not json")).toBe("not json");
  });
});

describe("augmentReportResult", () => {
  it("adds a render directive block when the report is completed", () => {
    const input = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      result: {
        content: [{ type: "text", text: '{"status":"completed","grade":71}' }],
      },
    });
    const out = JSON.parse(augmentReportResult(input));
    expect(out.result.content).toHaveLength(2);
    expect(out.result.content[1].text).toContain("inline artifact canvas");
  });

  it("leaves 'generating' poll responses alone", () => {
    const input = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      result: { content: [{ type: "text", text: '{"status":"generating"}' }] },
    });
    const out = JSON.parse(augmentReportResult(input));
    expect(out.result.content).toHaveLength(1);
  });

  it("does not touch error results", () => {
    const input = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      result: {
        isError: true,
        content: [{ type: "text", text: '{"grade":71}' }],
      },
    });
    const out = JSON.parse(augmentReportResult(input));
    expect(out.result.content).toHaveLength(1);
  });
});
