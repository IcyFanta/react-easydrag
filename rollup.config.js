import babel from 'rollup-plugin-babel'

export default {
  // 入口文件
  input: './src/index.jsx',
  // 编译后输出文件
  output: {
    file: './lib/index.js',
    format: 'cjs',
  },
  plugins: [babel()],
  external: ['react'],
}