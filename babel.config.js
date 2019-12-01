const presets = [
  ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }],
  '@babel/preset-react'
];

const plugins = [
  'styled-jsx/babel'
];

module.exports = { presets, plugins };
