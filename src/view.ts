import { Byte, send } from "@bit-js/byte";

const view = `${import.meta.dir}/view`;

export default new Byte()
    .any('/passnplay', send.static(Bun.file(`${view}/passnplay.html`)));
