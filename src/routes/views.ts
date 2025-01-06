import { DIST as ROOT } from '@/config';
import { router } from '@mapl/app';
import { resolve, join } from 'path/posix';

const DIST = ROOT + 'pages/';
const PAGES = './views/pages/';

const views = router();

for (const path of new Bun.Glob('**/*.tsx').scanSync(PAGES)) {
  const pathName = path.substring(0, path.lastIndexOf('.') >>> 0);
  const outPath = DIST + pathName + '.html';

  // Call the page builder
  Bun.write(outPath, (await import(resolve(PAGES + path))).default());

  views.build(
    // Build the correct paths
    join('/', pathName.endsWith('index')
      ? pathName.substring(0, pathName.length - 5)
      : pathName
    ),
    // Send the file
    () => Bun.file(outPath)
  );
}

export default views;
console.log(views.routes)
