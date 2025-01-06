const input = await Bun.file(import.meta.dir + '/input.svg').text();

const themes = new Array(2).fill(0).map(() => new Array(12));
let idx = -24, idMod: number;

new HTMLRewriter().on('rect', {
  element(el) {
    console.log(el)
    if (el.getAttribute('width') === '96' && el.getAttribute('height') === '48' && el.hasAttribute('fill')) {
      if (idx < 0) {
        idx++;
        return;
      }

      idMod = idx % 12;
      themes[(idx - idMod) / 12][idMod] = el.getAttribute('fill');
      idx++;
    }
  }
}).transform(input);

console.log(themes);
