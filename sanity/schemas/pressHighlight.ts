export default {
  name: 'pressHighlight',
  title: 'Press Highlight',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The article headline',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Publication date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publication',
      title: 'Publication',
      type: 'string',
      description: 'Source (e.g., "Domus", "Artnet", "ELLE")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Article URL',
      type: 'url',
      description: 'Link to the article',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this press item',
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date (Oldest First)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
}

