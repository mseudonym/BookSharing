import {defineConfig} from 'orval'

export default defineConfig({
    'booksharing': {
        input: './swagger.json',
        output: {
            mode: 'tags-split',
            target: './src/generated-api/booksharing.ts',
            schemas: 'src/generated-api/model',
            client: 'react-query',
            override: {
                mutator: {
                    path: './src/services/api.ts',
                    name: 'api',

                }
            }
        }
    }
});
