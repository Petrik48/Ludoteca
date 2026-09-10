/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2, // level: 0=off, 1=warning, 2=error
      'always',
      ['api', 'ui', 'deps', 'repo', 'release'],
    ],
  },
};
