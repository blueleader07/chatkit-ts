/**
 * Widget type definitions for ChatKit
 * 
 * Types are auto-generated from Python chatkit Pydantic models.
 * To regenerate: npm run generate
 */

// Export all generated types from Python chatkit
export * from './generated/widgets.generated'

// Import types we need for aliases
import type {
    Card as CardType,
    Text as TextType,
    Title as TitleType,
    Caption as CaptionType,
    Chart as ChartType,
    Badge as BadgeType,
    Markdown as MarkdownType,
    Box as BoxType,
    Row as RowType,
    Col as ColType,
    Divider as DividerType,
    Icon as IconType,
    Image as ImageType,
    ListViewItem as ListViewItemType,
    Button as ButtonType,
    Checkbox as CheckboxType,
    Spacer as SpacerType,
    Select as SelectType,
    DatePicker as DatePickerType,
    Form as FormType,
    Input as InputType,
    RadioGroup as RadioGroupType,
    Textarea as TextareaType,
    Transition as TransitionType,
    DynamicWidgetComponent,
    WidgetStatusWithFavicon,
    WidgetStatusWithIcon,
} from './generated/widgets.generated'

// Re-export commonly used types with cleaner names for convenience
export type {
    Card,
    Row,
    Col,
    Box,
    Divider,
    Spacer,
    Text,
    Title,
    Caption,
    Markdown,
    Badge,
    Button,
    Input,
    Textarea,
    Select,
    Checkbox,
    RadioGroup,
    DatePicker,
    Form,
    Icon,
    Image,
    Chart,
    Transition,
    ListViewItem,
    WidgetStatusWithFavicon,
    WidgetStatusWithIcon,
    ActionConfig,
    ThemeColor,
    Spacing,
    DynamicWidgetComponent,
} from './generated/widgets.generated'

// Helper type aliases for our streaming/template code
export type WidgetStatus = WidgetStatusWithFavicon | WidgetStatusWithIcon

// Union of all widget component types (for children arrays)
export type WidgetComponent =
    | TextType
    | TitleType
    | CaptionType
    | ChartType
    | BadgeType
    | MarkdownType
    | BoxType
    | RowType
    | ColType
    | DividerType
    | IconType
    | ImageType
    | ListViewItemType
    | ButtonType
    | CheckboxType
    | SpacerType
    | SelectType
    | DatePickerType
    | FormType
    | InputType
    | RadioGroupType
    | TextareaType
    | TransitionType
    | DynamicWidgetComponent

// Root widget types that can be rendered at top level
export type WidgetRoot = CardType | ListView

// ListView needs to be created from the Card schema - it's similar
// For now, export a type alias that uses Card structure
export interface ListView {
    type: 'ListView'
    title?: string
    items: ListViewItemType[]
    status?: WidgetStatus
    emptyMessage?: string
}

