// sanity/schemas/galleryImage.js
// Portfolio gallery schema — for the homepage gallery section

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
      description: 'Internal name for this image (not displayed publicly)',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Short caption shown on hover overlay',
    },
    {
      name: 'location',
      title: 'Location / Property',
      type: 'string',
      description: 'e.g. "Nashville, TN" or "The Hermitage Hotel" — shown on hover if set',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured images get larger grid positions',
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle || 'No location set', media };
    },
  },
};
