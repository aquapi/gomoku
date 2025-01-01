const vars = [
  'app-bg',
  'subtle-bg',

  'ui-bg',
  'hovered-ui-bg',
  'active-ui-bg',

  'subtle-sep',
  'ui-sep',
  'hovered-ui-sep',

  'solid-bg',
  'hovered-solid-bg',

  'txt-low',
  'txt-high'
]

export default (colors: string[]) => `:root {\n${colors.map((color, idx) => `  --theme-${vars[idx]}: ${color}`).join(';\n')}\n}`
