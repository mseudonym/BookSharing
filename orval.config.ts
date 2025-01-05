export default {
  'booksharing': {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: './src/generated-api/booksharing.ts',
      schemas: 'src/generated-api/model',
      client: 'react-query',
      baseUrl: process.env.BS_API_BASE_URL,
    }
  }
};