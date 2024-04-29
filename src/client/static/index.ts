import { Byte, send } from '@bit-js/byte';
import './build';

const dir = `${import.meta.dir}/public/`;

export default new Byte()
    .any('/*', (ctx) => send.body(Bun.file(dir + ctx.params.$)));

