import { router } from '@mapl/app';

export default router()
  .get('/**', (c) => Bun.file('./public/' + c.params[0]));
