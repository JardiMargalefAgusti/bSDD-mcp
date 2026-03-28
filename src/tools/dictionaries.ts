import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BsddClient } from "../bsdd-client.js";

export function registerDictionaryTools(server: McpServer, client: BsddClient) {
  server.tool(
    "bsdd_list_dictionaries",
    "List available bSDD dictionaries (IFC, ETIM, UniClass, etc.). Use to discover classification systems and their URIs.",
    {
      offset: z.number().optional().describe("Pagination offset (default 0)"),
      limit: z.number().optional().describe("Max results to return (default 50)"),
    },
    async ({ offset, limit }) => {
      const result = await client.listDictionaries({ offset, limit });
      const summary = result.dictionaries.map((d) => ({
        name: d.name,
        uri: d.uri,
        version: d.version,
        owner: d.organizationNameOwner,
        status: d.status,
        isLatest: d.isLatestVersion,
        languages: d.availableLanguages?.map((l) => l.code).join(", "),
      }));
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { dictionaries: summary, totalCount: result.totalCount, offset: result.offset, count: result.count },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "bsdd_get_dictionary_classes",
    "Get the class hierarchy of a bSDD dictionary. Use to browse IFC classes, ETIM product groups, etc.",
    {
      uri: z.string().describe("Dictionary URI (get it from bsdd_list_dictionaries)"),
      offset: z.number().optional().describe("Pagination offset (default 0)"),
      limit: z.number().optional().describe("Max classes to return (default 100)"),
      languageCode: z.string().optional().describe("ISO language code for translations (e.g. 'es', 'ca', 'en')"),
    },
    async ({ uri, offset, limit, languageCode }) => {
      const result = await client.getDictionaryClasses(uri, { offset, limit, languageCode });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                dictionary: result.name,
                version: result.version,
                classes: result.classes,
                totalCount: result.classesTotalCount,
                offset: result.classesOffset,
                count: result.classesCount,
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
