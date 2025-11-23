module.exports = {
  apps: [{
    name: 'jasapembayaran-new',
    script: 'node',
    args: '.output/server/index.mjs',
    cwd: '/home/nuxt/jasapembayaran-new',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '127.0.0.1',
      NITRO_PRESET: 'node-server'
    },
    // Log configuration dengan batasan ketat untuk mencegah log penuh
    error_file: '/home/nuxt/.pm2/logs/jasapembayaran-new-error.log',
    out_file: '/home/nuxt/.pm2/logs/jasapembayaran-new-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Log rotation - BATASI KETAT untuk mencegah disk penuh
    max_size: '5M',        // Max 5MB per file (lebih kecil dari sebelumnya)
    retain: 3,            // Keep hanya 3 file terakhir (total max ~15MB)
    compress: true,        // Compress old logs untuk hemat space
    // Disable excessive logging
    disable_logs: false,
    
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    max_memory_restart: '1G'
  }]
}
