import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export const SignInScreen = ({ onSignIn, goToSignUp, goToProfile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert(
          'Succès',
          'Connexion réussie!',
          [{ 
            text: 'OK', 
            onPress: () => {
              if (goToProfile) {
                goToProfile();
              } else if (onSignIn) {
                onSignIn();
              }
            }
          }]
        );
      }

    } catch (err) {
      setLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue');
      console.error('SignIn error:', err);
    }
  };

  const handleSignUp = () => {
    if (goToSignUp) {
      goToSignUp();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/Rectangle.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWithIcon}>
            <Feather name="mail" size={20} color="#7a9b9e" style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="votre.email@exemple.com"
              placeholderTextColor="#7a9b9e"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputWithIcon}>
            <Feather name="lock" size={20} color="#7a9b9e" style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#7a9b9e"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather 
                name={showPassword ? "eye" : "eye-off"} 
                size={20} 
                color="#7a9b9e" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Connexion'}
          </Text>
          <Feather name="arrow-right" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Vous n'avez pas de compte?{' '}
          <Text style={styles.link} onPress={handleSignUp}>
            S'inscrire
          </Text>
        </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Mot de passe oublié</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF6EA',
  },
  card: {
    width: '90%',
    backgroundColor: '#FAF6EA',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1F2937',
    fontWeight: '500',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3E6DC',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#F37C62',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D3E6DC',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#14B8A6',
  },
  link: {
    color: '#1F2937',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerLink: {
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});