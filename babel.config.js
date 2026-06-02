module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // babel-preset-expo automatically applies react-native-worklets/plugin
    // (Reanimated 4) when react-native-worklets is installed. Do NOT add
    // react-native-reanimated/plugin manually — it causes double-compilation.
  };
};
