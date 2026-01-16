# TypeScript ChatKit

A TypeScript implementation of the OpenAI ChatKit server SDK for building rich chat interfaces with widgets and streaming.

## Installation

```bash
npm install typescript-chatkit
```

## Quick Start

### Creating Widgets

```typescript
import { Card, Text, Button, Row } from 'typescript-chatkit'

const widget: Card = {
    type: 'card',
    title: 'Welcome!',
    children: [
        {
            type: 'text',
            text: 'This is a rich widget displayed in the chat.'
        },
        {
            type: 'row',
            gap: 'sm',
            children: [
                {
                    type: 'button',
                    label: 'Learn More',
                    variant: 'solid',
                    onClickAction: {
                        type: 'navigate',
                        payload: { url: '/docs' },
                        handler: 'client'
                    }
                },
                {
                    type: 'button',
                    label: 'Dismiss',
                    variant: 'ghost'
                }
            ]
        }
    ]
}
```

### Streaming Events

```typescript
import { 
    formatSSE, 
    createWidgetEvent, 
    streamWidget,
    streamText 
} from 'typescript-chatkit'

// Stream a widget
const threadId = 'thread-123'

for (const event of streamWidget(widget, threadId)) {
    res.write(formatSSE(event))
}

// Stream text character by character
for await (const event of streamText('Hello, world!', threadId, 20)) {
    res.write(formatSSE(event))
}
```

### Using Templates

```typescript
import { WidgetTemplate } from 'typescript-chatkit'

const templateJson = `{
    "name": "greeting-card",
    "variables": {
        "name": { "type": "string", "required": true },
        "message": { "type": "string", "default": "Welcome!" }
    },
    "widget": {
        "type": "card",
        "title": "Hello, {{ name }}!",
        "children": [
            { "type": "text", "text": "{{ message }}" }
        ]
    }
}`

const template = WidgetTemplate.fromJson(templateJson)
const widget = template.render({ name: 'John' })
```

## Widget Types

### Root Widgets
- `Card` - Primary container with title, subtitle, and children
- `ListView` - List of items with optional click actions

### Layout Components
- `Row` - Horizontal flex container
- `Col` - Vertical flex container
- `Box` - Generic container with padding/margin
- `Divider` - Visual separator line
- `Spacer` - Empty space

### Text Components
- `Text` - Body text with size/weight/color options
- `Title` - Heading (h1-h6)
- `Caption` - Small text
- `Markdown` - Markdown content
- `Badge` - Tag/label component

### Interactive Components
- `Button` - Clickable button with action
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Select` - Dropdown selector
- `Checkbox` - Boolean checkbox
- `RadioGroup` - Radio button group
- `DatePicker` - Date selection
- `Form` - Form container with submit action

### Media Components
- `Icon` - Icon by name
- `Image` - Image with src/alt

## Event Types

The library emits events compatible with ChatKit's SSE protocol:

| Event Type | Description |
|------------|-------------|
| `thread.created` | New thread was created |
| `thread.item.added` | Item added to thread |
| `thread.item.updated` | Item is being updated (streaming) |
| `thread.item.done` | Item is complete |
| `progress_update` | Progress indicator |
| `error` | Error occurred |

## Button Actions

Buttons support the `onClickAction` property with `ActionConfig`:

```typescript
interface ActionConfig {
    type: string              // Action type identifier
    payload?: object          // Action data
    handler?: 'client' | 'server'  // Where to handle
    loadingBehavior?: 'auto' | 'none' | 'self' | 'container'
}
```

### Button Variants
- `solid` - Filled background (primary)
- `soft` - Light background
- `outline` - Border only
- `ghost` - No background

## License

Apache 2.0 - See [LICENSE](LICENSE)

Based on [openai-chatkit](https://pypi.org/project/openai-chatkit/) by OpenAI.
