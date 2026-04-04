// sanity/schemas/service.js
// Service tier schema — for The Haus Walk, Full Haus Refresh, Ongoing Partnership

export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Display order (1, 2, 3…)',
    },
    {
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'e.g. "01", "02", "03"',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Type',
      type: 'string',
      description: 'e.g. "Hospitality Experience Audit"',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Used for anchor links — e.g. "haus-walk"',
    },
    {
      name: 'tagline',
      title: 'Tagline (short)',
      type: 'string',
      description: 'One sentence for cards and previews',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full service description (rich text)',
    },
    {
      name: 'includes',
      title: "What's Included",
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet list of inclusions',
    },
    {
      name: 'investment',
      title: 'Investment / Pricing',
      type: 'string',
      description: 'e.g. "$1,500 – $3,500 + travel"',
    },
    {
      name: 'investmentNote',
      title: 'Investment Note',
      type: 'string',
      description: 'e.g. "50% upfront, 50% on completion"',
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      initialValue: 'Book a Discovery Call',
    },
    {
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      description: 'Defaults to contact page if blank',
    },
    {
      name: 'featured',
      title: 'Featured (Entry Point)',
      type: 'boolean',
      description: 'Mark as the primary / entry-point offer',
      initialValue: false,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
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
    select: { title: 'title', subtitle: 'subtitle', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
};
