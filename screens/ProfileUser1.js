import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ onMedicalInfo }) {
  // const [name, setName] = useState('John Doe');
  // const [phone, setPhone] = useState('+123 567 89000');
  // const [email, setEmail] = useState('johndoe@example.com');
  // const [birthDate, setBirthDate] = useState('');

  const [userData, setUserData] = useState({
    nom_prenom: '',
    numero_telephone: '',
    email: '',
    date_naissance: '',
  });

  const USER_ID = '17847301-5fdf-4499-8bdb-774a98c37ea0';

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('nom_prenom, numero_telephone, email, date_naissance')
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>

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

      {/* Profile Picture */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Nom Et Prenom</Text>
        <TextInput
          style={styles.input}
          value={userData.nom_prenom}
          onChangeText={(text) => setUserData({ ...userData, nom_prenom: text })}
        />

        <Text style={styles.label}>Numero De Téléphone</Text>
        <TextInput
          style={styles.input}
          value={userData.numero_telephone}
          onChangeText={(text) => setUserData({ ...userData, numero_telephone: text })}
        />


        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
        />

        <Text style={styles.label}>Date De Naissance</Text>
        <TextInput
          style={styles.input}
          value={userData.date_naissance}
          onChangeText={(text) => setUserData({ ...userData, date_naissance: text })}
        />
      </View>


      {/* Medical Information Button */}
      <TouchableOpacity
        style={styles.medicalButton}
        onPress={onMedicalInfo} >
        <Text style={styles.medicalButtonText}>Informations Medicales</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>

    </ScrollView>
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
    fontSize: 20,
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
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E87E6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F5EFE0',
  },
  editIcon: {
    fontSize: 16,
  },
  formSection: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#D4E8E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  medicalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E87E6B',
    marginHorizontal: 25,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  medicalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});