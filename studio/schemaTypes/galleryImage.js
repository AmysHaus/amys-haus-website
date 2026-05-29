export default {
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    {
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Display order (1, 2, 3…)',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location / Property',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'image' },
  },
}
