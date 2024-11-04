module.exports = api => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@react-native-voice/voice': '@react-native-voice/voice',
            '@assets': './assets'
          }
        }
      ]
    ]
  };
};
