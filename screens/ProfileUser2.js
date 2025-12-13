import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../supabase';

export default function MedicalInformationScreen({ onBack }) {
  // const [weight, setWeight] = useState('');
  // const [height, setHeight] = useState('');
  // const [chronicDiseases, setChronicDiseases] = useState('');
  // const [allergies, setAllergies] = useState('');
  // const [otherDiseases, setOtherDiseases] = useState('');

 const [userData, setUserData] = useState({
  poids:'',
  taille:'',
  maladies_chroniques:'',
  allergies:'',
  autres_maladies:'',
});

  const USER_ID = '17847301-5fdf-4499-8bdb-774a98c37ea0';

   useEffect(() => {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('poids, taille, maladies_chroniques, allergies,autres_maladies')
          .eq('id', USER_ID)
          .single();
  
        if (error) {
          console.log('Erreur fetching user:', error);
        } else {
          setUserData(data);
        }
      };
      fetchUser();
    }, []);
     

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informations Medicales</Text>

  <TouchableOpacity style={styles.notificationButton}>
        <View style={styles.notificationIcon}>
          <Image
            source={require('../assets/Notif.png')}
            style={{ width: 28, height: 28 }} 
            resizeMode="contain"
          />
          <View style={styles.notificationDot} />
        </View>
      </TouchableOpacity>
        
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Le Poids</Text>
        <TextInput
          style={styles.input}
          value={userData.poids}
          // placeholder="••••••••••••••••"
          // secureTextEntry={false}
          // placeholderTextColor="#A0B5B3"
        />

        <Text style={styles.label}>La Taille</Text>
        <TextInput
          style={styles.input}
          value={userData.taille}
          // placeholder="••••••••••••••••"
          // placeholderTextColor="#A0B5B3"
        />

        <Text style={styles.label}>Maladies Chroniques</Text>
        <TextInput
          style={styles.input}
          value={userData.maladies_chroniques}
          // placeholder="••••••••••••••••"
          // placeholderTextColor="#A0B5B3"
        />

        <Text style={styles.label}>Allergies</Text>
        <TextInput
          style={styles.input}
          value={userData.allergies}
          // placeholder="••••••••••••••••"
          // placeholderTextColor="#A0B5B3"
        />

        <Text style={styles.label}>Autres Maladies</Text>
        <TextInput
          style={styles.input}
          value={userData.autres_maladies}
          // placeholder="••••••••••••••••"
          // placeholderTextColor="#A0B5B3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#E87E6B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E87E6B',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    position: 'relative',
  },
  bellIcon: {
    fontSize: 24,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E87E6B',
  },
  formSection: {
    paddingHorizontal: 30,
    marginTop: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#D4E8E5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
});