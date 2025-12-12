import { Button, StyleSheet, Text, View } from 'react-native';

export default function NextScreen({ goToSignIn }) {
   // Add a check just in case
  const handlePress = () => {
    if (typeof goToSignIn === 'function') {
      goToSignIn();
    } else {
      console.warn('goToSignIn is not a function!');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Next Screen!</Text>
      <Button title="Go to Sign In" onPress={goToSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
