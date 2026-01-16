import {
    Card,
    Text,
    Button,
    Row,
    Badge,
    ActionConfig,
    WidgetRoot,
    ListView,
} from '../src/widgets'

describe('Widget Types', () => {
    describe('Card', () => {
        it('should create a valid card widget', () => {
            const card: Card = {
                type: 'Card',
                title: 'Test Card',
                subtitle: 'A subtitle',
                status: { text: 'Completed' },
                children: []
            }

            expect(card.type).toBe('Card')
            expect(card.title).toBe('Test Card')
            expect(card.status?.text).toBe('Completed')
        })

        it('should support nested children', () => {
            const card: Card = {
                type: 'Card',
                title: 'Nested Card',
                children: [
                    {
                        type: 'Text',
                        value: 'Hello world'
                    },
                    {
                        type: 'Row',
                        gap: 'sm',
                        children: [
                            {
                                type: 'Badge',
                                label: 'New',
                                color: 'success'
                            }
                        ]
                    }
                ]
            }

            expect(card.children).toHaveLength(2)
            expect(card.children![0].type).toBe('Text')
            expect(card.children![1].type).toBe('Row')
        })
    })

    describe('Button', () => {
        it('should create a button with action', () => {
            const action: ActionConfig = {
                type: 'submit',
                payload: { formId: '123' },
                handler: 'server',
                loadingBehavior: 'self'
            }

            const button: Button = {
                type: 'Button',
                label: 'Submit',
                variant: 'solid',
                onClickAction: action
            }

            expect(button.type).toBe('Button')
            expect(button.label).toBe('Submit')
            expect(button.variant).toBe('solid')
            expect(button.onClickAction?.type).toBe('submit')
            expect(button.onClickAction?.handler).toBe('server')
        })

        it('should support all variants', () => {
            const variants = ['solid', 'soft', 'outline', 'ghost'] as const
            
            variants.forEach(variant => {
                const button: Button = {
                    type: 'Button',
                    label: 'Test',
                    variant
                }
                expect(button.variant).toBe(variant)
            })
        })
    })

    describe('Text', () => {
        it('should create text with styling', () => {
            const text: Text = {
                type: 'Text',
                value: 'Styled text',
                size: 'lg',
                weight: 'bold',
                color: 'primary',
                align: 'center'
            }

            expect(text.value).toBe('Styled text')
            expect(text.size).toBe('lg')
            expect(text.weight).toBe('bold')
        })
    })

    describe('Badge', () => {
        it('should create badge with theme color', () => {
            const badge: Badge = {
                type: 'Badge',
                label: 'Status',
                color: 'success',
                variant: 'soft'
            }

            expect(badge.label).toBe('Status')
            expect(badge.color).toBe('success')
            expect(badge.variant).toBe('soft')
        })
    })

    describe('Row', () => {
        it('should create row with layout properties', () => {
            const row: Row = {
                type: 'Row',
                gap: 'md',
                justify: 'between',
                align: 'center',
                wrap: 'wrap',
                children: []
            }

            expect(row.gap).toBe('md')
            expect(row.justify).toBe('between')
            expect(row.align).toBe('center')
            expect(row.wrap).toBe('wrap')
        })
    })

    describe('WidgetRoot', () => {
        it('should accept Card as root', () => {
            const widget: WidgetRoot = {
                type: 'Card',
                title: 'Root Card',
                children: []
            }

            expect(widget.type).toBe('Card')
        })

        it('should accept ListView as root', () => {
            const widget: ListView = {
                type: 'ListView',
                title: 'Items',
                items: [
                    {
                        type: 'ListViewItem',
                        key: 'item-1',
                        children: []
                    }
                ]
            }

            expect(widget.type).toBe('ListView')
        })
    })
})
