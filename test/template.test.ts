import { WidgetTemplate } from '../src/template'
import { Card } from '../src/widgets'

describe('WidgetTemplate', () => {
    describe('fromJson', () => {
        it('should parse template from JSON', () => {
            const json = JSON.stringify({
                name: 'test-template',
                description: 'A test template',
                widget: {
                    type: 'Card',
                    title: 'Static Title',
                    children: []
                }
            })

            const template = WidgetTemplate.fromJson(json)

            expect(template.name).toBe('test-template')
            expect(template.description).toBe('A test template')
        })
    })

    describe('render', () => {
        it('should substitute simple variables', () => {
            const template = WidgetTemplate.fromObject({
                name: 'greeting',
                widget: {
                    type: 'Card',
                    title: 'Hello, {{ name }}!',
                    children: []
                }
            })

            const widget = template.render({ name: 'John' }) as Card

            expect(widget.title).toBe('Hello, John!')
        })

        it('should substitute nested variables', () => {
            const template = WidgetTemplate.fromObject({
                name: 'user-card',
                widget: {
                    type: 'Card',
                    title: '{{ user.name }}',
                    subtitle: '{{ user.email }}',
                    children: []
                }
            })

            const widget = template.render({
                user: {
                    name: 'Jane',
                    email: 'jane@example.com'
                }
            }) as Card

            expect(widget.title).toBe('Jane')
            expect(widget.subtitle).toBe('jane@example.com')
        })

        it('should use default values', () => {
            const template = WidgetTemplate.fromObject({
                name: 'with-defaults',
                variables: {
                    title: {
                        type: 'string',
                        default: 'Default Title'
                    }
                },
                widget: {
                    type: 'Card',
                    title: '{{ title }}',
                    children: []
                }
            })

            const widget = template.render({}) as Card

            expect(widget.title).toBe('Default Title')
        })

        it('should override defaults with provided values', () => {
            const template = WidgetTemplate.fromObject({
                name: 'with-defaults',
                variables: {
                    title: {
                        type: 'string',
                        default: 'Default Title'
                    }
                },
                widget: {
                    type: 'Card',
                    title: '{{ title }}',
                    children: []
                }
            })

            const widget = template.render({ title: 'Custom Title' }) as Card

            expect(widget.title).toBe('Custom Title')
        })

        it('should throw for missing required variables', () => {
            const template = WidgetTemplate.fromObject({
                name: 'required-vars',
                variables: {
                    requiredField: {
                        type: 'string',
                        required: true
                    }
                },
                widget: {
                    type: 'Card',
                    title: '{{ requiredField }}',
                    children: []
                }
            })

            expect(() => template.render({})).toThrow("Required variable 'requiredField' not provided")
        })
    })

    describe('validate', () => {
        it('should return valid for complete context', () => {
            const template = WidgetTemplate.fromObject({
                name: 'validation-test',
                variables: {
                    required1: { type: 'string', required: true },
                    required2: { type: 'string', required: true },
                    optional: { type: 'string' }
                },
                widget: {
                    type: 'Card',
                    title: 'Test',
                    children: []
                }
            })

            const result = template.validate({
                required1: 'value1',
                required2: 'value2'
            })

            expect(result.valid).toBe(true)
            expect(result.missing).toEqual([])
        })

        it('should return missing variables', () => {
            const template = WidgetTemplate.fromObject({
                name: 'validation-test',
                variables: {
                    required1: { type: 'string', required: true },
                    required2: { type: 'string', required: true }
                },
                widget: {
                    type: 'Card',
                    title: 'Test',
                    children: []
                }
            })

            const result = template.validate({ required1: 'value1' })

            expect(result.valid).toBe(false)
            expect(result.missing).toContain('required2')
        })
    })
})
