import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

const USER_ID = '17847301-5fdf-4499-8bdb-774a98c37ea0';


export default function RequestScreen({ onBack }) {
  const [requestType, setRequestType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [description, setDescription] = useState('');
  const [showRequestDropdown, setShowRequestDropdown] = useState(false);
  const [showUrgencyDropdown, setShowUrgencyDropdown] = useState(false);


  const requestTypes = [
    'Consultation médicale',
    'livraison',
    'transport',
    'Aide à domicile',
    'Assistance numérique',
    'Autre'
  ];

  const urgencyLevels = [
    'Très urgent',
    'Urgent',
    'Normal',
    'Pas urgent'
  ];

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!requestType || !urgency || !description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('requests').insert([
      {
        user_id: USER_ID,
        type: requestType,
        urgency,
        description,
        status: 'en attente',
      }
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      alert('Erreur lors de l’envoi');
    } else {
      alert('Demande envoyée');
      setRequestType('');
      setUrgency('');
      setDescription('');
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        {/* Request Type Dropdown */}
        <Text style={styles.label}>
          Veuillez s'il vous plaît rentrer le type de la demande:
        </Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowRequestDropdown(!showRequestDropdown)}
        >
          <Text style={styles.dropdownText}>
            {requestType || 'Sélectionner'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        {showRequestDropdown && (
          <View style={styles.dropdownMenu}>
            {requestTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setRequestType(type);
                  setShowRequestDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Urgency Dropdown */}
        <Text style={styles.label}>Urgence:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowUrgencyDropdown(!showUrgencyDropdown)}
        >
          <Text style={styles.dropdownText}>
            {urgency || 'Sélectionner'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        {showUrgencyDropdown && (
          <View style={styles.dropdownMenu}>
            {urgencyLevels.map((level, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setUrgency(level);
                  setShowUrgencyDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Description Text Area */}
        <Text style={styles.label}>décrivez votre problème:</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="..........................................................................................................................................................................................................................................................."
            placeholderTextColor="#A0B5B3"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.micButton}>
              <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  formSection: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D4E8E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  textAreaContainer: {
    backgroundColor: '#D4E8E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    minHeight: 220,
  },
  textArea: {
    fontSize: 15,
    color: '#333',
    minHeight: 160,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E87E6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7BC4BD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: '#fff',
  },
});