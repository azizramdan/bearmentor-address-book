const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  formatters: {
    html: true,
    css: true,
  },
  ignores: [
    'assets/style.css',
  ],
})
