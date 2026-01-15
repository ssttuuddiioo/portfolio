export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'pressHighlightsTitle',
      title: 'Press Highlights Section Title',
      type: 'string',
      description: 'The heading for the press highlights section',
      initialValue: 'Press Highlights',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroTitle',
      title: 'Hero Section Title',
      type: 'text',
      description: 'The main intro text on the homepage',
      rows: 6,
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Your contact email address',
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
        {
          name: 'github',
          title: 'GitHub URL',
          type: 'url',
        },
      ],
    },
    {
      name: 'workIntroText',
      title: 'Work Section Intro Text',
      type: 'text',
      description: 'The paragraph text displayed at the top left of the work section',
      rows: 4,
      initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis, dolor sed consectetur gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    },
  ],
}

