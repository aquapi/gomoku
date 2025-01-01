import { jitc } from '@mapl/app';
import { autoServe } from 'ws-routers/bun';

import app from './src/index.ts';

const options = await jitc(app);
export const server = autoServe(options);