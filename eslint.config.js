import google from 'eslint-config-google';
import prettier from 'eslint-config-prettier';

export default {
  plugins: {google, prettier},
  languageOptions: {
    globals: {
      process: 'readonly',
      console: 'readonly',
      __dirname: 'readonly',
    },
  },
  rules: {
    'linebreak-style': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'no-undef': 'error',
    'no-unused-vars': ['error', {vars: 'all', args: 'after-used'}],
    'guard-for-in': 'off',
  },
};
