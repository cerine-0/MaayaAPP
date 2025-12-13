import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

// ✅ AJOUT: signupData dans les props
export const ProfileSetup = ({ onComplete, onBack, signupData }) => {
  // Page 1 fields - Pré-remplir avec les données de signup
  const [fullName, setFullName] = useState(signupData?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');

  // Page 2 fields
  const [conditions, setConditions] = useState('');
  const [raisons, setRaisons] = useState('');
  const [responsable, setResponsable] = useState('');
  const [telephoneResponsable, setTelephoneResponsable] = useState('');
  const [genre, setGenre] = useState('');

  // Page 3 fields
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [maladies, setMaladies] = useState('');
  const [allergies, setAllergies] = useState('');

  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    // Validate required fields
    if (!fullName || !phoneNumber || !age) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom, téléphone et âge');
      return;
    }

    if (!poids || !taille) {
      Alert.alert('Erreur', 'Veuillez remplir le poids et la taille');
      return;
    }

    setLoading(true);

    try {
      // Collect all data
      const profileData = {
        fullName,
        phoneNumber,
        age,
        address,
        dateNaissance,
        conditions,
        raisons,
        responsable,
        telephoneResponsable,
        genre,
        poids,
        taille,
        maladies,
        allergies,
        email: signupData?.email,
      };

      // Save to database using Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: signupData?.userId,
          nom_prenom: fullName,
          numero_telephone: phoneNumber,
          date_naissance: dateNaissance || null,
          age: age,
          email: signupData?.email,
          poids: poids,
          taille: taille,
          maladies_chroniques: maladies || null,
          allergies: allergies || null,
          autres_maladies: conditions || null,
        }])
        .select();

      setLoading(false);

      if (error) {
        Alert.alert('Erreur', 'Impossible de sauvegarder le profil: ' + error.message);
        console.error('Profile creation error:', error);
        return;
      }

      Alert.alert(
        'Succès',
        'Profil créé avec succès!',
        [{ 
          text: 'OK', 
          onPress: () => onComplete(profileData) 
        }]
      );

    } catch (err) {
      setLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue');
      console.error('Profile error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Setup</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={60} color="#7a9b9e" />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Feather name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SECTION 1: Informations de base */}
        <Text style={styles.sectionTitle}>Informations personnelles</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom et Prénom</Text>
          <View style={styles.inputWithIcon}>
            <Feather name="user" size={20} color="#7a9b9e" style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Quincy Williams"
              placeholderTextColor="#7a9b9e"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numero de telephone</Text>
          <View style={styles.inputWithIcon}>
            <Feather name="phone" size={20} color="#7a9b9e" style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="+213 XXX XXX XXX"
              placeholderTextColor="#7a9b9e"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de naissance</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="JJ/MM/AAAA"
            placeholderTextColor="#7a9b9e"
            value={dateNaissance}
            onChangeText={setDateNaissance}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez votre âge"
            placeholderTextColor="#7a9b9e"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez votre adresse"
            placeholderTextColor="#7a9b9e"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* SECTION 2: Informations médicales et légales */}
        <Text style={styles.sectionTitle}>Informations médicales</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Conditions</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez vos conditions"
            placeholderTextColor="#7a9b9e"
            value={conditions}
            onChangeText={setConditions}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Raisons</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez vos raisons"
            placeholderTextColor="#7a9b9e"
            value={raisons}
            onChangeText={setRaisons}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Responsable Legal</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Nom du responsable"
            placeholderTextColor="#7a9b9e"
            value={responsable}
            onChangeText={setResponsable}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Son numero de telephone</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Numero de telephone"
            placeholderTextColor="#7a9b9e"
            value={telephoneResponsable}
            onChangeText={setTelephoneResponsable}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Genre</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Votre genre"
            placeholderTextColor="#7a9b9e"
            value={genre}
            onChangeText={setGenre}
          />
        </View>

        {/* SECTION 3: Données physiques et santé */}
        <Text style={styles.sectionTitle}>Données physiques</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Poids (kg)</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez votre poids"
            placeholderTextColor="#7a9b9e"
            value={poids}
            onChangeText={setPoids}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Taille (cm)</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez votre taille"
            placeholderTextColor="#7a9b9e"
            value={taille}
            onChangeText={setTaille}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maladies croniques</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez vos maladies chroniques"
            placeholderTextColor="#7a9b9e"
            value={maladies}
            onChangeText={setMaladies}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={styles.inputFieldSimple}
            placeholder="Entrez vos allergies"
            placeholderTextColor="#7a9b9e"
            value={allergies}
            onChangeText={setAllergies}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Enregistrement...' : "S'inscrire"}
          </Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EA',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D3E6DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D3E6DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
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
  inputFieldSimple: {
    backgroundColor: '#D3E6DC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#F37C62',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});