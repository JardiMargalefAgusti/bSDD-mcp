import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BsddClient } from "../bsdd-client.js";

export function registerClassTools(server: McpServer, client: BsddClient) {
  server.tool(
    "bsdd_get_class",
    "Get full details of a bSDD class (e.g. IfcWall, IfcDoor) including its properties, relations, and child classes. Essential for BIM enrichment.",
    {
      uri: z.string().describe("Class URI (e.g. from search results or dictionary classes)"),
      includeProperties: z.boolean().optional().describe("Include class properties (default true)"),
      includeRelations: z.boolean().optional().describe("Include class relations (default false)"),
      includeChildren: z.boolean().optional().describe("Include child class references (default false)"),
      languageCode: z.string().optional().describe("ISO language code (e.g. 'es', 'en')"),
    },
    async ({ uri, includeProperties, includeRelations, includeChildren, languageCode }) => {
      const result = await client.getClass(uri, {
        includeClassProperties: includeProperties,
        includeClassRelations: includeRelations,
        includeChildClassReferences: includeChildren,
        languageCode,
      });

      const properties = result.classProperties?.map((p) => ({
        name: p.name,
        propertySet: p.propertySet,
        dataType: p.dataType,
        unit: p.unit,
        uri: p.propertyUri,
        description: p.description,
        allowedValues: p.allowedValues?.map((v) => v.value),
        isRequired: p.isRequired,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                name: result.name,
                code: result.code,
                classType: result.classType,
                uri: result.uri,
                dictionaryUri: result.dictionaryUri,
                definition: result.definition,
                description: result.description,
                relatedIfcEntities: result.relatedIfcEntityNames,
                parentClass: result.parentClassReference
                  ? { name: result.parentClassReference.name, uri: result.parentClassReference.uri }
                  : undefined,
                properties,
                relations: result.classRelations,
                childClasses: result.childClassReferences?.map((c) => ({
                  name: c.name,
                  code: c.code,
                  uri: c.uri,
                })),
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
    "bsdd_search_classes",
    "Search for classes across bSDD dictionaries by keyword. Use to find IFC classes, ETIM groups, or any classification.",
    {
      searchText: z.string().describe("Search keyword (e.g. 'wall', 'IfcDoor', 'pipe')"),
      dictionaryUri: z.string().optional().describe("Restrict search to a specific dictionary URI"),
      relatedIfcEntity: z.string().optional().describe("Filter by related IFC entity name (e.g. 'IfcWall')"),
      offset: z.number().optional().describe("Pagination offset"),
      limit: z.number().optional().describe("Max results (default 25)"),
      languageCode: z.string().optional().describe("ISO language code"),
    },
    async ({ searchText, dictionaryUri, relatedIfcEntity, offset, limit, languageCode }) => {
      const result = await client.searchClasses(searchText, {
        dictionaryUri,
        relatedIfcEntity,
        offset,
        limit,
        languageCode,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                classes: result.classes.map((c) => ({
                  name: c.name,
                  code: c.code,
                  uri: c.uri,
                  classType: c.classType,
                  dictionaryUri: c.dictionaryUri,
                  description: c.description,
                  relatedIfcEntities: c.relatedIfcEntityNames,
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

  server.tool(
    "bsdd_get_class_properties",
    "Get the paginated list of properties for a bSDD class, including data types, units, and allowed values. Use to know what properties a BIM element should have.",
    {
      classUri: z.string().describe("Class URI"),
      offset: z.number().optional().describe("Pagination offset"),
      limit: z.number().optional().describe("Max properties to return (default 100)"),
      languageCode: z.string().optional().describe("ISO language code"),
    },
    async ({ classUri, offset, limit, languageCode }) => {
      const result = await client.getClassProperties(classUri, { offset, limit, languageCode });
      const properties = result.classProperties.map((p) => ({
        name: p.name,
        propertySet: p.propertySet,
        dataType: p.dataType,
        unit: p.unit,
        uri: p.propertyUri,
        description: p.description,
        propertyValueKind: p.propertyValueKind,
        allowedValues: p.allowedValues?.map((v) => v.value),
        isRequired: p.isRequired,
      }));
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                properties,
                totalCount: result.classPropertiesTotalCount,
                offset: result.classPropertiesOffset,
                count: result.classPropertiesCount,
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
    "bsdd_get_class_relations",
    "Get relationships between a class and other classes (parent, child, has-part, similar-to). Useful for cross-referencing between IFC, ETIM, UniClass, etc.",
    {
      classUri: z.string().describe("Class URI"),
      offset: z.number().optional().describe("Pagination offset"),
      limit: z.number().optional().describe("Max relations to return (default 50)"),
    },
    async ({ classUri, offset, limit }) => {
      const result = await client.getClassRelations(classUri, { offset, limit });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                relations: result.classRelations,
                totalCount: result.classRelationsTotalCount,
                offset: result.classRelationsOffset,
                count: result.classRelationsCount,
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
