module.exports = {
  api: {
    API: ['api',{
      type: 'category',
      label: 'Authentication',
      items: ['api/auth','api/auth/basic','api/auth/oauth2','api/auth/scopes']
    },'api/graphql','api/sif']
  },
  dp: {
    "Data Platform": ['data-platform']
  },
  lti: {
    "Learning Tools Interoperability": ['lti','lti/launch','lti/troubleshooting']
  }
};
