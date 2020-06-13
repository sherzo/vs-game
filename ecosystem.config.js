module.exports = {
  apps : [{
    name: 'leameen',
    script: 'index.js',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 6000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 6001
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
