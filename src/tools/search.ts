import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BsddClient } from "../bsdd-client.js";

export function registerSearchTools(server: McpServer, client: BsddClient) {
  server.tool(
    "bsdd_text_search",
    "Free-text search across all bSDD content (classes, properties, dictionaries). Optionally filter by dictionary URIs. Use for broad discovery queries like 'fire resistance', 'acoustic', 'thermal conductivity'.",
    {
      searchText: z.string().describe("Search text (e.g. 'fire resistance', 'thermal', 'IfcBeam')"),
      dictionaryUris: z
        .array(z.string())
        .optional()
        .describe("Optional: restrict search to specific dictionary URIs"),
      offset: z.number().optional().describe("Pagination offset"),
      limit: z.number().optional().describe("Max results (default 25)"),
      languageCode: z.string().optional().describe("ISO language code (e.g. 'es', 'en')"),
    },
    async ({ searchText, dictionaryUris, offset, limit, languageCode }) => {
      const result = await client.textSearch(searchText, {
        dictionaryUris,
        offset,
        limit,
        languageCode,
      });

      const classes = result.classes?.map((c) => ({
        name: c.name,
        code: c.code,
        uri: c.uri,
        classType: c.classType,
        dictionaryUri: c.dictionaryUri,
        relatedIfcEntities: c.relatedIfcEntityNames,
      }));

      const properties = result.properties?.map((p) => ({
        name: p.name,
        code: p.code,
        uri: p.uri,
        dataType: p.dataType,
        description: p.description,
        dictionaryUri: p.dictionaryUri,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                classes: classes?.length ? classes : undefined,
                properties: properties?.length ? properties : undefined,
                dictionaries: result.dictionaries?.length
                  ? result.dictionaries.map((d) => ({ name: d.name, uri: d.uri, version: d.version }))
                  : undefined,
                totalCount: result.totalCount,
                offset: result.offset,
                count: result.count,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
