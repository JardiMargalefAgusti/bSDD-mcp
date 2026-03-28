import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BsddClient } from "../bsdd-client.js";

export function registerPropertyTools(server: McpServer, client: BsddClient) {
  server.tool(
    "bsdd_get_property",
    "Get full details of a bSDD property: data type, unit, allowed values, connected property sets. Use to understand what a BIM property means and what values it accepts.",
    {
      uri: z.string().describe("Property URI (from class properties or search results)"),
      languageCode: z.string().optional().describe("ISO language code (e.g. 'es', 'en')"),
    },
    async ({ uri, languageCode }) => {
      const result = await client.getProperty(uri, { languageCode });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                name: result.name,
                code: result.code,
                uri: result.uri,
                definition: result.definition,
                description: result.description,
                dataType: result.dataType,
                propertyValueKind: result.propertyValueKind,
                units: result.units,
                dictionaryUri: result.dictionaryUri,
                status: result.status,
                allowedValues: result.allowedValues?.map((v) => ({
                  value: v.value,
                  code: v.code,
                  description: v.description,
                })),
                minInclusive: result.minInclusive,
                maxInclusive: result.maxInclusive,
                minExclusive: result.minExclusive,
                maxExclusive: result.maxExclusive,
                pattern: result.pattern,
                connectedPropertyCodes: result.connectedPropertyCodes,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "bsdd_get_property_classes",
    "Find which bSDD classes use a given property. Useful to understand where a property like 'FireRating' or 'AcousticRating' applies.",
    {
      propertyUri: z.string().describe("Property URI"),
      offset: z.number().optional().describe("Pagination offset"),
      limit: z.number().optional().describe("Max results (default 50)"),
    },
    async ({ propertyUri, offset, limit }) => {
      const result = await client.getPropertyClasses(propertyUri, { offset, limit });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                classes: result.propertyClasses.map((c) => ({
                  name: c.name,
                  code: c.code,
                  uri: c.uri,
                  dictionaryUri: c.dictionaryUri,
                  dictionaryName: c.dictionaryName,
                })),
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
