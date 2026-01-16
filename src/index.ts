/**
 * TypeScript ChatKit
 * 
 * A TypeScript implementation of the OpenAI ChatKit server SDK.
 * Provides widgets, streaming events, and protocol types for building
 * rich chat interfaces.
 * 
 * @packageDocumentation
 */

// Widget types and builders
export {
    // Widget root types
    Card,
    ListView,
    ListViewItem,
    WidgetRoot,
    WidgetComponent,
    
    // Layout components
    Row,
    Col,
    Box,
    Divider,
    Spacer,
    
    // Text components
    Text,
    Title,
    Caption,
    Markdown,
    Badge,
    
    // Interactive components
    Button,
    Input,
    Textarea,
    Select,
    SelectOption,
    Checkbox,
    RadioGroup,
    RadioOption,
    DatePicker,
    Form,
    
    // Media components
    Icon,
    Image,
    
    // Utility types
    WidgetStatus,
    ThemeColor,
    Spacing,
    Border,
    ActionConfig,
} from './widgets'

// Event types for streaming
export {
    // Thread events
    ThreadCreatedEvent,
    ThreadUpdatedEvent,
    ThreadItemAddedEvent,
    ThreadItemUpdatedEvent,
    ThreadItemDoneEvent,
    ThreadItemRemovedEvent,
    ThreadItemReplacedEvent,
    ThreadStreamEvent,
    
    // Progress and status
    ProgressUpdateEvent,
    ErrorEvent,
    NoticeEvent,
    StreamOptionsEvent,
    
    // Thread items
    ThreadItem,
    WidgetItem,
    UserMessageItem,
    AssistantMessageItem,
    
    // Update types
    ThreadItemUpdate,
    AssistantMessageContentPartAdded,
    AssistantMessageContentPartTextDelta,
    AssistantMessageContentPartDone,
    
    // Widget update types
    WidgetUpdate,
    WidgetStreamingTextValueDelta,
    WidgetRootUpdated,
    WidgetComponentUpdated,
} from './events'

// Request/Response types
export {
    // Request types
    ChatKitRequest,
    ThreadsCreateRequest,
    ThreadsAddUserMessageRequest,
    ThreadsListRequest,
    ThreadsCustomActionRequest,
    
    // Response types
    Page,
    Thread,
    ThreadMetadata,
} from './protocol'

// Template support
export { WidgetTemplate } from './template'
export type { WidgetTemplateDefinition, TemplateContext } from './template'

// Server utilities
export { 
    // SSE formatting
    formatSSE,
    generateId,
    timestamp,
    
    // Event creators
    createThreadCreatedEvent,
    createWidgetEvent,
    createWidgetAddedEvent,
    createTextDeltaEvent,
    createAssistantMessageAddedEvent,
    createAssistantMessageDoneEvent,
    createUserMessageDoneEvent,
    
    // Widget update creators
    createWidgetRootUpdatedEvent,
    createWidgetTextDeltaEvent,
    
    // Streaming generators
    streamWidget,
    streamText,
} from './streaming'
