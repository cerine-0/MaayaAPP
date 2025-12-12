import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen({ onContinue }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue(); // automatically go to next screen
    }, 3000); // 3000 ms = 3 seconds

    return () => clearTimeout(timer); // cleanup if component unmounts early
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Rectangle.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.appName}>M3AYA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE8C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E87E6B',
    letterSpacing: 4,
    // fontFamily: 'ABillionDreams',
  },
});