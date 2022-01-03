import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: [
    // cjs
    {
      format: 'cjs',
      file: 'lib/guid-core-vue.cjs.js',
    },
    // esm
    {
      format: 'es',
      file: 'lib/guid-core-vue.esm.js',
    },
  ],
  plugins: [typescript()],
};
