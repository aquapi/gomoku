import { Byte } from '@bit-js/byte';

import serveStatic from './static';
import serveView from './view';

export default Byte
    .route('/static', serveStatic)
    .route('/', serveView);
