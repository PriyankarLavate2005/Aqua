import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

type ScreenState = 'splash' | 'language' | 'login' | 'register' | 'home' | 'forgotPassword' | 'otp';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [userData, setUserData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userDataString = await AsyncStorage.getItem('userData');

        if (userToken && userDataString) {
          setUserData(JSON.parse(userDataString));
          setCurrentScreen('home');
        }
      } catch (e) {
        console.error('Failed to load user data');
      }
    };

    if (currentScreen === 'splash') {
      // Allow splash to show for a bit or check immediately? 
      // We can let SplashScreen call onFinish, then check.
      // Or check here. For now, let's keep the Splash flow, but maybe shortcut if logged in.
      // Actually, checkLoginStatus should probably run on mount.
      checkLoginStatus();
    }
  }, []);

  const handleSplashFinish = () => {
    // If we're already redirected to home, don't go to language.
    // We can rely on state currentScreen.
    if (currentScreen === 'splash') {
      setCurrentScreen('language');
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setCurrentScreen('login');
  };

  const handleLoginSuccess = async (data: any) => {
    try {
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      setUserData(data);
      setCurrentScreen('home');
    } catch (e) {
      console.error('Failed to save user data');
      setUserData(data);
      setCurrentScreen('home');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      console.error('Failed to remove user data');
    }
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
            onForgotPasswordPress={() => setCurrentScreen('forgotPassword')}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordScreen
            language={selectedLanguage}
            onBackToLogin={() => setCurrentScreen('login')}
            onOTPSent={(email) => {
              setResetEmail(email);
              setCurrentScreen('otp');
            }}
          />
        );
      case 'otp':
        return (
          <OTPVerificationScreen
            email={resetEmail}
            language={selectedLanguage}
            onVerifySuccess={handleLoginSuccess}
            onResendOTP={() => {
              // Optionally trigger resend logic here
              Alert.alert('Resend', 'OTP resent to your email');
            }}
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
