/**
 * Streaming utilities for creating SSE events
 * 
 * The ChatKit frontend expects Server-Sent Events in the format:
 * `data: {JSON}\n\n`
 */

import { v4 as uuidv4 } from 'uuid'
import { WidgetRoot } from './widgets'
import {
    ThreadStreamEvent,
    ThreadCreatedEvent,
    ThreadItemDoneEvent,
    ThreadItemAddedEvent,
    ThreadItemUpdatedEvent,
    WidgetItem,
    AssistantMessageItem,
    UserMessageItem,
    AssistantMessageContentPartTextDelta,
    WidgetRootUpdated,
    WidgetStreamingTextValueDelta,
} from './events'

/**
 * Format an event for SSE streaming
 */
export function formatSSE(event: ThreadStreamEvent): string {
    return `data: ${JSON.stringify(event)}\n\n`
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return uuidv4()
}

/**
 * Get current timestamp in ISO format
 */
export function timestamp(): string {
    return new Date().toISOString()
}

/**
 * Create a thread.created event
 */
export function createThreadCreatedEvent(
    threadId: string = generateId(),
    metadata?: Record<string, unknown>
): ThreadCreatedEvent {
    return {
        type: 'thread.created',
        thread: {
            id: threadId,
            created_at: timestamp(),
            metadata,
        }
    }
}

/**
 * Create a thread.item.added event for a widget
 */
export function createWidgetAddedEvent(
    widget: WidgetRoot,
    threadId: string,
    itemId: string = generateId()
): ThreadItemAddedEvent {
    const item: WidgetItem = {
        type: 'widget',
        id: itemId,
        thread_id: threadId,
        created_at: timestamp(),
        widget,
    }
    
    return {
        type: 'thread.item.added',
        item,
    }
}

/**
 * Create a thread.item.done event for a widget
 */
export function createWidgetEvent(
    widget: WidgetRoot,
    threadId: string,
    itemId: string = generateId(),
    copyText?: string
): ThreadItemDoneEvent {
    const item: WidgetItem = {
        type: 'widget',
        id: itemId,
        thread_id: threadId,
        created_at: timestamp(),
        widget,
        copy_text: copyText,
    }
    
    return {
        type: 'thread.item.done',
        item,
    }
}

/**
 * Create a thread.item.done event for a user message
 * This echoes back the user's message to confirm receipt
 */
export function createUserMessageDoneEvent(
    threadId: string,
    content: string,
    itemId: string = generateId()
): ThreadItemDoneEvent {
    const item: UserMessageItem = {
        type: 'user_message',
        id: itemId,
        thread_id: threadId,
        created_at: timestamp(),
        content: [{ type: 'input_text', text: content }],
        attachments: [],
    }
    
    return {
        type: 'thread.item.done',
        item,
    }
}

/**
 * Create a thread.item.added event for an assistant message
 */
export function createAssistantMessageAddedEvent(
    threadId: string,
    itemId: string = generateId()
): ThreadItemAddedEvent {
    const item: AssistantMessageItem = {
        type: 'assistant_message',
        id: itemId,
        thread_id: threadId,
        created_at: timestamp(),
        content: [],
    }
    
    return {
        type: 'thread.item.added',
        item,
    }
}

/**
 * Create a text delta event for streaming text
 */
export function createTextDeltaEvent(
    itemId: string,
    _threadId: string,  // Not used in new format but kept for backward compatibility
    delta: string,
    index: number = 0
): ThreadItemUpdatedEvent {
    const updatePayload: AssistantMessageContentPartTextDelta = {
        type: 'assistant_message.content_part.text_delta',
        content_index: index,
        delta,
    }
    
    return {
        type: 'thread.item.updated',
        item_id: itemId,
        update: updatePayload,
    }
}

/**
 * Create a widget root updated event for replacing entire widget content.
 * Use this for updating non-text content like images.
 * 
 * @example
 * // Update browser widget with new screenshot
 * const event = createWidgetRootUpdatedEvent('widget-123', {
 *     type: 'Card',
 *     children: [
 *         { type: 'Image', src: `data:image/jpeg;base64,${screenshot}` },
 *         { type: 'Text', value: 'Clicking login button...' }
 *     ]
 * })
 */
export function createWidgetRootUpdatedEvent(
    itemId: string,
    widget: WidgetRoot
): ThreadItemUpdatedEvent {
    const update: WidgetRootUpdated = {
        type: 'widget.root.updated',
        widget,
    }
    
    return {
        type: 'thread.item.updated',
        item_id: itemId,
        update,
    }
}

/**
 * Create a widget streaming text delta event.
 * Use for incremental text updates in Text/Markdown components with an `id`.
 * The component must have `streaming: true` for smooth transitions.
 * 
 * @example
 * const event = createWidgetTextDeltaEvent('widget-123', 'status-text', ' world!', false)
 */
export function createWidgetTextDeltaEvent(
    itemId: string,
    componentId: string,
    delta: string,
    done: boolean = false
): ThreadItemUpdatedEvent {
    const update: WidgetStreamingTextValueDelta = {
        type: 'widget.streaming_text.value_delta',
        component_id: componentId,
        delta,
        done,
    }
    
    return {
        type: 'thread.item.updated',
        item_id: itemId,
        update,
    }
}

/**
 * Create a thread.item.done event for an assistant message
 */
export function createAssistantMessageDoneEvent(
    threadId: string,
    itemId: string,
    content: string
): ThreadItemDoneEvent {
    const item: AssistantMessageItem = {
        type: 'assistant_message',
        id: itemId,
        thread_id: threadId,
        created_at: timestamp(),
        content: [{ type: 'output_text', text: content, annotations: [] }],
    }
    
    return {
        type: 'thread.item.done',
        item,
    }
}

/**
 * Helper to stream a widget with proper event sequence
 * 
 * @example
 * ```typescript
 * for (const event of streamWidget(cardWidget, 'thread-123')) {
 *     res.write(formatSSE(event))
 * }
 * ```
 */
export function* streamWidget(
    widget: WidgetRoot,
    threadId: string,
    options: { copyText?: string } = {}
): Generator<ThreadStreamEvent> {
    const itemId = generateId()
    
    // First emit added event
    yield createWidgetAddedEvent(widget, threadId, itemId)
    
    // Then emit done event
    yield createWidgetEvent(widget, threadId, itemId, options.copyText)
}

/**
 * Helper to stream text character by character
 * 
 * @example
 * ```typescript
 * for await (const event of streamText('Hello!', 'thread-123', 50)) {
 *     res.write(formatSSE(event))
 * }
 * ```
 */
export async function* streamText(
    text: string,
    threadId: string,
    delayMs: number = 20
): AsyncGenerator<ThreadStreamEvent> {
    const itemId = generateId()
    
    // Emit added event
    yield createAssistantMessageAddedEvent(threadId, itemId)
    
    // Emit text deltas
    for (const char of text) {
        yield createTextDeltaEvent(itemId, threadId, char)
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    }
    
    // Emit done event
    yield createAssistantMessageDoneEvent(threadId, itemId, text)
}
