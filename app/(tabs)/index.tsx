import HomeScreen from '@/screens/HomeScreen';
import NextScreen from '@/screens/NextScreen';
import SplashScreen from '@/screens/SplashScreen';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const goToHome = () => setCurrentScreen('home');
  const goToNext = () => setCurrentScreen('next');

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'splash' && <SplashScreen onContinue={goToHome} />}
      {currentScreen === 'home' && <HomeScreen onNext={goToNext} />}
      {currentScreen === 'next' && <NextScreen />}
    </View>
  );
}
