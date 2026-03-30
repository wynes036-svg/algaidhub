module.exports = {
  apps: [
    {
      name: "algaidhub",
      script: "./server/index.js",
      cwd: __dirname,
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
