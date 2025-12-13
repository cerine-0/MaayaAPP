import GettingStarted from '@/screens/GettingStarted';
import { ProfileSetup } from '@/screens/ProfileSetup';
import { ProviderHomeScreen } from '@/screens/ProviderHomeScreen';
import { SignInScreen } from '@/screens/SignIn';
import { SignUpScreen } from '@/screens/Signup';
import { UserTypeChoice } from '@/screens/UserTypeChoice';
import React, { useState } from 'react';
import { View } from 'react-native';
import { supabase } from '@/lib/supabase';

import ChatScreen from '@/screens/ChatScreen';
import ContactChatScreen from '@/screens/Chatbycontact';
import ProfileUser1 from '@/screens/ProfileUser1';
import ProfileUser2 from '@/screens/ProfileUser2';
import SplashScreen from '@/screens/SplashScreen';
import SplashScreen2 from '@/screens/SplashScreen2';
import SplashScreen3 from '@/screens/SplashScreen3';
import SplashScreen4 from '@/screens/SplashScreen4';
import SplashScreen5 from '@/screens/SplashScreen5';

export default function App() {
  const [current, setCurrent] = useState('UserTypeChoice'); // START WITH CHOICE PAGE
  const [authenticated, setAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [signupData, setSignupData] = useState<Record<string, any> | null>(null);
  const [selectedContact, setSelectedContact] = useState(null);

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
      {/* USER TYPE CHOICE PAGE - FIRST SCREEN */}
      {current === 'UserTypeChoice' && (
        <UserTypeChoice
          onSelectUser={() => setCurrent('SignIn')} // Go to User SignIn
          onSelectProvider={() => setCurrent('ProviderHome')} // Go to Provider Home
        />
      )}

      {/* PROVIDER HOME SCREEN */}
      {current === 'ProviderHome' && (
        <ProviderHomeScreen
          providerData={{ fullName: 'Provider Name' }}
          onLogout={() => setCurrent('UserTypeChoice')}
        />
      )}

      {/* USER AUTHENTICATION FLOW */}
      {current === 'SignIn' && (
        <>
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
                  goToProfile={() => { }}
                />
              ) : (
                <SignUpScreen
                  onSignUpComplete={handleSignUpComplete}
                  goToSignIn={() => setShowSignUp(false)}
                />
              )}
            </>
          ) : null}
        </>
      )}

      {/* USER AUTHENTICATED SCREENS */}
      {authenticated && (
        <>
          {current === 'SplashScreen' && (
            <SplashScreen onContinue={() => setCurrent('SplashScreen2')} />
          )}
          {current === 'SplashScreen2' && (
            <SplashScreen2
              getstarted={() => setCurrent('GettingStarted')}
              onContinue={() => setCurrent('SplashScreen3')}
            />
          )}
          {current === 'SplashScreen3' && (
            <SplashScreen3
              getstarted={() => setCurrent('GettingStarted')}
              onBack={() => setCurrent('SplashScreen2')}
              onContinue={() => setCurrent('SplashScreen4')}
            />
          )}
          {current === 'SplashScreen4' && (
            <SplashScreen4
              onBack={() => setCurrent('SplashScreen3')}
              getstarted={() => setCurrent('GettingStarted')}
              onContinue={() => setCurrent('SplashScreen5')}
            />
          )}
          {current === 'SplashScreen5' && (
            <SplashScreen5
              onBack={() => setCurrent('SplashScreen4')}
              getstarted={() => setCurrent('GettingStarted')}
              onContinue={() => setCurrent('GettingStarted')}
            />
          )}
        </>
      )}

      {current === 'GettingStarted' && (
        <GettingStarted onContinue={() => setCurrent('SignIn')} />
      )}

      {current === 'ProfileUser1' && (
        <ProfileUser1 onMedicalInfo={() => setCurrent('ProfileUser2')} />
      )}

      {current === 'ProfileUser2' && (
        <ProfileUser2 onBack={() => setCurrent('ProfileUser1')} />
      )}

      {current === 'ChatScreen' && (
        <ChatScreen
          onOpenChat={(contact: React.SetStateAction<null>) => {
            setSelectedContact(contact);
            setCurrent('ContactChatScreen');
          }}
        />
      )}

      {current === 'ContactChatScreen' && selectedContact && (
        <ContactChatScreen
          contact={selectedContact}
          onBack={() => setCurrent('ChatScreen')}
        />
      )}
    </View>
  );
}