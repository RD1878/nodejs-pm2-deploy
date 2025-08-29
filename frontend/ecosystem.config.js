const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
  DEPLOY_PATH,
} = process.env;

module.exports = {
  apps: [],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: [DEPLOY_HOST],
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,

      'post-deploy': [
        'export PATH=$PATH:/home/khokhlov/.nvm/versions/node/v22.18.0/bin',
        'export NODE_OPTIONS=--openssl-legacy-provider',
        'cd frontend',
        'npm install',
        'node ./node_modules/react-scripts/bin/react-scripts.js build'
      ].join(' && '),
    },
  },
};
