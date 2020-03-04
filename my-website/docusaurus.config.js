module.exports = {
  title: 'Alak Atom',
  tagline: 'базовая частица реактивного приложения',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: '/favicon.ico',
  organizationName: 'gleba/alak', // Usually your GitHub org/user name.
  projectName: 'alak', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Atom',
      logo: {
        alt: 'Alak Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/start', label: 'Docs', position: 'left' },
        { to: 'docs/api/facade', label: 'API', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
  scripts: [
    //"/alak.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/mode/javascript/javascript.min.js",
    "https://unpkg.com/jshint@2.9.6/dist/jshint.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/addon/lint/lint.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/addon/lint/javascript-lint.min.js",

  ],
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
