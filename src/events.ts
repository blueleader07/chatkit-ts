/**
 * Event types for ChatKit streaming protocol
 * 
 * These match the SSE events expected by the frontend.
 * Format: `data: {JSON}\n\n`
 */

import { WidgetRoot } from './widgets'

// =============================================================================
// THREAD ITEM TYPES
// =============================================================================

/** Base properties for all thread items */
export interface ThreadItemBase {
    /** Unique item ID */
    id: string
    /** Thread this item belongs to */
    thread_id: string
    /** When the item was created (ISO string) */
    created_at: string
}

/**
 * Widget item - displays a rich widget in the chat
 */
export interface WidgetItem extends ThreadItemBase {
    type: 'widget'
    /** The widget content */
    widget: WidgetRoot
    /** Optional text for copy functionality */
    copy_text?: string
}

/**
 * Content part for user messages
 */
export interface UserMessageContentPart {
    type: 'input_text'
    text: string
}

/**
 * User message item
 */
export interface UserMessageItem extends ThreadItemBase {
    type: 'user_message'
    /** Message content parts */
    content: UserMessageContentPart[]
    /** Attachments */
    attachments?: unknown[]
    /** User ID */
    user_id?: string
}

/**
 * Content part for assistant messages
 */
export interface AssistantMessageContentPart {
    type: 'output_text'
    text: string
    annotations?: unknown[]
}

/**
 * Assistant message item
 */
export interface AssistantMessageItem extends ThreadItemBase {
    type: 'assistant_message'
    /** Message content parts */
    content: AssistantMessageContentPart[]
}

/** All thread item types */
export type ThreadItem = WidgetItem | UserMessageItem | AssistantMessageItem

// =============================================================================
// THREAD EVENTS
// =============================================================================

/**
 * Emitted when a new thread is created
 */
export interface ThreadCreatedEvent {
    type: 'thread.created'
    thread: {
        id: string
        created_at: string
        metadata?: Record<string, unknown>
    }
}

/**
 * Emitted when thread metadata is updated
 */
export interface ThreadUpdatedEvent {
    type: 'thread.updated'
    thread: {
        id: string
        metadata?: Record<string, unknown>
    }
}

// =============================================================================
// THREAD ITEM EVENTS
// =============================================================================

/**
 * Emitted when a new item is added to a thread
 */
export interface ThreadItemAddedEvent {
    type: 'thread.item.added'
    item: ThreadItem
}

/**
 * Content part added to assistant message
 */
export interface AssistantMessageContentPartAdded {
    type: 'assistant_message.content_part.added'
    content_index: number
    content: AssistantMessageContentPart
}

/**
 * Text delta for streaming text
 */
export interface AssistantMessageContentPartTextDelta {
    type: 'assistant_message.content_part.text_delta'
    content_index: number
    delta: string
}

/**
 * Content part done
 */
export interface AssistantMessageContentPartDone {
    type: 'assistant_message.content_part.done'
    content_index: number
    content: AssistantMessageContentPart
}

// =============================================================================
// WIDGET UPDATE TYPES
// =============================================================================

/**
 * Widget streaming text value delta - incremental text updates
 * For Text/Markdown components with an `id` and `streaming: true`
 */
export interface WidgetStreamingTextValueDelta {
    type: 'widget.streaming_text.value_delta'
    /** ID of the component being updated */
    component_id: string
    /** Text to append */
    delta: string
    /** Whether streaming is complete for this component */
    done: boolean
}

/**
 * Widget root updated - replace entire widget tree
 * Use when image or non-streaming content changes
 */
export interface WidgetRootUpdated {
    type: 'widget.root.updated'
    /** The new widget content */
    widget: WidgetRoot
}

/**
 * Widget component updated - update specific component properties
 */
export interface WidgetComponentUpdated {
    type: 'widget.component.updated'
    /** ID of the component to update */
    component_id: string
    /** Properties to update */
    properties: Record<string, unknown>
}

/** All widget update types */
export type WidgetUpdate = 
    | WidgetStreamingTextValueDelta 
    | WidgetRootUpdated 
    | WidgetComponentUpdated

/** All thread item update types */
export type ThreadItemUpdate = 
    | AssistantMessageContentPartAdded 
    | AssistantMessageContentPartTextDelta
    | AssistantMessageContentPartDone
    | WidgetUpdate

/**
 * Emitted when an item is being updated (e.g., streaming text, widget updates)
 */
export interface ThreadItemUpdatedEvent {
    type: 'thread.item.updated'
    /** ID of the item being updated */
    item_id: string
    /** The update to apply */
    update: ThreadItemUpdate
}

/**
 * Emitted when an item is complete
 */
export interface ThreadItemDoneEvent {
    type: 'thread.item.done'
    item: ThreadItem
}

/**
 * Emitted when an item is removed from a thread
 */
export interface ThreadItemRemovedEvent {
    type: 'thread.item.removed'
    item_id: string
    thread_id: string
}

/**
 * Emitted when an item is replaced with a new one
 */
export interface ThreadItemReplacedEvent {
    type: 'thread.item.replaced'
    old_item_id: string
    item: ThreadItem
}

// =============================================================================
// STATUS EVENTS
// =============================================================================

/**
 * Progress update during long operations
 */
export interface ProgressUpdateEvent {
    type: 'progress_update'
    message: string
    percent?: number
    /** Optional details */
    details?: Record<string, unknown>
}

/**
 * Error event
 */
export interface ErrorEvent {
    type: 'error'
    error: {
        code: string
        message: string
        details?: Record<string, unknown>
    }
}

/**
 * Notice/info event
 */
export interface NoticeEvent {
    type: 'notice'
    notice: {
        level: 'info' | 'warning' | 'error'
        message: string
    }
}

/**
 * Stream options/configuration event
 */
export interface StreamOptionsEvent {
    type: 'stream_options'
    options: {
        /** Whether input is enabled */
        input_enabled?: boolean
        /** Placeholder text for input */
        input_placeholder?: string
        /** Suggested responses */
        suggestions?: string[]
    }
}

// =============================================================================
// UNION TYPE
// =============================================================================

/** All possible streaming events */
export type ThreadStreamEvent =
    | ThreadCreatedEvent
    | ThreadUpdatedEvent
    | ThreadItemAddedEvent
    | ThreadItemUpdatedEvent
    | ThreadItemDoneEvent
    | ThreadItemRemovedEvent
    | ThreadItemReplacedEvent
    | ProgressUpdateEvent
    | ErrorEvent
    | NoticeEvent
    | StreamOptionsEvent
