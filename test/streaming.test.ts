import {
    formatSSE,
    generateId,
    timestamp,
    createThreadCreatedEvent,
    createWidgetEvent,
    createWidgetAddedEvent,
    createTextDeltaEvent,
    createAssistantMessageAddedEvent,
    createAssistantMessageDoneEvent,
    createWidgetRootUpdatedEvent,
    createWidgetTextDeltaEvent,
    streamWidget,
} from '../src/streaming'
import { Card } from '../src/widgets'

describe('Streaming Utilities', () => {
    describe('formatSSE', () => {
        it('should format event as SSE', () => {
            const event = createThreadCreatedEvent('thread-123')
            const formatted = formatSSE(event)

            expect(formatted).toMatch(/^data: /)
            expect(formatted).toMatch(/\n\n$/)
            expect(formatted).toContain('"type":"thread.created"')
        })
    })

    describe('generateId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateId()
            const id2 = generateId()

            expect(id1).toBeTruthy()
            expect(id2).toBeTruthy()
            expect(id1).not.toBe(id2)
        })
    })

    describe('timestamp', () => {
        it('should return ISO timestamp', () => {
            const ts = timestamp()
            expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        })
    })

    describe('createThreadCreatedEvent', () => {
        it('should create thread.created event', () => {
            const event = createThreadCreatedEvent('thread-456')

            expect(event.type).toBe('thread.created')
            expect(event.thread.id).toBe('thread-456')
            expect(event.thread.created_at).toBeTruthy()
        })

        it('should include metadata if provided', () => {
            const event = createThreadCreatedEvent('thread-789', { title: 'Test Thread' })

            expect(event.thread.metadata).toEqual({ title: 'Test Thread' })
        })
    })

    describe('createWidgetEvent', () => {
        it('should create thread.item.done event with widget', () => {
            const widget: Card = {
                type: 'Card',
                title: 'Test',
                children: []
            }

            const event = createWidgetEvent(widget, 'thread-123', 'item-456')

            expect(event.type).toBe('thread.item.done')
            expect(event.item.type).toBe('widget')
            expect(event.item.id).toBe('item-456')
            expect(event.item.thread_id).toBe('thread-123')
            if (event.item.type === 'widget') {
                expect(event.item.widget).toEqual(widget)
            }
        })

        it('should include copy_text if provided', () => {
            const widget: Card = {
                type: 'Card',
                title: 'Copyable',
                children: []
            }

            const event = createWidgetEvent(widget, 'thread-123', 'item-789', 'Copy this text')

            if (event.item.type === 'widget') {
                expect(event.item.copy_text).toBe('Copy this text')
            }
        })
    })

    describe('createWidgetAddedEvent', () => {
        it('should create thread.item.added event', () => {
            const widget: Card = {
                type: 'Card',
                title: 'Added Widget',
                children: []
            }

            const event = createWidgetAddedEvent(widget, 'thread-123')

            expect(event.type).toBe('thread.item.added')
            expect(event.item.type).toBe('widget')
        })
    })

    describe('createTextDeltaEvent', () => {
        it('should create text delta event', () => {
            const event = createTextDeltaEvent('item-123', 'thread-456', 'H')

            expect(event.type).toBe('thread.item.updated')
            expect(event.item_id).toBe('item-123')
            expect(event.update.type).toBe('assistant_message.content_part.text_delta')
            if (event.update.type === 'assistant_message.content_part.text_delta') {
                expect(event.update.delta).toBe('H')
                expect(event.update.content_index).toBe(0)
            }
        })
    })

    describe('createAssistantMessageAddedEvent', () => {
        it('should create assistant message added event', () => {
            const event = createAssistantMessageAddedEvent('thread-123', 'msg-456')

            expect(event.type).toBe('thread.item.added')
            expect(event.item.type).toBe('assistant_message')
            expect(event.item.id).toBe('msg-456')
            if (event.item.type === 'assistant_message') {
                expect(event.item.content).toEqual([])
            }
        })
    })

    describe('createAssistantMessageDoneEvent', () => {
        it('should create assistant message done event', () => {
            const event = createAssistantMessageDoneEvent('thread-123', 'msg-456', 'Hello, world!')

            expect(event.type).toBe('thread.item.done')
            expect(event.item.type).toBe('assistant_message')
            if (event.item.type === 'assistant_message') {
                expect(event.item.content).toEqual([{ type: 'output_text', text: 'Hello, world!', annotations: [] }])
            }
        })
    })

    describe('streamWidget', () => {
        it('should yield added and done events', () => {
            const widget: Card = {
                type: 'Card',
                title: 'Streamed Widget',
                children: []
            }

            const events = [...streamWidget(widget, 'thread-123')]

            expect(events).toHaveLength(2)
            expect(events[0].type).toBe('thread.item.added')
            expect(events[1].type).toBe('thread.item.done')
        })

        it('should use same item ID for both events', () => {
            const widget: Card = {
                type: 'Card',
                title: 'Test',
                children: []
            }

            const events = [...streamWidget(widget, 'thread-123')]

            const addedItem = events[0].type === 'thread.item.added' ? events[0].item : null
            const doneItem = events[1].type === 'thread.item.done' ? events[1].item : null

            expect(addedItem?.id).toBe(doneItem?.id)
        })
    })

    describe('createWidgetRootUpdatedEvent', () => {
        it('should create widget.root.updated event', () => {
            const widget: Card = {
                type: 'Card',
                children: [
                    { type: 'Image', src: 'data:image/jpeg;base64,abc123' },
                    { type: 'Text', value: 'Screenshot updated' }
                ]
            }

            const event = createWidgetRootUpdatedEvent('widget-123', widget)

            expect(event.type).toBe('thread.item.updated')
            expect(event.item_id).toBe('widget-123')
            expect(event.update.type).toBe('widget.root.updated')
            if (event.update.type === 'widget.root.updated') {
                expect(event.update.widget).toEqual(widget)
            }
        })
    })

    describe('createWidgetTextDeltaEvent', () => {
        it('should create widget streaming text delta event', () => {
            const event = createWidgetTextDeltaEvent('widget-123', 'status-text', ' world!', false)

            expect(event.type).toBe('thread.item.updated')
            expect(event.item_id).toBe('widget-123')
            expect(event.update.type).toBe('widget.streaming_text.value_delta')
            if (event.update.type === 'widget.streaming_text.value_delta') {
                expect(event.update.component_id).toBe('status-text')
                expect(event.update.delta).toBe(' world!')
                expect(event.update.done).toBe(false)
            }
        })

        it('should mark done when streaming complete', () => {
            const event = createWidgetTextDeltaEvent('widget-123', 'status-text', '.', true)

            if (event.update.type === 'widget.streaming_text.value_delta') {
                expect(event.update.done).toBe(true)
            }
        })
    })
})
