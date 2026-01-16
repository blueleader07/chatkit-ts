#!/bin/bash
# Generate TypeScript types from Python chatkit Pydantic models
# This script exports JSON Schema from Python and converts to TypeScript

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCHEMA_DIR="$PROJECT_DIR/schema"
OUTPUT_DIR="$PROJECT_DIR/src/widgets"

echo "=== ChatKit Type Generation ==="
echo ""

# Step 1: Export JSON Schema from Python
echo "Step 1: Exporting JSON Schema from Python chatkit..."
cd /Users/n0160926/git/lyra-chatkit
uv run python "$SCRIPT_DIR/export-schema.py"

# Step 2: Convert to TypeScript
echo ""
echo "Step 2: Converting JSON Schema to TypeScript..."
cd "$PROJECT_DIR"

# Generate types from the Card schema (includes all widget components)
npx json-schema-to-typescript \
    "$SCHEMA_DIR/widget-card.json" \
    --output "$OUTPUT_DIR/generated/widgets.generated.ts" \
    --style.singleQuote \
    --additionalProperties false

echo ""
echo "Generated: $OUTPUT_DIR/generated/widgets.generated.ts"
echo ""
echo "=== Type generation complete! ==="
