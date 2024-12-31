import { router } from '@mapl/app';
import handleRoom from './room';

export default router()
  .get('/room', {
    type: 'response',
    fn: (c) => {
      const roomId = new URLSearchParams(c.req.url).get('id');
      console.log(roomId);
      if (roomId !== null && handleRoom(c.req, [roomId, 0, null, '']))
        return null as unknown as Response;

      return new Response();
    }
  });
