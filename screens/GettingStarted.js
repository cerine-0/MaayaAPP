import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function GettingStarted({ onContinue }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Rectangle.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}> Get Started </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF2DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#F48B7C',
    paddingHorizontal: 44,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 50, 
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
