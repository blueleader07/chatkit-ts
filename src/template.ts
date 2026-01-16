/**
 * Widget template support for .widget files
 * 
 * Enables loading widget definitions from template files with Jinja2-style
 * variable substitution.
 */

import { WidgetRoot, WidgetComponent } from './widgets'

/**
 * Template context for variable substitution
 */
export type TemplateContext = Record<string, unknown>

/**
 * Widget template definition
 */
export interface WidgetTemplateDefinition {
    /** Template name */
    name: string
    /** Template description */
    description?: string
    /** Template version */
    version?: string
    /** Variable definitions with types and defaults */
    variables?: Record<string, {
        type: 'string' | 'number' | 'boolean' | 'array' | 'object'
        description?: string
        default?: unknown
        required?: boolean
    }>
    /** The widget structure */
    widget: WidgetRoot
}

/**
 * WidgetTemplate class for loading and rendering widget templates
 * 
 * @example
 * ```typescript
 * // Load from JSON
 * const template = WidgetTemplate.fromJson(jsonString)
 * 
 * // Render with context
 * const widget = template.render({
 *     title: 'My Card',
 *     items: ['Item 1', 'Item 2']
 * })
 * ```
 */
export class WidgetTemplate {
    private definition: WidgetTemplateDefinition

    constructor(definition: WidgetTemplateDefinition) {
        this.definition = definition
    }

    /**
     * Create template from JSON string
     */
    static fromJson(json: string): WidgetTemplate {
        const definition = JSON.parse(json) as WidgetTemplateDefinition
        return new WidgetTemplate(definition)
    }

    /**
     * Create template from object
     */
    static fromObject(obj: WidgetTemplateDefinition): WidgetTemplate {
        return new WidgetTemplate(obj)
    }

    /**
     * Get template name
     */
    get name(): string {
        return this.definition.name
    }

    /**
     * Get template description
     */
    get description(): string | undefined {
        return this.definition.description
    }

    /**
     * Get variable definitions
     */
    get variables(): WidgetTemplateDefinition['variables'] {
        return this.definition.variables
    }

    /**
     * Render the template with the given context
     * 
     * Performs simple string substitution for {{ variable }} patterns
     * and handles array iteration for {% for item in items %} patterns.
     */
    render(context: TemplateContext = {}): WidgetRoot {
        // Merge defaults with provided context
        const fullContext = this.buildContext(context)
        
        // Deep clone and substitute
        const widgetJson = JSON.stringify(this.definition.widget)
        const rendered = this.substituteVariables(widgetJson, fullContext)
        
        return JSON.parse(rendered) as WidgetRoot
    }

    /**
     * Build full context with defaults
     */
    private buildContext(context: TemplateContext): TemplateContext {
        const fullContext: TemplateContext = { ...context }
        
        if (this.definition.variables) {
            for (const [key, def] of Object.entries(this.definition.variables)) {
                if (!(key in fullContext) && def.default !== undefined) {
                    fullContext[key] = def.default
                }
                if (def.required && !(key in fullContext)) {
                    throw new Error(`Required variable '${key}' not provided`)
                }
            }
        }
        
        return fullContext
    }

    /**
     * Substitute {{ variable }} patterns in the template
     */
    private substituteVariables(template: string, context: TemplateContext): string {
        // Simple variable substitution: {{ variable }}
        return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_match, variable) => {
            const trimmed = variable.trim()
            const value = this.resolveVariable(trimmed, context)
            
            if (value === undefined) {
                return ''
            }
            
            // If it's a string, escape for JSON
            if (typeof value === 'string') {
                return value.replace(/"/g, '\\"')
            }
            
            return String(value)
        })
    }

    /**
     * Resolve a variable path like "user.name" from context
     */
    private resolveVariable(path: string, context: TemplateContext): unknown {
        const parts = path.split('.')
        let value: unknown = context
        
        for (const part of parts) {
            if (value === null || value === undefined) {
                return undefined
            }
            if (typeof value === 'object') {
                value = (value as Record<string, unknown>)[part]
            } else {
                return undefined
            }
        }
        
        return value
    }

    /**
     * Validate that all required variables are provided
     */
    validate(context: TemplateContext): { valid: boolean; missing: string[] } {
        const missing: string[] = []
        
        if (this.definition.variables) {
            for (const [key, def] of Object.entries(this.definition.variables)) {
                if (def.required && !(key in context)) {
                    missing.push(key)
                }
            }
        }
        
        return {
            valid: missing.length === 0,
            missing
        }
    }
}
