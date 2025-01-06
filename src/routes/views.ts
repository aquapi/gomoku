import { router } from '@mapl/app';
import { resolve } from 'path/posix';

const PAGES_DIR = './views/pages/', DIST_DIR = './views/dist/';

const views = router();

for (const path of new Bun.Glob('**/*.tsx').scanSync(PAGES_DIR)) {
  const pathName = path.substring(0, path.lastIndexOf('.') >>> 0);
  const outPath = DIST_DIR + pathName + '.html';

  // Call the page builder
  Bun.write(outPath, (await import(resolve(PAGES_DIR + path))).default());

  views.build(
    // Build the correct paths
    '/' + (pathName.endsWith('index')
      ? pathName.substring(0, path.length - 5)
      : pathName
    ),
    // Send the file
    () => Bun.file(outPath)
  );
}

export default views;
