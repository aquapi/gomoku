import { router } from '@mapl/app';
import handleRoom from './room';

export default router()
  .get('/room', {
    type: 'response',
    fn: (c) => {
      const roomId = new URL(c.req.url).searchParams.get('id');
      if (roomId !== null && handleRoom(c.req, [roomId, 0, null, '']))
        return;

      return new Response();
    }
  });
