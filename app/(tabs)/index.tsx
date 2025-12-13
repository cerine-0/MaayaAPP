


import React, { useState } from 'react';
import { View } from 'react-native';
import NextScreen from '@/screens/NextScreen';
import AgendaScreen from '@/screens/AgendaScreen'; // ADD THIS IMPORT
import GettingStarted from '@/screens/GettingStarted';
import HomeScreen from '@/screens/HomeScreen'; // ADD THIS IMPORT
import SplashScreen from '@/screens/SplashScreen';
import SplashScreen2 from '@/screens/SplashScreen2';
import SplashScreen3 from '@/screens/SplashScreen3';
import SplashScreen4 from '@/screens/SplashScreen4';
import SplashScreen5 from '@/screens/SplashScreen5';

// Your user ID from Supabase
const USER_ID = "17847301-5fdf-4499-8bdb-774a98c37ea0";

export default function App() {
  const [current, setCurrent] = useState('SplashScreen');
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);
  const goToHome = () => setCurrentScreen('home');
  const goToNext = () => setCurrentScreen('next');
  const goToSignIn = () => setCurrentScreen('signin');
  const goToSignUp = () => setCurrentScreen('signup');
  const goToProfile = () => setCurrentScreen('profileSetup1');
  const goToAgenda = () => setCurrentScreen('agenda');

  // Fonction pour revenir à HomeScreen et rafraîchir les données
  const returnToHome = () => {
    setHomeRefreshKey(prev => prev + 1); // Incrémenter pour forcer le refresh
    setCurrent('HomeScreen');
  };

  return (
    <View style={{ flex: 1 }}>
      
      {current === 'SplashScreen' && (
        <SplashScreen onContinue={() => setCurrent('SplashScreen2')} />
      )}

      {current === 'SplashScreen2' && (
        <SplashScreen2
          getstarted={() => setCurrent('gettingstarted')}
          onContinue={() => setCurrent('SplashScreen3')}
        />
      )}

      {current === 'SplashScreen3' && (
        <SplashScreen3
          getstarted={() => setCurrent('gettingstarted')}
          onBack={() => setCurrent('SplashScreen2')}
          onContinue={() => setCurrent('SplashScreen4')}
        />
      )}

      {current === 'SplashScreen4' && (
        <SplashScreen4
          onBack={() => setCurrent('SplashScreen3')}
          getstarted={() => setCurrent('gettingstarted')}
          onContinue={() => setCurrent('SplashScreen5')}
        />
      )}

      {current === 'SplashScreen5' && (
        <SplashScreen5
          onBack={() => setCurrent('SplashScreen4')}
          getstarted={() => setCurrent('gettingstarted')}
          onContinue={() => setCurrent('gettingstarted')}
        />
      )}
      
      {current === 'gettingstarted' && (
        <GettingStarted onContinue={() => setCurrent('HomeScreen')} />
      )}

      {/* ADD THIS BLOCK - This was missing! */}
      {current === 'HomeScreen' && (
        <HomeScreen 
          userId={USER_ID}
          onNavigateToAgenda={() => setCurrent('AgendaScreen')}
          onNavigateToEmergency={() => setCurrent('EmergencyCallScreen')} // Ajoutez cette ligne
          key={homeRefreshKey}
        />
      )}

      {/* ADD THIS BLOCK - For Agenda navigation */}
      {current === 'AgendaScreen' && (
        <AgendaScreen 
          userId={USER_ID}
        />
      )}

    </View>
  );
}
function setCurrentScreen(arg0: string) {
  throw new Error('Function not implemented.');
}

