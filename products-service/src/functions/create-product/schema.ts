export default {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'stringnumber' },
  },
  required: ['title', 'description', 'price'],
} as const;
