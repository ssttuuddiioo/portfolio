export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tech',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Technologies used in this project',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'model3D',
      title: '3D Model',
      type: 'file',
      description: 'Upload a .glb or .gltf file',
      options: {
        accept: '.glb,.gltf',
      },
    },
    {
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this project on the homepage',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order in which projects are displayed',
    },
    {
      name: 'category',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Categories for filtering projects (e.g., Art, Commercial, Installation, etc.)',
      options: {
        list: [
          { title: 'Art', value: 'Art' },
          { title: 'Commercial', value: 'Commercial' },
          { title: 'Installation', value: 'Installation' },
          { title: 'Tools', value: 'Tools' },
          { title: 'Branding', value: 'Branding' },
          { title: 'Vibe Coded', value: 'Vibe Coded' },
          { title: 'Photography', value: 'Photography' },
          { title: 'Design', value: 'Design' },
          { title: 'Editing', value: 'Editing' },
          { title: 'AR/XR', value: 'AR/XR' },
          { title: 'Motion Graphics', value: 'Motion Graphics' },
          { title: 'Neat Ideas', value: 'Neat Ideas' },
        ],
      },
    },
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}







