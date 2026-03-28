# bSDD MCP — Workflows & Use Cases

This guide documents the full potential of the bSDD MCP server, both standalone and combined with other BIM tools.

---

## 1. Standalone: Exploring the bSDD

### 1.1 Discover Classification Systems

> *"List all available bSDD dictionaries"*

Returns 350+ dictionaries including IFC, ETIM, UniClass, OmniClass, NL-SfB, CCI, GuBIMclass, and many national/industry standards.

Each dictionary has a **URI** that you use in subsequent queries.

### 1.2 Browse a Dictionary's Class Hierarchy

> *"Show me the IFC 4.3 class hierarchy"*

Navigate the full tree of classes (IfcWall, IfcDoor, IfcBeam...) within any dictionary. Supports pagination for large dictionaries.

### 1.3 Get a Class Definition

> *"Get the full definition of IfcWall including its properties"*

Returns:
- Class name, code, type, and description
- Parent class (e.g., IfcBuiltElement)
- All standard properties grouped by PropertySet (Pset_WallCommon, etc.)
- Data types, units, and allowed values for each property
- Related IFC entity names

### 1.4 Search Across Dictionaries

> *"Search for everything related to 'fire resistance' in bSDD"*

Free-text search returns matching classes, properties, and dictionaries. Filter by specific dictionaries or language.

### 1.5 Property Deep Dive

> *"What is the FireRating property? What values can it take?"*

Full property details: data type, measurement unit, allowed/enumerated values, min/max constraints, and which property sets it belongs to.

### 1.6 Reverse Lookup: Property → Classes

> *"Which IFC classes can have an AcousticRating property?"*

Find all classes across all dictionaries that use a specific property. Essential for understanding where a property applies.

### 1.7 Cross-Reference Between Standards

> *"Show relations between IfcWall and other classification systems"*

Discover how a class in one dictionary (e.g., IFC) relates to classes in others (ETIM, UniClass, etc.) via parent/child, has-part, or similar-to relationships.

### 1.8 Multilingual Queries

> *"Get IfcDoor properties in Spanish"*

All tools support a `languageCode` parameter. Available translations depend on each dictionary (IFC supports 18+ languages).

---

## 2. Combined with BIM-Builder (IFC Viewer MCP)

The BIM-Builder MCP loads and manipulates IFC models in a 3D viewer. Combined with bSDD, you get a powerful IFC enrichment pipeline.

### 2.1 Audit: Check Missing Properties

**Workflow:**
1. Load an IFC file in BIM-Builder
2. Select elements (e.g., all walls)
3. Get their current properties via `get-elements-info`
4. Query bSDD for the standard properties of that class (`bsdd_get_class_properties`)
5. Compare and identify what's missing

> *"Load model.ifc, select all IfcWall elements, and tell me which Pset_WallCommon properties are missing compared to bSDD"*

### 2.2 Enrich: Add Standard PropertySets

**Workflow:**
1. Query bSDD for the required properties of a class
2. Use `create-property-set` to add the missing PropertySet
3. Use `add-property` to populate it with standardized values
4. Save the enriched IFC with `save-ifc`

> *"Add all Pset_DoorCommon properties from bSDD to the doors in my model"*

### 2.3 Classify: Add IfcClassificationReference

**Workflow:**
1. Search bSDD for classification codes matching elements
2. Create a PropertySet with classification data (system, code, URI)
3. Write it to the IFC elements

> *"Classify all walls in my model using UniClass codes from bSDD"*

### 2.4 Validate: Check Property Values

**Workflow:**
1. Get element properties from BIM-Builder
2. Query bSDD for allowed values and constraints
3. Flag any values that are outside the standard ranges

> *"Check if the FireRating values on my walls match the allowed values in bSDD"*

### 2.5 Export Enriched Data

**Workflow:**
1. After enrichment, use `export-elements-csv` to generate a spreadsheet
2. The CSV includes all original + newly added bSDD properties

> *"Export all enriched wall data to a CSV with bSDD property names"*

---

## 3. Combined with FlowRun (Revit MCP)

FlowRun connects to Revit for live model manipulation. Combined with bSDD, you can standardize Revit models.

### 3.1 Generate Shared Parameters from bSDD

**Workflow:**
1. Query bSDD for properties of an IFC class (e.g., IfcWall → Pset_WallCommon)
2. Use `generate_shared_parameters` to create matching Revit parameters
3. Bind them to the correct Revit categories

> *"Create shared parameters in Revit for all Pset_WallCommon properties from bSDD, bound to the Walls category"*

### 3.2 Fill Parameters with Standard Values

**Workflow:**
1. Query bSDD for allowed values of a property
2. List Revit elements by category
3. Use `assign_parameter_by_category_and_type` to set values

> *"Set the Combustible parameter to 'false' for all concrete wall types, as defined in bSDD"*

### 3.3 Classification Code Assignment

**Workflow:**
1. Search bSDD for classification codes (UniClass, OmniClass, etc.)
2. Map them to Revit family types
3. Assign codes using `assign_property_by_key_list`

> *"Assign UniClass codes from bSDD to all door types in Revit"*

### 3.4 Create Schedules with Standard Names

**Workflow:**
1. Query bSDD for the standard property names of a class
2. Use `create_schedules` with those field names
3. Result: schedules that match international standards

> *"Create a door schedule in Revit using the exact property names from bSDD's Pset_DoorCommon"*

### 3.5 Validate Revit vs. bSDD Standards

**Workflow:**
1. Get Revit element properties via `element_properties`
2. Compare against bSDD class definitions
3. Report discrepancies

> *"Compare my Revit wall parameters against the IFC 4.3 standard in bSDD and tell me what's missing or misnamed"*

---

## 4. Combined with Both (Full Pipeline)

### 4.1 Revit → bSDD → IFC Quality Pipeline

1. **FlowRun**: List Revit elements and their current parameters
2. **bSDD**: Query standard properties and classification codes
3. **FlowRun**: Add missing parameters and assign values in Revit
4. Export IFC from Revit
5. **BIM-Builder**: Load the IFC, verify it has the correct PropertySets
6. **bSDD**: Validate property values against allowed ranges

### 4.2 IFC → bSDD → Revit Mapping

1. **BIM-Builder**: Analyze an incoming IFC from a third party
2. **bSDD**: Look up what each property means, its units, and constraints
3. **FlowRun**: Create matching parameters in your Revit template
4. Result: a Revit project ready to receive standardized IFC data

---

## 5. Advanced Use Cases

### 5.1 Multi-Dictionary Comparison

> *"Compare how 'wall' is classified in IFC, ETIM, and UniClass"*

Search for the same concept across multiple dictionaries to understand mapping relationships.

### 5.2 Property Coverage Analysis

> *"For an IfcBeam, which properties are common between IFC 4.3 and ETIM?"*

Cross-reference properties across dictionaries to find overlaps and gaps.

### 5.3 BEP Compliance Check

Use bSDD as the source of truth for a BIM Execution Plan:
1. Define required classes and properties in the BEP
2. Query bSDD for the exact definitions
3. Validate the model against those definitions

### 5.4 COBie Data Extraction

> *"Get all properties needed for COBie data drops from bSDD"*

Query bSDD for COBie-related property sets and use them to validate or generate COBie spreadsheets.

### 5.5 Automated Model Documentation

1. List all unique IFC classes in a model (BIM-Builder)
2. For each class, get the bSDD definition and properties
3. Generate a structured report of what the model contains vs. what it should contain

---

## Quick Reference: Tool Chaining Patterns

| Pattern | Tools Used |
|---------|-----------|
| **Discover → Browse → Detail** | `list_dictionaries` → `get_dictionary_classes` → `get_class` |
| **Search → Properties → Values** | `search_classes` → `get_class_properties` → `get_property` |
| **Property → Where used** | `get_property` → `get_property_classes` |
| **Cross-reference** | `get_class_relations` between dictionaries |
| **IFC Enrich** | `get_class` (bSDD) → `create-property-set` (BIM-Builder) |
| **Revit Standardize** | `get_class_properties` (bSDD) → `generate_shared_parameters` (FlowRun) |
| **Validate** | `get_property` (bSDD) → `element_properties` (FlowRun/BIM-Builder) → compare |
