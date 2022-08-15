const serverlessComposeConfiguration = {
  services: {
    'authorization-service': {
      path: 'authorization-service',
    },
    'import-service': {
        path: 'import-service',
    },
    'products-service': {
        path: 'products-service',
    },
  },
};

module.exports = serverlessComposeConfiguration;
