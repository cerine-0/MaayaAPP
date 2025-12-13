import React, { useState } from 'react';
import { View } from 'react-native';
import GettingStarted from '@/screens/GettingStarted';
import { ProfileSetup } from '@/screens/ProfileSetup';
import { SignInScreen } from '@/screens/SignIn';
import { SignUpScreen } from '@/screens/Signup';
import SplashScreen from '@/screens/SplashScreen';
import SplashScreen2 from '@/screens/SplashScreen2';
import SplashScreen3 from '@/screens/SplashScreen3';
import SplashScreen4 from '@/screens/SplashScreen4';
import SplashScreen5 from '@/screens/SplashScreen5';

export default function App() {
  const [current, setCurrent] = useState('SignIn');
  const [authenticated, setAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [signupData, setSignupData] = useState<Record<string, any> | null>(null);

  const handleSignUpComplete = (data: Record<string, any>) => {
    console.log('SignUp Complete - Data:', data);
    setSignupData(data);
    setShowSignUp(false);
    setShowProfileSetup(true);
  };

  const handleProfileComplete = (profileData: Record<string, any>) => {
    console.log('Complete Profile Data:', profileData);
    setShowProfileSetup(false);
    setAuthenticated(true);
    setCurrent('SplashScreen');
  };

  return (
    <View style={{ flex: 1 }}>
      {showProfileSetup ? (
        <ProfileSetup
          onComplete={handleProfileComplete}
          onBack={() => {
            setShowProfileSetup(false);
            setShowSignUp(true);
          }}
          signupData={signupData}
        />
      ) : !authenticated ? (
        <>
          {!showSignUp ? (
            <SignInScreen
              onSignIn={() => {
                setAuthenticated(true);
                setCurrent('SplashScreen');
              }}
              goToSignUp={() => setShowSignUp(true)}
              goToProfile={() => {}}
            />
          ) : (
            <SignUpScreen
              onSignUpComplete={handleSignUpComplete}
              goToSignIn={() => setShowSignUp(false)}
            />
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </View>
  );
}