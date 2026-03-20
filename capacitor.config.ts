import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mariodelcid.calmacalma',
  appName: 'Calma Calma',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0c0804',
      showSpinner: false,
    },
    StatusBar: {
      backgroundColor: '#0c0804',
      style: 'LIGHT',
    },
  },
};

export default config;
