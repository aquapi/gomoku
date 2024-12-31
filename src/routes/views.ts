import { router } from '@mapl/app';

const views = router();

for await (const path of new Bun.Glob('**/*.html').scan('./views'))
  views.build(
    // Build the correct paths
    path.endsWith('index.html')
      ? '/' + path.substring(0, path.length - 10)
      : '/' + path.substring(0, path.lastIndexOf('.') >>> 0),

    // Send the file
    () => Bun.file('./views/' + path)
  );

export default views;
