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
  ],
  darkBlue: [
    "#1c2337", "#222a3e", "#26324f", "#28365d",
    "#2c3b67", "#2f4277", "#354c90", "#4361be",
    "#4f6ec8", "#5c7bcf", "#9ab4f6", "#e6eeff"
  ],
  forestGreen: [
    "#212618", "#272d1f", "#2f3623", "#343c26",
    "#394228", "#3f4b2a", "#49582e", "#5e7139",
    "#657f2e", "#718a3f", "#a9bf82", "#eaf1e0"
  ]
}
for (const name in defaultThemes) {
  themeList.push(name);
  Bun.write(DIST + name + '.css', buildTheme(defaultThemes[name as keyof typeof defaultThemes]));
}

// Build radix themes
for (const name in radixThemes) {
  if (name.endsWith('A')) continue;

  themeList.push(RADIX + name);
  Bun.write(RADIX_DIST + name + '.css', buildTheme(Object.values(radixThemes[name as keyof typeof radixThemes])));
}

export default router()
  // Serve static
  .get('/**', (params) => Bun.file(DIST + params[0]));
