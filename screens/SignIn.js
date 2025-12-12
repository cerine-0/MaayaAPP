import React, { useState } from 'react';


import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';



// Sign In Screen
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      // After successful sign in, go to profile setup
      if (goToProfile) {
        goToProfile();
      } else if (onSignIn) {
        onSignIn();
      }
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
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>👶</Text>
          </View>
        </View>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.inputField}
              placeholder="quincy232@tiko.col"
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
            <Text style={styles.inputIcon}>🔒</Text>
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
              <Text style={styles.eyeIconText}>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'Connexion →'}
          </Text>
        </TouchableOpacity>

        <View style={styles.googleButton}>
          <Text style={styles.googleIcon}>G</Text>
        </View>

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