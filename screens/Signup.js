import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export const SignUpScreen = ({ onSignUpComplete, goToSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    console.log('🔵 Bouton cliqué!');
    
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    console.log('📤 Début inscription...');

    try {
      // Créer le compte
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      console.log('📥 Réponse Supabase:', { data, error });

      if (error) {
        setLoading(false);
        console.error('❌ Erreur Supabase:', error);
        Alert.alert('Erreur', error.message);
        return;
      }

      if (!data.user) {
        setLoading(false);
        console.error('❌ Pas de user retourné');
        Alert.alert('Erreur', 'Échec de création du compte');
        return;
      }

      console.log('✅ Compte créé! User ID:', data.user.id);
      setLoading(false);

      // ✅ ALLER VERS PROFILE SETUP
      console.log('🚀 Redirection vers ProfileSetup...');
      
      if (onSignUpComplete) {
        onSignUpComplete({
          email: email,
          fullName: fullName,
          userId: data.user.id
        });
      } else {
        console.error('❌ onSignUpComplete est undefined!');
      }

    } catch (err) {
      setLoading(false);
      console.error('❌ Exception:', err);
      Alert.alert('Erreur', 'Une erreur est survenue: ' + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/Rectangle.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>

          <Text style={styles.title}>Inscription</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <View style={styles.inputWithIcon}>
              <Feather name="user" size={20} color="#7a9b9e" style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="Votre nom complet"
                placeholderTextColor="#7a9b9e"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

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
                placeholder="Au moins 6 caractères"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputWithIcon}>
              <Feather name="lock" size={20} color="#7a9b9e" style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor="#7a9b9e"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather 
                  name={showConfirmPassword ? "eye" : "eye-off"} 
                  size={20} 
                  color="#7a9b9e" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Chargement...' : "S'inscrire"}
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
            Vous avez déjà un compte?{' '}
            <Text style={styles.link} onPress={goToSignIn}>
              Se connecter
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF6EA',
    paddingVertical: 20,
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
});