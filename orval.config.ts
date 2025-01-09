module.exports = {
  'booksharing': {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: './src/generated-api/booksharing.ts',
      schemas: 'src/generated-api/model',
      mutator: {
        path: './services/api/api.ts',
        name: 'api',
      }
    }
  }
};