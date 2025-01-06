import { router } from '@mapl/app';
import buildTheme from '@/utils/buildTheme';

import * as radixThemes from '@radix-ui/colors';
import { DIST as ROOT } from '@/config';

const DIST = ROOT + 'themes/';
const RADIX = 'radix/';
const RADIX_DIST = DIST + RADIX;

// List all themes
export const themeList: string[] = [];

// Build default themes
const defaultThemes = {
  default: [
    '#111110', '#191918', '#222221', '#2a2a28',
    '#31312e', '#3b3a37', '#494844', '#62605b',
    '#6f6d66', '#7c7b74', '#b5b3ad', '#eeeeec'
  ]
}
for (const name in defaultThemes) {
  themeList.push(name);
  Bun.write(DIST + name + '.css', buildTheme(defaultThemes[name as keyof typeof defaultThemes]));
}

// Build radix themes
for (const name in radixThemes) {
  themeList.push(RADIX + name);
  Bun.write(RADIX_DIST + name + '.css', buildTheme(Object.values(radixThemes[name as keyof typeof radixThemes])));
}

export default router()
  // Serve static
  .get('/**', (params) => Bun.file(DIST + params[0]));
