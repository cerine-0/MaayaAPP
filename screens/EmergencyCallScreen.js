import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const emergencyContacts = [
  {
    id: 1,
    name: 'Police',
    number: '112',
    icon: 'shield',
    color: '#3B82F6',
    description: 'Urgences générales'
  },
  {
    id: 2,
    name: 'Pompier',
    number: '18',
    icon: 'flame',
    color: '#EF4444',
    description: 'Incendie, secours'
  },
  {
    id: 3,
    name: 'SAMU',
    number: '15',
    icon: 'medical',
    color: '#10B981',
    description: 'Urgences médicales'
  },
  {
    id: 4,
    name: 'Centre Anti-Poison',
    number: '0810 810 017',
    icon: 'warning',
    color: '#F59E0B',
    description: 'Intoxications'
  },
  {
    id: 5,
    name: 'SOS Médecin',
    number: '3624',
    icon: 'medkit',
    color: '#8B5CF6',
    description: 'Médecin à domicile'
  },
  {
    id: 6,
    name: 'SOS Violences',
    number: '3919',
    icon: 'female',
    color: '#EC4899',
    description: 'Violences conjugales'
  },
  {
    id: 7,
    name: 'SOS Suicide',
    number: '3114',
    icon: 'heart',
    color: '#F97316',
    description: 'Écoute suicide'
  },
  {
    id: 8,
    name: 'SOS Enfance',
    number: '119',
    icon: 'happy',
    color: '#06B6D4',
    description: 'Enfance en danger'
  }
];

const personalContacts = [
  {
    id: 101,
    name: 'Médecin traitant',
    number: '01 23 45 67 89',
    icon: 'person',
    color: '#6366F1'
  },
  {
    id: 102,
    name: 'Pharmacie',
    number: '01 98 76 54 32',
    icon: 'medkit',
    color: '#8B5CF6'
  },
  {
    id: 103,
    name: 'Famille',
    number: '06 12 34 56 78',
    icon: 'people',
    color: '#10B981'
  },
  {
    id: 104,
    name: 'Voisin',
    number: '06 87 65 43 21',
    icon: 'home',
    color: '#F59E0B'
  }
];

export default function EmergencyCallScreen() {
  const [quickCallNumber, setQuickCallNumber] = useState(null);

  const makeCall = (phoneNumber) => {
    const phoneNumberFormatted = `tel:${phoneNumber}`;
    
    Alert.alert(
      'Appel d\'urgence',
      `Voulez-vous appeler ${phoneNumber} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Appeler',
          onPress: () => {
            Linking.openURL(phoneNumberFormatted).catch(err => {
              Alert.alert('Erreur', 'Impossible de passer l\'appel');
              console.error('Error making call:', err);
            });
          }
        }
      ]
    );
  };

  const sendSMS = (phoneNumber) => {
    const smsNumber = `sms:${phoneNumber}`;
    Linking.openURL(smsNumber).catch(err => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir les SMS');
      console.error('Error opening SMS:', err);
    });
  };

  const EmergencyContactCard = ({ contact }) => (
    <View style={styles.contactCard}>
      <View style={[styles.iconContainer, { backgroundColor: contact.color }]}>
        <Ionicons name={contact.icon} size={28} color="#FFF" />
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactNumber}>{contact.number}</Text>
        {contact.description && (
          <Text style={styles.contactDescription}>{contact.description}</Text>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: contact.color }]}
          onPress={() => makeCall(contact.number)}
        >
          <Ionicons name="call" size={20} color="#FFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#94A3B8' }]}
          onPress={() => sendSMS(contact.number)}
        >
          <Ionicons name="chatbubble" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const QuickCallButton = ({ contact }) => (
    <TouchableOpacity 
      style={[styles.quickCallButton, { backgroundColor: contact.color }]}
      onPress={() => makeCall(contact.number)}
    >
      <View style={styles.quickCallContent}>
        <Ionicons name={contact.icon} size={24} color="#FFF" />
        <View style={styles.quickCallInfo}>
          <Text style={styles.quickCallName}>{contact.name}</Text>
          <Text style={styles.quickCallNumber}>{contact.number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="warning" size={28} color="#EF4444" />
          <Text style={styles.headerTitle}>Appels d'urgence</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Appelez rapidement en cas d'urgence
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Section d'appel rapide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appel rapide</Text>
          <Text style={styles.sectionDescription}>
            Appuyez pour appeler directement
          </Text>
          
          <View style={styles.quickCallGrid}>
            {emergencyContacts.slice(0, 3).map(contact => (
              <QuickCallButton key={contact.id} contact={contact} />
            ))}
          </View>
        </View>

        {/* Numéros d'urgence principaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numéros d'urgence</Text>
          
          {emergencyContacts.map(contact => (
            <EmergencyContactCard key={contact.id} contact={contact} />
          ))}
        </View>

        {/* Contacts personnels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts personnels</Text>
          <Text style={styles.sectionDescription}>
            Personnes à prévenir en cas de besoin
          </Text>
          
          {personalContacts.map(contact => (
            <EmergencyContactCard key={contact.id} contact={contact} />
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>En cas d'urgence :</Text>
            <Text style={styles.infoText}>
              1. Restez calme{'\n'}
              2. Donnez votre adresse précise{'\n'}
              3. Décrivez l'urgence{'\n'}
              4. Ne raccrochez pas le premier
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bouton d'appel d'urgence flottant */}
      <TouchableOpacity 
        style={styles.floatingEmergencyButton}
        onPress={() => makeCall('112')}
      >
        <View style={styles.floatingButtonContent}>
          <Ionicons name="call" size={28} color="#FFF" />
          <Text style={styles.floatingButtonText}>URGENCE</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  quickCallGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCallButton: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 15,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickCallContent: {
    alignItems: 'center',
  },
  quickCallInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  quickCallName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  quickCallNumber: {
    fontSize: 11,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 2,
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 30,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  floatingEmergencyButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#EF4444',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  floatingButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
});