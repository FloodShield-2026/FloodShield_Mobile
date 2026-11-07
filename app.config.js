const { execSync } = require('child_process');

function gitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'local-dev';
  }
}

module.exports = {
  expo: {
    name: 'FloodShield',
    slug: 'floodshield-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/brand/logo.png',
    scheme: 'floodshield',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/brand/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#0A1628',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'br.fiap.floodshield',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/brand/logo.png',
        backgroundColor: '#0A1628',
      },
      package: 'br.fiap.floodshield',
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/brand/logo.png',
      bundler: 'metro',
    },
    plugins: ['expo-router', 'expo-secure-store'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        root: 'src/app',
      },
      gitCommit: gitCommit(),
    },
  },
};
