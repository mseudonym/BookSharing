export default {
  'booksharing-file': {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: './src/booksharing.ts',
      schemas: 'src/model',
      client: 'react-query'
    }
  }
};