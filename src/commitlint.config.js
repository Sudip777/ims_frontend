module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0, 'always'],
    'subject-case': [0, 'never'], // allow any case
    'subject-empty': [2, 'never'],
  },
};
