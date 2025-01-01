import { router } from '@mapl/app';

import views from './views.ts';
import ws from './ws/index.ts';

export default router()
  // Serve static
  .get('/**', (c) => Bun.file('./public/' + c.params[0]))

  // Other stuff
  .route('/', views)
  .route('/ws', ws);
