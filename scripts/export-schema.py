#!/usr/bin/env python3
"""
Export JSON Schema from Python chatkit Pydantic models.
This schema can then be converted to TypeScript types.

Usage:
    python scripts/export-schema.py

Requires:
    pip install chatkit  (or have openai-chatkit installed)
"""

import json
import sys
from pathlib import Path

try:
    from chatkit.widgets import Card, ListView
except ImportError:
    print("Error: chatkit package not found. Install with: pip install chatkit")
    sys.exit(1)

# Output directory
output_dir = Path(__file__).parent.parent / "schema"
output_dir.mkdir(exist_ok=True)

# Export widget schemas
schemas = {
    "card": Card.model_json_schema(),
    "listview": ListView.model_json_schema(),
}

# Write individual schemas
for name, schema in schemas.items():
    output_file = output_dir / f"widget-{name}.json"
    with open(output_file, "w") as f:
        json.dump(schema, f, indent=2)
    print(f"Exported: {output_file}")

# Also create a combined schema for all widgets
combined = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "ChatKit Widgets",
    "description": "Combined schema for all ChatKit widget types",
    "definitions": {},
}

# Merge all $defs from Card (which includes all child components)
card_schema = schemas["card"]
if "$defs" in card_schema:
    combined["definitions"] = card_schema["$defs"]

combined_file = output_dir / "widgets-combined.json"
with open(combined_file, "w") as f:
    json.dump(combined, f, indent=2)
print(f"Exported: {combined_file}")

print(f"\nTotal type definitions: {len(combined.get('definitions', {}))}")
print("Done! Now run: npm run generate:types")
