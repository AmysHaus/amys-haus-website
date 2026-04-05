const service = {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Display order (1, 2, 3...)',
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
      description: 'e.g. "Guest Experience Audit"',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One sentence shown on homepage cards',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'includes',
      title: "What's Included",
      type: 'array',
      of: [{ type: 'string' }],
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
    },
    {
      name: 'featured',
      title: 'Featured (Entry Point)',
      type: 'boolean',
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
    select: { title: 'title', subtitle: 'subtitle' },
  },
};

export default service;
