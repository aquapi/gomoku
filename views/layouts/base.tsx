export default (props: {
  title: string;
  description: string;
  styleHref: string;

  children: any;
}) => (
  <html lang="en">
    <head>
      <title>{props.title}</title>
      <meta charset="UTF-8" />
      <meta name="description" content={props.description} />
      <meta name="viewport" content="width=device-width" />

      <link rel="stylesheet" href="/styles/globals.css" />
      <script async type="module" src="/scripts/theme.js"></script>

      <link rel="stylesheet" href={props.styleHref} />
    </head>
    <body>
      <div id="app">{props.children}</div>
    </body>
  </html>
);
