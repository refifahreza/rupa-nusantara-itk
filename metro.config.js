const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Enable CSS support
config.resolver.sourceExts.push('css');

// 2. Use the correct transformer for CSS
config.transformer.babelTransformerPath = require.resolve('react-native-css-transformer');

module.exports = config; 