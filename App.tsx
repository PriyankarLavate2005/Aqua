import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';

type ScreenState = 'splash' | 'language' | 'login' | 'register' | 'home';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [userData, setUserData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleSplashFinish = () => {
    setCurrentScreen('language');
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (data: any) => {
    setUserData(data);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'language':
        return <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />;
      case 'login':
        return (
          <LoginScreen
            language={selectedLanguage}
            onRegisterPress={() => setCurrentScreen('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            language={selectedLanguage}
            onLoginPress={() => setCurrentScreen('login')}
          />
        );
      case 'home':
        return (
          <HomeScreen
            user={userData}
            language={selectedLanguage}
            onLogout={handleLogout}
          />
        );
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}

export default App;
