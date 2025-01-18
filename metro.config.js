// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for SQL files
config.resolver.sourceExts.push('sql'); 

// Apply Reanimated configuration first
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// Then apply NativeWind configuration
module.exports = withNativeWind(reanimatedConfig, { input: './global.css' });