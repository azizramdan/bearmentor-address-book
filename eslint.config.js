const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  rules: {
    'curly': ['error', 'all'],
    'no-alert': ['off'],
    'style/brace-style': ['error', '1tbs'],
  },
  formatters: {
    html: true,
    css: true,
  },
  ignores: [
    'assets/style.css',
  ],
})
