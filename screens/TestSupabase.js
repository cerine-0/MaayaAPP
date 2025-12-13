import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from './lib/supabase';

const USER_ID = "17847301-5fdf-4499-8bdb-774a98c37ea0";

export default function TestSupabase() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function testConnection() {
    setLoading(true);
    setResult('🔄 Test de connexion...');
    
    try {
      // Test 1: Connexion Supabase
      if (!supabase) {
        setResult('❌ Supabase non initialisé');
        return;
      }
      
      setResult(prev => prev + '\n✅ Supabase initialisé');
      
      // Test 2: Lire la table
      const { data, error } = await supabase
        .from('agenda')
        .select('*')
        .limit(5);
      
      if (error) {
        setResult(prev => prev + '\n❌ Erreur lecture: ' + error.message);
        return;
      }
      
      setResult(prev => prev + '\n✅ Lecture OK: ' + data.length + ' tâches trouvées');
      setResult(prev => prev + '\n📋 Données: ' + JSON.stringify(data, null, 2));
      
    } catch (error) {
      setResult(prev => prev + '\n❌ Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function testInsert() {
    setLoading(true);
    setResult('🔄 Test d\'insertion...');
    
    try {
      const testTask = {
        user_id: USER_ID,
        date: '2024-12-15',
        time: '10:00',
        title: 'Test task ' + new Date().getTime(),
        description: 'Test description',
        completed: false
      };
      
      setResult(prev => prev + '\n📤 Envoi: ' + JSON.stringify(testTask, null, 2));
      
      const { data, error } = await supabase
        .from('agenda')
        .insert([testTask])
        .select();
      
      if (error) {
        setResult(prev => prev + '\n❌ Erreur insertion: ' + error.message);
        setResult(prev => prev + '\n❌ Détails: ' + JSON.stringify(error, null, 2));
        return;
      }
      
      setResult(prev => prev + '\n✅ Insertion OK!');
      setResult(prev => prev + '\n📋 Résultat: ' + JSON.stringify(data, null, 2));
      Alert.alert('Succès', 'Tâche test ajoutée!');
      
    } catch (error) {
      setResult(prev => prev + '\n❌ Erreur catch: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkRLS() {
    setLoading(true);
    setResult('🔄 Vérification RLS...');
    
    try {
      // Vérifier si RLS bloque
      const { data, error, count } = await supabase
        .from('agenda')
        .select('*', { count: 'exact' })
        .eq('user_id', USER_ID);
      
      if (error) {
        setResult(prev => prev + '\n❌ Erreur RLS: ' + error.message);
        
        if (error.message.includes('row-level security')) {
          setResult(prev => prev + '\n\n⚠️ RLS est activé mais les policies ne marchent pas!');
          setResult(prev => prev + '\n💡 Solutions:');
          setResult(prev => prev + '\n1. Désactive RLS temporairement');
          setResult(prev => prev + '\n2. Ou ajoute les policies correctes');
        }
        return;
      }
      
      setResult(prev => prev + '\n✅ RLS OK ou désactivé');
      setResult(prev => prev + '\n📊 Total tâches: ' + count);
      
    } catch (error) {
      setResult(prev => prev + '\n❌ Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Test Supabase Agenda</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonBlue]} 
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Test...' : '1️⃣ Test Connexion'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonGreen]} 
          onPress={testInsert}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Test...' : '2️⃣ Test Insertion'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonOrange]} 
          onPress={checkRLS}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Test...' : '3️⃣ Check RLS'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{result || '👋 Clique sur un bouton pour tester'}</Text>
      </ScrollView>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Instructions:</Text>
        <Text style={styles.infoText}>1. Clique "Test Connexion" d'abord</Text>
        <Text style={styles.infoText}>2. Si OK, clique "Test Insertion"</Text>
        <Text style={styles.infoText}>3. Si erreur, clique "Check RLS"</Text>
        <Text style={styles.infoText}>4. Vérifie ta console navigateur (F12)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonBlue: {
    backgroundColor: '#4A90E2',
  },
  buttonGreen: {
    backgroundColor: '#4CAF50',
  },
  buttonOrange: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  resultText: {
    color: '#00FF00',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});