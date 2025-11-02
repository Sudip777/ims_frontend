module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0, 'always'], // 0 = optional
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
  },
};
