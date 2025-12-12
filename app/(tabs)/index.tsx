import React, { useState } from 'react';
import { View } from 'react-native';

import GettingStarted from '@/screens/GettingStarted'; // <-- IMPORT IT
import SplashScreen from '@/screens/SplashScreen';
import SplashScreen2 from '@/screens/SplashScreen2';
import SplashScreen3 from '@/screens/SplashScreen3';
import SplashScreen4 from '@/screens/SplashScreen4';
import SplashScreen5 from '@/screens/SplashScreen5';

export default function App() {
  const [current, setCurrent] = useState('SplashScreen');

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
          onContinue={() => setCurrent('gettingstarted')}   // FIXED
        />
      )}
      
        {current === 'gettingstarted' && (
          <GettingStarted onContinue={() => setCurrent('HomeScreen')} />
        )}



    </View>
  );
}
