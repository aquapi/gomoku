import { Byte, send } from '@bit-js/byte';
import { ws } from '@bit-js/bun-utils';

import serveStatic from './src/static';
import serveView from './src/view';

const app = Byte
    .route('/static', serveStatic)
    .route('/', serveView);

ws.serve({
    server: {
        fetch: app.fetch,
        error: send.static(null, { status: 404 })
    }
});
