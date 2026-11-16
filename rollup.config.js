//import banner from 'rollup-plugin-banner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import postcssPresetMantine from 'postcss-preset-mantine';
import path from 'path';
import { fileURLToPath } from 'node:url';

const moduleNameSplit = path.dirname(fileURLToPath(import.meta.url)).split('/');
const moduleName = moduleNameSplit[moduleNameSplit.length - 1];
console.log('ModuleName', moduleName);
export default [
  {
    input: './src/index.ts',
    plugins: [
      typescript(),
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.MODULE_NAME': moduleName,
        'process.env.ACCESS_CODE': JSON.stringify(
          process.env.ACCESS_CODE || '',
        ),
        preventAssignment: true,
      }),
      postcss({
        // 1. CHANGE THIS: Turn off automatic ambiguous modules
        autoModules: false,

        // 2. ADD THIS: Explicitly scope ONLY your dedicated *.module.css files
        modules: {
          globalModulePaths: [/node_modules/], // Do NOT scope any npm dependencies
          generateScopedName: `${moduleName}__[local]___[hash:base64:5]`,
        },
        inject: false,
        extract: `${moduleName}.css`,
        extensions: ['.css'],
        // 3. Process with Mantine's required PostCSS features
        plugins: [postcssPresetMantine()],
        // Tells the plugin to handle standard .css files normally, and auto-scope .module.css
        autoModules: true,
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react'],
        extensions: ['.js', '.jsx'],
      }),
      commonjs(),
    ],
    output: {
      file: `./dist/${moduleName}.js`,
      format: 'iife',
    },
  },
];
