import { router } from '@mapl/app';

import routes from './routes/index.ts';

export default router()
  .route('/', routes);
