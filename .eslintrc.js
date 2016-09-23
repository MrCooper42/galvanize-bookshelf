module.exports = {
  extends: ['ryansobol/es6', 'ryansobol/mocha', 'ryansobol/node'],
  'rules': {
    'camelcase': 'off',
    'max-len': 'off',
    'sort-keys': 'off',
    'no-multiple-empty-lines': 'off',
    'new-cap': 'off',
    'next-line': 'off',
    'max-statements': 'off',
    'indent': 'off',
  },
  "ecmaFeatures": {
    "blockBindings": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
};
