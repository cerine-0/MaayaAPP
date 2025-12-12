import HomeScreen from '@/screens/HomeScreen';
import NextScreen from '@/screens/NextScreen';

import React, { useState } from 'react';
import { View } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const goToHome = () => setCurrentScreen('home');
  const goToNext = () => setCurrentScreen('next');
  const goToSignIn = () => setCurrentScreen('signin');
  const goToSignUp = () => setCurrentScreen('signup');
  const goToProfile = () => setCurrentScreen('profileSetup1');
  const goToAgenda = () => setCurrentScreen('agenda');

  

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'home' && <HomeScreen onNext={goToNext} />}
      {currentScreen === 'next' && <NextScreen goToSignIn={goToAgenda}  />}
    </View>
  );
}
