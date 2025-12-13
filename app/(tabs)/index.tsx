import React, { useState } from 'react';
import { View } from 'react-native';

import ChatScreen from '@/screens/ChatScreen';
import Chatbycontact from '@/screens/Chatbycontact';
import GettingStarted from '@/screens/GettingStarted';
import ProfileUser1 from '@/screens/ProfileUser1';
import ProfileUser2 from '@/screens/ProfileUser2';
import SplashScreen from '@/screens/SplashScreen';
import SplashScreen2 from '@/screens/SplashScreen2';
import SplashScreen3 from '@/screens/SplashScreen3';
import SplashScreen4 from '@/screens/SplashScreen4';
import SplashScreen5 from '@/screens/SplashScreen5';

export default function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  //const [current, setCurrent] = useState('SplashScreen');
  const [current, setCurrent] = useState('ChatScreen');

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
        <GettingStarted onContinue={() => setCurrent('ProfileUser1')} />
      )}


          {current === 'ProfileUser1' && (
        <ProfileUser1 
          onMedicalInfo={() => setCurrent('ProfileUser2')} 
        />
      )}

      {current === 'ProfileUser2' && (
        <ProfileUser2 
          onBack={() => setCurrent('ProfileUser1')} 
        />
      )}

     {current === 'ChatScreen' && (
  <ChatScreen 
    onOpenChat={(contact) => {
      setSelectedContact(contact); // store the selected contact
      setCurrent('Chatbycontact'); // go to the chat detail page
    }} 
  />
     )}

{current === 'Chatbycontact' && selectedContact && (
  <Chatbycontact
    contact={selectedContact} // pass the contact object
    onBack={() => setCurrent('ChatScreen')} // back button
  />
)}


    </View>
  );
}
