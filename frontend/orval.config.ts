import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(process.cwd(), '.env') });
config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

import { defineConfig } from 'orval';

export default defineConfig({
  booksharing: {
    input: {
      target: process.env.VITE_BS_API_BASE_URL + process.env.OPEN_API_SCHEMA_ROUTE,
    },
    output: {
      mode: 'tags-split',
      target: './src/generated-api/booksharing.ts',
      schemas: 'src/generated-api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/services/api.ts',
          name: 'api',
        },
      },
    },
  },
});
