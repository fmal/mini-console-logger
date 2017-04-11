import fs from 'fs';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const babelRc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
const prod = process.env.PRODUCTION;
const mode = prod ? 'production' : 'development';

console.log(`Creating ${mode} bundle...`);

const targets = prod
  ? [{ dest: 'dist/mini-console-logger.umd.min.js', format: 'umd' }]
  : [
      { dest: 'dist/mini-console-logger.umd.js', format: 'umd' },
      { dest: 'dist/mini-console-logger.es.js', format: 'es' },
      { dest: 'dist/mini-console-logger.cjs.js', format: 'cjs' }
    ];

export default {
  entry: 'src/index.js',
  targets,
  moduleName: 'miniConsoleLogger',
  exports: 'named',
  plugins: [
    nodeResolve(),
    commonjs({ include: 'node_modules/**' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        prod ? 'production' : 'development'
      )
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        [
          'es2015',
          {
            loose: true,
            modules: false
          }
        ]
      ].concat(babelRc.presets.slice(1)),
      plugins: babelRc.plugins
    }),
    prod ? uglify({ compress: { warnings: false } }) : null
  ].filter(Boolean)
};
