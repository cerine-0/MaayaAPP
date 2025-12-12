import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function SplashScreen({ onContinue }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onContinue}>
      <Image
        source={require('../assets/Rectangle.png')}
        style={styles.image}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
