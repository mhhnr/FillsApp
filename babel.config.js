/**
 * Babel Configuration File
 * 
 * This configuration file is used to set up Babel for the project.
 * Babel is a JavaScript compiler that allows you to use the latest 
 * JavaScript features and transforms them into a version that is 
 * compatible with older environments.
 * 
 * The configuration includes:
 * - Caching for performance optimization
 * - Presets for transforming React Native code
 * - Plugins for additional functionality, such as module resolution
 * 
 * Dependencies:
 * - babel-preset-expo: A preset that includes the necessary Babel 
 *   configurations for Expo projects.
 * - react-native-reanimated/plugin: A plugin for enabling the 
 *   Reanimated library's features.
 * - module-resolver: A plugin that allows for custom module 
 *   resolution paths, making imports cleaner and more manageable.
 */

module.exports = api => {
  // Enable caching for improved performance
  api.cache(true);

  // Return the Babel configuration object
  return {
    // Presets to use for transforming the code
    presets: ['babel-preset-expo'],
    
    // Plugins to enhance Babel's functionality
    plugins: [
      // Plugin for React Native Reanimated
      'react-native-reanimated/plugin',
      
      // Module resolver plugin for custom path aliases
      [
        'module-resolver',
        {
          // Define aliases for module paths
          alias: {
            // Alias for the react-native-voice library
            '@react-native-voice/voice': '@react-native-voice/voice',
            // Alias for the assets directory
            '@assets': './assets'
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.tsx',
            '.ts'
          ]
        }
      ]
    ]
  };
};
