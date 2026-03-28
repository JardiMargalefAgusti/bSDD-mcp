#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BsddClient } from "./bsdd-client.js";
import { registerDictionaryTools } from "./tools/dictionaries.js";
import { registerClassTools } from "./tools/classes.js";
import { registerPropertyTools } from "./tools/properties.js";
import { registerSearchTools } from "./tools/search.js";

const client = new BsddClient();

const server = new McpServer({
  name: "bsdd-mcp-server",
  version: "1.0.0",
});

registerDictionaryTools(server, client);
registerClassTools(server, client);
registerPropertyTools(server, client);
registerSearchTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
