import { router } from '@mapl/app';
import buildTheme from '@/utils/buildTheme';

import * as radixThemes from '@radix-ui/colors';

// List all themes
const themeList = ['default'];

// Build default theme
Bun.write('./themes/default.css', buildTheme(
  ['#111110', '#191918', '#222221', '#2a2a28', '#31312e', '#3b3a37', '#494844', '#62605b', '#6f6d66', '#7c7b74', '#b5b3ad', '#eeeeec']
));

// Build radix themes
for (const name in radixThemes) {
  themeList.push(`radix/${name}`);
  Bun.write(`./themes/radix/${name}.css`, buildTheme(Object.values(radixThemes[name as keyof typeof radixThemes])));
}

export default router()
  // Serve static
  .get('/**', (c) => Bun.file('./themes/' + c.params[0]))
  .build('/', () => themeList.join())
