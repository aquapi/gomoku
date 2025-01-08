import { jitc } from '@mapl/app';
import { autoServe } from 'ws-routers/bun';

import routes from './routes/index.ts';

const options = await jitc(routes);
export const server = autoServe({
  ...options,
  port: +(process.env.PORT ?? 3000),
  lowMemoryMode: true
});
