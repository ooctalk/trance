// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// 添加 sql 文件扩展名支持
config.resolver.sourceExts.push('sql');

// 通过 NativeWind 包装配置（传入全局样式文件）
const configWithNativeWind = withNativeWind(config, { input: './global.css' });

// 通过 Reanimated 包装配置
module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind);
