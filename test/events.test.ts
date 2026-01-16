import {
    ThreadCreatedEvent,
    ThreadItemDoneEvent,
    ThreadItemUpdatedEvent,
    WidgetItem,
    UserMessageItem,
    AssistantMessageItem,
    ProgressUpdateEvent,
    ErrorEvent,
} from '../src/events'
import { Card } from '../src/widgets'

describe('Event Types', () => {
    describe('ThreadCreatedEvent', () => {
        it('should create valid thread created event', () => {
            const event: ThreadCreatedEvent = {
                type: 'thread.created',
                thread: {
                    id: 'thread-123',
                    created_at: new Date().toISOString(),
                    metadata: { title: 'New Chat' }
                }
            }

            expect(event.type).toBe('thread.created')
            expect(event.thread.id).toBe('thread-123')
        })
    })

    describe('ThreadItemDoneEvent', () => {
        it('should handle widget item', () => {
            const widget: Card = {
                type: 'Card',
                title: 'Test Widget',
                children: []
            }

            const item: WidgetItem = {
                type: 'widget',
                id: 'item-123',
                thread_id: 'thread-456',
                created_at: new Date().toISOString(),
                widget,
                copy_text: 'Copyable content'
            }

            const event: ThreadItemDoneEvent = {
                type: 'thread.item.done',
                item
            }

            expect(event.type).toBe('thread.item.done')
            expect(event.item.type).toBe('widget')
        })

        it('should handle user message item', () => {
            const item: UserMessageItem = {
                type: 'user_message',
                id: 'msg-123',
                thread_id: 'thread-456',
                created_at: new Date().toISOString(),
                content: [{ type: 'input_text', text: 'Hello!' }],
                attachments: [],
                user_id: 'user-789'
            }

            const event: ThreadItemDoneEvent = {
                type: 'thread.item.done',
                item
            }

            expect(event.item.type).toBe('user_message')
            if (event.item.type === 'user_message') {
                expect(event.item.content[0].text).toBe('Hello!')
            }
        })

        it('should handle assistant message item', () => {
            const item: AssistantMessageItem = {
                type: 'assistant_message',
                id: 'msg-456',
                thread_id: 'thread-789',
                created_at: new Date().toISOString(),
                content: [
                    { type: 'output_text', text: 'Hello! How can I help?', annotations: [] }
                ]
            }

            const event: ThreadItemDoneEvent = {
                type: 'thread.item.done',
                item
            }

            expect(event.item.type).toBe('assistant_message')
            if (event.item.type === 'assistant_message') {
                expect(event.item.content).toHaveLength(1)
            }
        })
    })

    describe('ThreadItemUpdatedEvent', () => {
        it('should handle text delta', () => {
            const event: ThreadItemUpdatedEvent = {
                type: 'thread.item.updated',
                item_id: 'msg-123',
                update: {
                    type: 'assistant_message.content_part.text_delta',
                    content_index: 0,
                    delta: 'H'
                }
            }

            expect(event.type).toBe('thread.item.updated')
            expect(event.update.type).toBe('assistant_message.content_part.text_delta')
        })

        it('should handle content part added', () => {
            const event: ThreadItemUpdatedEvent = {
                type: 'thread.item.updated',
                item_id: 'msg-123',
                update: {
                    type: 'assistant_message.content_part.added',
                    content_index: 0,
                    content: { type: 'output_text', text: '', annotations: [] }
                }
            }

            expect(event.update.type).toBe('assistant_message.content_part.added')
        })

        it('should handle widget root updated', () => {
            const event: ThreadItemUpdatedEvent = {
                type: 'thread.item.updated',
                item_id: 'widget-123',
                update: {
                    type: 'widget.root.updated',
                    widget: {
                        type: 'Card',
                        children: [{ type: 'Text', value: 'Updated!' }]
                    }
                }
            }

            expect(event.update.type).toBe('widget.root.updated')
        })

        it('should handle widget streaming text delta', () => {
            const event: ThreadItemUpdatedEvent = {
                type: 'thread.item.updated',
                item_id: 'widget-123',
                update: {
                    type: 'widget.streaming_text.value_delta',
                    component_id: 'text-1',
                    delta: 'Hello',
                    done: false
                }
            }

            expect(event.update.type).toBe('widget.streaming_text.value_delta')
        })
    })

    describe('ProgressUpdateEvent', () => {
        it('should create progress event', () => {
            const event: ProgressUpdateEvent = {
                type: 'progress_update',
                message: 'Processing...',
                percent: 50,
                details: { step: 'analysis' }
            }

            expect(event.type).toBe('progress_update')
            expect(event.percent).toBe(50)
        })
    })

    describe('ErrorEvent', () => {
        it('should create error event', () => {
            const event: ErrorEvent = {
                type: 'error',
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'Missing required field',
                    details: { field: 'name' }
                }
            }

            expect(event.type).toBe('error')
            expect(event.error.code).toBe('INVALID_REQUEST')
        })
    })
})
