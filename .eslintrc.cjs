module.exports = {
  extends: ['airbnb-typescript/base', 'prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['src/proto', 'docs/', 'dist/', 'examples'],
  rules: {
    'import/export': 'off',
    'max-classes-per-file': 'off',
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-restricted-syntax': ['error', 'WithStatement', "BinaryExpression[operator='in']"],
  },
};
