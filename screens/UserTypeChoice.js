import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export const UserTypeChoice = ({ onSelectUser, onSelectProvider }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/Rectangle.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Choisissez votre profil</Text>

      {/* Choice Cards */}
      <View style={styles.cardsContainer}>
        {/* User Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={onSelectUser}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Feather name="user" size={48} color="#F37C62" />
          </View>
          <Text style={styles.cardTitle}>Utilisateur</Text>
          <Text style={styles.cardDescription}>
            Je suis une personne âgée qui a besoin d'aide
          </Text>
          <View style={styles.arrowContainer}>
            <Feather name="arrow-right" size={24} color="#F37C62" />
          </View>
        </TouchableOpacity>

        {/* Provider Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={onSelectProvider}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Feather name="heart" size={48} color="#10B981" />
          </View>
          <Text style={styles.cardTitle}>Bénévole</Text>
          <Text style={styles.cardDescription}>
            Je veux aider les personnes âgées
          </Text>
          <View style={styles.arrowContainer}>
            <Feather name="arrow-right" size={24} color="#10B981" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Ensemble pour une meilleure vie
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EA',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7a9b9e',
    textAlign: 'center',
    marginBottom: 48,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FAF6EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7a9b9e',
    textAlign: 'center',
    lineHeight: 20,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  footer: {
    fontSize: 14,
    color: '#7a9b9e',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});