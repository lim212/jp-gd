module.exports = {
  apps: [
    {
      name: 'jasapembayaran-new',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        NUXT_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        NITRO_PORT: 3000,
        NITRO_HOST: '0.0.0.0',
        PLATFORM: 'linux',
        SHARP_IGNORE_GLOBAL_LIBVIPS: '1'
      },
      
      // PM2 configuration optimized for Ubuntu VPS
      max_memory_restart: '2G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 3000,
      listen_timeout: 3000,
      
      // Working directory
      cwd: process.cwd(),
      interpreter: 'node',
      node_args: '--max-old-space-size=4096',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Advanced features
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.nuxt', '.output', '.git'],
      
      // Disable wait_ready to prevent EPIPE errors
      wait_ready: false,
      
      // Source map settings
      source_map_support: false,
      disable_source_map_support: true
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'your-git-repo-url',
      path: '/var/www/jasapembayaran',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build:ubuntu && pm2 reload ecosystem.ubuntu.config.js --env production',
      'pre-setup': ''
    }
  }
}
