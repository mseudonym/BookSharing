export default {
  'booksharing-file': {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: 'src/api/booksharing.ts',
      schemas: 'src/api/model',
      client: 'react-query'
    }
  }
};