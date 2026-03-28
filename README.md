# bSDD MCP Server

MCP server for the [buildingSMART Data Dictionary (bSDD)](https://www.buildingsmart.org/users/services/buildingsmart-data-dictionary/) API. Enables AI assistants like Claude to query standardized building classifications, properties, and data dictionaries for BIM model enrichment.

![bSDD + Claude Desktop](https://img.shields.io/badge/MCP-Claude%20Desktop-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## What is bSDD?

The buildingSMART Data Dictionary is an online service that hosts classifications and their properties, allowed values, units, translations, and relations. It provides a standardized way to describe building elements across multiple classification systems like **IFC**, **ETIM**, **UniClass**, **OmniClass**, and many more.

## Features

This MCP server exposes **9 tools** to query the bSDD API:

| Tool | Description |
|------|-------------|
| `bsdd_list_dictionaries` | List available dictionaries (IFC, ETIM, UniClass, etc.) |
| `bsdd_get_dictionary_classes` | Browse class hierarchy of a dictionary |
| `bsdd_get_class` | Get full class details with properties and relations |
| `bsdd_search_classes` | Search classes by keyword across dictionaries |
| `bsdd_get_class_properties` | Get properties of a class (data types, units, allowed values) |
| `bsdd_get_class_relations` | Get relationships between classes |
| `bsdd_get_property` | Get property details (type, unit, constraints) |
| `bsdd_get_property_classes` | Find which classes use a given property |
| `bsdd_text_search` | Free-text search across all bSDD content |

No API key required — the bSDD public read endpoints are used.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [Claude Desktop](https://claude.ai/download)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/JardiMargalefAgusti/bSDD-mcp.git
cd bSDD-mcp
```

2. **Install dependencies**

```bash
npm install
```

3. **Build**

```bash
npm run build
```

4. **Configure Claude Desktop**

Open Claude Desktop settings: **Settings → Developers → Edit Config**

Add the following entry inside `"mcpServers"`:

```json
{
  "mcpServers": {
    "bSDD": {
      "command": "node",
      "args": ["/absolute/path/to/bSDD-mcp/build/index.js"]
    }
  }
}
```

> Replace `/absolute/path/to/bSDD-mcp` with the actual path where you cloned the repository.
>
> **Windows example:**
> ```json
> "args": ["C:\\Users\\youruser\\bSDD-mcp\\build\\index.js"]
> ```
>
> **macOS/Linux example:**
> ```json
> "args": ["/Users/youruser/bSDD-mcp/build/index.js"]
> ```

5. **Restart Claude Desktop**

The 9 `bsdd_*` tools should now appear in your tool list.

## Usage Examples

Once connected, you can ask Claude things like:

- *"List all available bSDD dictionaries"*
- *"What properties should an IfcWall have according to IFC 4.3?"*
- *"Search bSDD for fire resistance properties"*
- *"Get the class definition of IfcDoor with its property sets"*
- *"Which IFC classes use the AcousticRating property?"*
- *"Show me the ETIM classification for electrical panels"*
- *"What are the allowed values for the FireRating property?"*

## BIM Enrichment Workflows

This server is designed to work alongside other BIM-related MCP servers:

### bSDD + IFC Viewer (BIM-Builder)
1. Query bSDD for standard properties of an IFC class
2. Check which properties are missing in your loaded IFC model
3. Create PropertySets and add standardized properties

### bSDD + Revit (FlowRun)
1. Search bSDD for classification codes and required properties
2. Generate shared parameters in Revit
3. Assign standardized values by category/type

## Project Structure

```
bSDD-mcp/
├── src/
│   ├── index.ts              # MCP server entry point (stdio transport)
│   ├── bsdd-client.ts        # HTTP client for bSDD REST API
│   ├── tools/
│   │   ├── dictionaries.ts   # Dictionary browsing tools
│   │   ├── classes.ts        # Class lookup, search, properties, relations
│   │   ├── properties.ts     # Property details and reverse-lookup
│   │   └── search.ts         # Free-text search
│   └── types/
│       └── bsdd.ts           # TypeScript interfaces for API responses
├── package.json
├── tsconfig.json
└── build/                    # Compiled JavaScript (generated)
```

## API Reference

This server uses the [bSDD REST API](https://app.swaggerhub.com/apis/buildingSMART/Dictionaries/v1):

- Base URL: `https://api.bsdd.buildingsmart.org`
- Authentication: None required (public read access)
- Documentation: [bSDD API docs](https://github.com/buildingSMART/bSDD)

## License

MIT
