const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
  DEPLOY_PATH,
} = process.env;

const APP = 'mesto-backend';

module.exports = {
  apps: [
    {
      name: APP,
      cwd: '.',
      script: '/home/khokhlov/.nvm/versions/node/v22.18.0/bin/node',
      args: 'dist/app.js',
      env: { NODE_ENV: 'production' },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      out_file: '/home/khokhlov/.pm2/logs/mesto-backend-out.log',
      error_file: '/home/khokhlov/.pm2/logs/mesto-backend-error.log',
      merge_logs: true,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: [DEPLOY_HOST],
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,

      'pre-deploy': [
        `mkdir -p ${DEPLOY_PATH}/shared`,
      ].join(' && '),

      'pre-deploy-local': `scp ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,

      'post-deploy': [
        'export PATH=$PATH:/home/khokhlov/.nvm/versions/node/v22.18.0/bin',
        'cd backend',
        'npm ci',
        'npm run build',
        'ln -sf ../../shared/.env ./.env',
        'pm2 delete mesto-backend || true',
        'pm2 start /home/khokhlov/.nvm/versions/node/v22.18.0/bin/node --name mesto-backend -- dist/app.js',
        'pm2 save',
      ].join(' && '),
    },
  },
};
