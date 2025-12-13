import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    addTask,
    deleteTask,
    getAgendaDates,
    getTasksForDate,
    updateTask
} from "../agendaQueries";

const { width } = Dimensions.get('window');

// ========== BOTTOM NAVIGATION ==========
function AgendaBottomNav({ onBack }) {
  return (
    <View style={navStyles.container}>
      <View style={navStyles.background} />
      <View style={navStyles.tabsContainer}>
        <TouchableOpacity style={navStyles.tabButton} onPress={onBack}>
          <Ionicons name="home" size={26} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.tabButton}>
          <Ionicons name="person" size={26} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.tabButton}>
          <Ionicons name="notifications" size={26} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.tabButton}>
          <Ionicons name="call" size={26} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AgendaScreen({ USER_ID, onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [datesWithTasks, setDatesWithTasks] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // 🔍 DEBUG: Vérifier USER_ID au démarrage
  useEffect(() => {
    console.log('🚀 AgendaScreen démarré');
    console.log('👤 USER_ID reçu:', USER_ID);
    console.log('📅 Date sélectionnée:', selectedDate.toISOString().split('T')[0]);
    
    if (!USER_ID) {
      Alert.alert('Erreur', 'USER_ID manquant! Impossible de charger les tâches.');
    }
  }, []);

  useEffect(() => {
    console.log('🔄 useEffect déclenché - Chargement des données...');
    loadTasksForDate();
    loadDatesWithTasks();
  }, [selectedDate, selectedMonth, selectedYear, USER_ID]);

  async function loadDatesWithTasks() {
    try {
      console.log("Chargement des dates avec tâches pour USER_ID:", USER_ID);
      const dates = await getAgendaDates(USER_ID);
      console.log("Dates avec tâches:", dates);
      setDatesWithTasks(dates);
    } catch (error) {
      console.error("Erreur chargement dates:", error);
      setDatesWithTasks([]);
    }
  }

  async function loadTasksForDate() {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      console.log("Chargement tâches pour date:", dateStr);
      const t = await getTasksForDate(USER_ID, dateStr);
      console.log("Tâches chargées:", t);
      setTasks(t);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Erreur chargement tâches:", error);
      setTasks([]);
    }
  }

  // Générer les heures à partir des tâches existantes
  function getAvailableTimeSlots() {
    const slots = new Set();
    tasks.forEach(task => {
      if (task.time) {
        slots.add(task.time);
      }
    });
    return Array.from(slots).sort();
  }

  function openAddModal(preselectedTime = "") {
    setEditingTask(null);
    setNewTaskTime(preselectedTime || selectedTimeSlot || "");
    setNewTaskTitle("");
    setModalVisible(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setNewTaskTime(task.time);
    setNewTaskTitle(task.title);
    setModalVisible(true);
  }

  async function saveTask() {
    if (!newTaskTime || !newTaskTitle) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    console.log("Sauvegarde tâche - Date:", dateStr, "Time:", newTaskTime, "Title:", newTaskTitle);

    try {
      if (editingTask) {
        console.log("Modification tâche ID:", editingTask.id);
        const updated = await updateTask(editingTask.id, {
          time: newTaskTime,
          title: newTaskTitle
        });
        
        if (updated) {
          console.log("Tâche modifiée avec succès");
          Alert.alert("Succès", "Tâche modifiée avec succès");
        } else {
          Alert.alert("Erreur", "Impossible de modifier la tâche");
          return;
        }
      } else {
        console.log("Ajout nouvelle tâche");
        const added = await addTask(USER_ID, dateStr, newTaskTime, newTaskTitle);
        
        if (added) {
          console.log("Tâche ajoutée avec succès:", added);
          Alert.alert("Succès", "Tâche ajoutée avec succès");
        } else {
          Alert.alert("Erreur", "Impossible d'ajouter la tâche");
          return;
        }
      }

      // Recharger les données
      await loadTasksForDate();
      await loadDatesWithTasks();
      setModalVisible(false);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert("Erreur", "Une erreur est survenue: " + error.message);
    }
  }

  async function confirmDelete(taskId) {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette tâche ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            console.log("Suppression tâche ID:", taskId);
            const deleted = await deleteTask(taskId);
            if (deleted) {
              console.log("Tâche supprimée avec succès");
              Alert.alert("Succès", "Tâche supprimée avec succès");
              await loadTasksForDate();
              await loadDatesWithTasks();
            } else {
              Alert.alert("Erreur", "Impossible de supprimer la tâche");
            }
          }
        }
      ]
    );
  }

  // Générer le calendrier
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Lundi = 0
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const days = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(selectedYear, selectedMonth, day);
      console.log('Date sélectionnée:', newDate.toISOString().split('T')[0]);
      setSelectedDate(newDate);
    }
  };

  const timeSlots = getAvailableTimeSlots();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#FF7B6D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agenda</Text>
        <TouchableOpacity style={styles.notificationBell}>
          <Ionicons name="notifications" size={24} color="#FF7B6D" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}>
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.calendarMonth}>{monthNames[selectedMonth]}</Text>

            <TouchableOpacity onPress={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.calendarYear}>{selectedYear}</Text>

            <TouchableOpacity>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
              <Text key={index} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              const isSelected = day === selectedDate.getDate() && 
                                selectedMonth === selectedDate.getMonth() &&
                                selectedYear === selectedDate.getFullYear();
              
              const dateStr = day ? 
                new Date(selectedYear, selectedMonth, day).toISOString().split('T')[0]
                : null;
              const hasTask = dateStr && datesWithTasks.includes(dateStr);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDay
                  ]}
                  onPress={() => handleDateSelect(day)}
                  disabled={!day}
                >
                  {day && (
                    <>
                      <Text style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText
                      ]}>
                        {day}
                      </Text>
                      {hasTask && !isSelected && (
                        <View style={styles.taskIndicator} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time Section - Afficher SEULEMENT si on a sélectionné une heure */}
        {selectedTimeSlot && (
          <View style={styles.timeSection}>
            <View style={styles.timeSectionHeader}>
              <Text style={styles.sectionLabel}>Heure sélectionnée</Text>
              <TouchableOpacity onPress={() => setSelectedTimeSlot(null)}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.selectedTimeDisplay}>
              <Ionicons name="time-outline" size={20} color="#4A90E2" />
              <Text style={styles.selectedTimeText}>{selectedTimeSlot}</Text>
            </View>
          </View>
        )}

        {/* Task Section */}
        <View style={styles.taskSection}>
          <View style={styles.taskSectionHeader}>
            <Text style={styles.sectionLabel}>
              Tâches du {selectedDate.getDate()} {monthNames[selectedMonth]}
            </Text>
            <Text style={styles.taskCount}>({tasks.length})</Text>
          </View>
          
          {tasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Aucune tâche pour cette date</Text>
              <Text style={styles.emptySubtext}>
                Appuyez sur "Ajouter une tâche" pour commencer
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity 
                key={task.id} 
                style={[
                  styles.taskCard,
                  selectedTimeSlot === task.time && styles.taskCardSelected
                ]}
                onPress={() => setSelectedTimeSlot(task.time)}
                activeOpacity={0.7}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.taskTimeContainer}>
                    <Ionicons name="time-outline" size={16} color="#4A90E2" />
                    <Text style={styles.taskTime}>{task.time}</Text>
                  </View>
                  <View style={styles.taskActions}>
                    <TouchableOpacity 
                      onPress={() => openEditModal(task)} 
                      style={styles.taskActionButton}
                    >
                      <Ionicons name="create-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => confirmDelete(task.id)} 
                      style={styles.taskActionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.taskText}>{task.title}</Text>
                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Add Task Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => openAddModal(selectedTimeSlot)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>
              {selectedTimeSlot ? `Ajouter tâche à ${selectedTimeSlot}` : 'Ajouter une tâche'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <AgendaBottomNav onBack={onBack} />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
            </Text>

            <Text style={styles.modalDate}>
              {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>

            <Text style={styles.label}>Heure *</Text>
            <TextInput
              style={styles.input}
              value={newTaskTime}
              onChangeText={setNewTaskTime}
              placeholder="Ex: 09:00, 14:30"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Tâche à faire *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Ex: Prendre médicaments, Rendez-vous médecin..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveTask}
              >
                <Text style={styles.saveButtonText}>
                  {editingTask ? "Modifier" : "Ajouter"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ========== NAVIGATION STYLES ==========
const navStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 70,
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#FF9B88',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

// ========== MAIN STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF7B6D',
  },
  notificationBell: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  calendarYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 10,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 35,
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
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
    marginVertical: 2,
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskIndicator: {
    position: 'absolute',
    bottom: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF3B30',
  },
  timeSection: {
    marginBottom: 20,
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
  },
  timeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
  },
  selectedTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  taskSection: {
    marginBottom: 20,
  },
  taskSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  taskCount: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  taskCardSelected: {
    borderColor: '#4A90E2',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A90E2',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10,
  },
  taskActionButton: {
    padding: 5,
  },
  taskText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: '#A8D5E2',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  modalDate: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#A8D5E2',
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});