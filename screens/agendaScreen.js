import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../supabase';

export default function AgendaScreen({ userId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('task'); // 'medication', 'appointment', 'task'
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState({
    visible: false,
    reminder: null,
  });

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  
  const taskTypes = [
    { value: 'medication', label: '💊 Médicament', icon: '💊' },
    { value: 'appointment', label: '🏥 Rendez-vous', icon: '🏥' },
    { value: 'task', label: '✓ Tâche', icon: '✓' },
  ];

  // Générer le calendrier du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Charger les rappels pour la date sélectionnée
  const fetchReminders = async () => {
    if (!userId) return;
    
    setLoading(true);
    const dateString = selectedDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateString)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching reminders:', error);
      Alert.alert('Erreur', 'Impossible de charger les rappels');
    } else {
      setReminders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
  }, [selectedDate, userId]);

  // Ajouter un rappel
  const addReminder = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Attention', 'Veuillez entrer un titre pour la tâche');
      return;
    }

    setLoading(true);
    const dateString = selectedDate.toISOString().split('T')[0];

    const { error } = await supabase
      .from('reminders')
      .insert([{
        user_id: userId,
        date: dateString,
        time: selectedTime + ':00', // Format time as HH:MM:SS
        type: taskType,
        title: taskTitle,
        description: taskDescription || taskTitle,
        completed: false,
      }]);

    if (error) {
      console.error('Insert error:', error);
      Alert.alert('Erreur', error.message);
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskType('task');
      Alert.alert('Succès', 'Tâche ajoutée !');
      fetchReminders();
    }
    setLoading(false);
  };

  // Modifier un rappel
  const updateReminder = async () => {
    if (!editModal.reminder) return;

    const timeString = editModal.reminder.time.includes(':') 
      ? editModal.reminder.time 
      : editModal.reminder.time + ':00';

    const { error } = await supabase
      .from('reminders')
      .update({
        title: editModal.reminder.title,
        description: editModal.reminder.description,
        time: timeString,
        type: editModal.reminder.type,
      })
      .eq('id', editModal.reminder.id);

    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      setEditModal({ visible: false, reminder: null });
      Alert.alert('Succès', 'Tâche modifiée !');
      fetchReminders();
    }
  };

  // Supprimer un rappel
  const deleteReminder = async (id) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('reminders')
              .delete()
              .eq('id', id);

            if (error) {
              Alert.alert('Erreur', error.message);
            } else {
              fetchReminders();
            }
          },
        },
      ]
    );
  };

  // Marquer comme complété
  const toggleCompleted = async (id, currentStatus) => {
    const { error } = await supabase
      .from('reminders')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      fetchReminders();
    }
  };

  // Navigation mois
  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getTypeIcon = (type) => {
    const typeObj = taskTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : '✓';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agenda</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendrier */}
        <View style={styles.calendar}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={styles.navButton}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{monthNames[selectedDate.getMonth()]}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={styles.navButton}>›</Text>
            </TouchableOpacity>
            <Text style={styles.yearText}>{selectedDate.getFullYear()}</Text>
          </View>

          <View style={styles.weekDays}>
            {weekDays.map((day, i) => (
              <Text key={i} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day === selectedDate.getDate() && styles.selectedDay,
                ]}
                onPress={() => {
                  if (day) {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(day);
                    setSelectedDate(newDate);
                  }
                }}
                disabled={!day}
              >
                <Text
                  style={[
                    styles.dayText,
                    !day && styles.emptyDay,
                    day === selectedDate.getDate() && styles.selectedDayText,
                  ]}
                >
                  {day || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type de tâche */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type:</Text>
          <View style={styles.typeButtons}>
            {taskTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  taskType === type.value && styles.selectedTypeButton,
                ]}
                onPress={() => setTaskType(type.value)}
              >
                <Text style={[
                  styles.typeButtonText,
                  taskType === type.value && styles.selectedTypeButtonText,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sélection de l'heure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Heure</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeSlots}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.selectedTimeText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Titre de la tâche */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tâche:</Text>
          <TextInput
            style={styles.input}
            placeholder="Prends tes médicaments"
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor="#999"
          />
        </View>

        {/* Description (optionnelle) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (optionnelle):</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ajouter des détails..."
            value={taskDescription}
            onChangeText={setTaskDescription}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Bouton Ajouter */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addReminder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Ajouter une tâche</Text>
          )}
        </TouchableOpacity>

        {/* Liste des rappels du jour */}
        <View style={styles.remindersList}>
          <Text style={styles.remindersTitle}>
            Rappels du {selectedDate.toLocaleDateString('fr-FR')}:
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#6BB6B0" style={{marginTop: 20}} />
          ) : reminders.length === 0 ? (
            <Text style={styles.noReminders}>Aucun rappel pour cette date</Text>
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} style={[
                styles.reminderCard,
                reminder.completed && styles.completedCard
              ]}>
                <TouchableOpacity 
                  style={styles.checkBox}
                  onPress={() => toggleCompleted(reminder.id, reminder.completed)}
                >
                  <Text style={styles.checkIcon}>
                    {reminder.completed ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.reminderInfo}>
                  <View style={styles.reminderHeader}>
                    <Text style={styles.reminderType}>
                      {getTypeIcon(reminder.type)}
                    </Text>
                    <Text style={styles.reminderTime}>
                      {reminder.time?.substring(0, 5) || '00:00'}
                    </Text>
                  </View>
                  <Text style={[
                    styles.reminderTitle,
                    reminder.completed && styles.completedText
                  ]}>
                    {reminder.title}
                  </Text>
                  {reminder.description && reminder.description !== reminder.title && (
                    <Text style={styles.reminderDesc}>
                      {reminder.description}
                    </Text>
                  )}
                </View>
                
                <View style={styles.reminderActions}>
                  <TouchableOpacity
                    onPress={() => setEditModal({ 
                      visible: true, 
                      reminder: {
                        ...reminder,
                        time: reminder.time?.substring(0, 5) || '09:00'
                      }
                    })}
                  >
                    <Text style={styles.editBtn}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteReminder(reminder.id)}>
                    <Text style={styles.deleteBtn}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabButton}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de modification */}
      <Modal
        visible={editModal.visible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModal({ visible: false, reminder: null })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la tâche</Text>
            
            <Text style={styles.modalLabel}>Type:</Text>
            <View style={styles.typeButtons}>
              {taskTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    editModal.reminder?.type === type.value && styles.selectedTypeButton,
                  ]}
                  onPress={() => setEditModal({
                    ...editModal,
                    reminder: { ...editModal.reminder, type: type.value }
                  })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    editModal.reminder?.type === type.value && styles.selectedTypeButtonText,
                  ]}>
                    {type.icon}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Heure:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeSlots}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      editModal.reminder?.time === time && styles.selectedTimeSlot,
                    ]}
                    onPress={() => setEditModal({
                      ...editModal,
                      reminder: { ...editModal.reminder, time }
                    })}
                  >
                    <Text style={[
                      styles.timeText,
                      editModal.reminder?.time === time && styles.selectedTimeText,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.modalLabel}>Titre:</Text>
            <TextInput
              style={styles.modalInput}
              value={editModal.reminder?.title}
              onChangeText={(text) => setEditModal({
                ...editModal,
                reminder: { ...editModal.reminder, title: text }
              })}
            />

            <Text style={styles.modalLabel}>Description:</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              value={editModal.reminder?.description}
              onChangeText={(text) => setEditModal({
                ...editModal,
                reminder: { ...editModal.reminder, description: text }
              })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModal({ visible: false, reminder: null })}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={updateReminder}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#FF7B5F',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7B5F',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7B5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendar: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    fontSize: 24,
    color: '#333',
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  yearText: {
    fontSize: 18,
    color: '#666',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  emptyDay: {
    color: 'transparent',
  },
  selectedDay: {
    backgroundColor: '#6BB6B0',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#6BB6B0',
    borderColor: '#6BB6B0',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTypeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  timeSlots: {
    flexDirection: 'row',
    gap: 10,
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTimeSlot: {
    backgroundColor: '#6BB6B0',
    borderColor: '#6BB6B0',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#6BB6B0',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  remindersList: {
    marginBottom: 100,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  noReminders: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedCard: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
  },
  checkBox: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  checkIcon: {
    fontSize: 24,
    color: '#6BB6B0',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reminderType: {
    fontSize: 18,
    marginRight: 8,
  },
  reminderTime: {
    fontSize: 14,
    color: '#6BB6B0',
    fontWeight: '600',
  },
  reminderTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 3,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  reminderDesc: {
    fontSize: 14,
    color: '#666',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 15,
  },
  editBtn: {
    fontSize: 20,
  },
  deleteBtn: {
    fontSize: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FF7B5F',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 10,
  },
  navIcon: {
    fontSize: 24,
  },
  fabButton: {
    backgroundColor: '#FF7B5F',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    borderWidth: 4,
    borderColor: '#F5F0E8',
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6BB6B0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});