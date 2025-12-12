import { StyleSheet, Text, View } from 'react-native';

export default function NextScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Next Screen!</Text>
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
