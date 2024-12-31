import { router } from '@mapl/app';

import views from './views.ts';
import serveStatic from './static.ts';
import ws from './ws/index.ts';

export default router()
  .route('/', views)
  .route('/static', serveStatic)
  .route('/ws', ws);
