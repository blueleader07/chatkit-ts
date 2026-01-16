/**
 * Protocol types for ChatKit API requests and responses
 */

// =============================================================================
// REQUEST TYPES
// =============================================================================

/** Base request type */
export interface ChatKitRequest {
    /** Thread ID for existing thread operations */
    thread_id?: string
    /** User ID */
    user_id?: string
}

/**
 * Request to create a new thread
 */
export interface ThreadsCreateRequest extends ChatKitRequest {
    /** Initial metadata for the thread */
    metadata?: Record<string, unknown>
}

/**
 * Request to add a user message to a thread
 */
export interface ThreadsAddUserMessageRequest extends ChatKitRequest {
    /** Thread ID (required) */
    thread_id: string
    /** Message content */
    content: string
}

/**
 * Request to list threads
 */
export interface ThreadsListRequest extends ChatKitRequest {
    /** Maximum number of threads to return */
    limit?: number
    /** Cursor for pagination */
    cursor?: string
    /** Filter by metadata */
    metadata_filter?: Record<string, unknown>
}

/**
 * Request for custom action on a thread
 */
export interface ThreadsCustomActionRequest extends ChatKitRequest {
    /** Thread ID (required) */
    thread_id: string
    /** Action type */
    action_type: string
    /** Action payload */
    payload?: Record<string, unknown>
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

/**
 * Pagination wrapper
 */
export interface Page<T> {
    /** Items in this page */
    data: T[]
    /** Whether there are more items */
    has_more: boolean
    /** Cursor for next page */
    next_cursor?: string
}

/**
 * Thread metadata
 */
export interface ThreadMetadata {
    /** Custom title for the thread */
    title?: string
    /** Thread status */
    status?: 'active' | 'archived'
    /** Any additional metadata */
    [key: string]: unknown
}

/**
 * Thread object
 */
export interface Thread {
    /** Thread ID */
    id: string
    /** When thread was created (ISO string) */
    created_at: string
    /** When thread was last updated (ISO string) */
    updated_at?: string
    /** Thread metadata */
    metadata?: ThreadMetadata
}
