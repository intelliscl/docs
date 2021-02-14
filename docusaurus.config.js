module.exports = {
  title: 'Intellischool Docs',
  tagline: 'Explore our guides and examples to integrate with Intellischool products.',
  url: 'https://docs.intellischool.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'intelliscl', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  themeConfig: {
    navbar: {
      //title: 'My Site',
      logo: {
        alt: 'Intellischool Docs',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg'
      },
      items: [
        {
          to: 'read/api',
          activeBasePath: 'read/api',
          label: 'API',
          position: 'left',
        },
        {
          to: 'read/data-platform',
          activeBasePath: 'read/data-platform',
          label: 'Data Platform',
          position: 'left',
        },
        {
          to: 'read/lti',
          activeBasePath: 'read/lti',
          label: 'LTI',
          position: 'left',
        },
        {
          href: 'https://intellischool.co',
          label: 'Home',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'API',
              to: 'read/api',
            },
            {
              label: 'Data Platform',
              to: 'read/data-platform',
            },
            {
              label: 'LTI',
              to: 'read/lti'
            }
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'About',
              href: 'https://intellischool.co/about',
            },
            {
              label: 'Blog',
              href: 'https://medium.com/intellischool'
            },
            {
              label: 'Contact',
              href: 'https://intellischool.co/contact',
            }
          ],
        },
        {
          title: 'Products',
          items: [
            {
              label: 'Albitros',
              href: 'https://albitros.com'
            },
            {
              label: 'Dextyr',
              href: 'https://dextyr.com',
            },
            {
              label: 'Intellischool Data Platform',
              href: 'https://intellischool.co/data-platform',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Intellischool Holdings Pty Ltd. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          path: 'docs',
          routeBasePath: 'read',
          editUrl:
            'https://github.com/intelliscl/docs/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
