const typescript = require('rollup-plugin-typescript2')

const format = process.env.BUILD_FORMAT;

const fileName = ((format) => {
  switch (format) {
    case 'cjs':
      return 'index.common.js';
    case 'umd':
      return 'index.umd.js';
    case 'esm':
      return 'index.esm.js';
  }
})(format);

/**
 * @type {import('rollup').RollupOptions}
*/
module.exports = {
  input: './src/index.ts',
  output: {
    name: `bundle.${format}.js`,
    file: `dist/${fileName}`,
    format,
  },

  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
  ],
};