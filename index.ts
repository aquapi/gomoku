import { Byte, send } from '@bit-js/byte';
import { ws } from '@bit-js/bun-utils';
import client from './src/client';

const app = Byte.route('/', client);

ws.serve({
    server: {
        fetch: app.fetch,
        error: send.static(null, { status: 404 })
    }
});
