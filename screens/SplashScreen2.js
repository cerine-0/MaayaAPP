import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen2({ onContinue, getstarted }) {
  return (
    <View style={styles.container}>
      {/* Skip button */}
      {getstarted && (
        <TouchableOpacity style={styles.skipButton} onPress={getstarted}>
          <Text style={styles.skipText}>passer</Text>
        </TouchableOpacity>
      )}

      {/* Main content */}
      <View style={styles.content}>
        <Image
          source={require('../assets/wan.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.text}>
          Votre aide est toujours à portée{'\n'}de main, rapidement et{'\n'}facilement
        </Text>

       {/* Pagination dots */}
      <View style={styles.pagination}>
        <View style={[styles.dot, styles.dotActive]} />  
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
 </View>

      {/* Continue button */}
      {onContinue && (
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF2DE',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0C9BA',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#333',
  },
  button: {
    backgroundColor: '#F48B7C',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
