import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getTasksForDate, toggleTaskCompleted } from '../agendaQueries';

const { width } = Dimensions.get('window');

// ========== BOTTOM NAVIGATION ==========
function CurvedNavigationBar({ 
  onTabPress, 
  activeIndex = 0 
}) {
  const tabs = [
    { icon: 'home', name: 'Home' },
    { icon: 'person', name: 'Profile' },
    { icon: 'notifications', name: 'Notifications' },
    { icon: 'call', name: 'Call' },
  ];

  return (
    <View style={navStyles.container}>
      <View style={navStyles.background} />

      <View style={navStyles.tabsContainer}>
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          
          return (
            <TouchableOpacity
              key={index}
              style={navStyles.tabButton}
              onPress={() => onTabPress && onTabPress(index)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={26}
                color={isActive ? '#fff' : 'rgba(255,255,255,0.6)'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ========== HOME SCREEN ==========
export default function HomeScreen({ onNavigateToAgenda, onNavigateToEmergency,userId }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  console.log('🏠 HomeScreen - userId:', userId);

  // Effet pour rafraîchir quand le composant devient visible
  useEffect(() => {
    if (isVisible) {
      console.log('🔄 HomeScreen est maintenant visible, refresh des données...');
    }
  }, [isVisible]);

  const handleTabPress = (index) => {
    setCurrentPage(index);
    if (index === 3 && onNavigateToEmergency) {
      onNavigateToEmergency();
    } else {
      setCurrentPage(index);
    }
  
  };

  const renderContent = () => {
    switch (currentPage) {
      case 0:
        return (
          <HomeContent 
            onNavigateToAgenda={onNavigateToAgenda} 
            onNavigateToEmergency={onNavigateToEmergency} 

            userId={userId}
          />
        );
      case 1:
        return <ProfileContent />;
      case 2:
        return <NotificationsContent />;
      case 3:
        return <CallContent />;
      default:
        return (
          <HomeContent 
            onNavigateToAgenda={onNavigateToAgenda} 
            userId={userId}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      <CurvedNavigationBar
        onTabPress={handleTabPress}
        activeIndex={currentPage}
      />
    </View>
  );
}

// ========== HOME CONTENT ==========
function HomeContent({ onNavigateToAgenda, userId }) {
  const [todayTasks, setTodayTasks] = useState([]);
  const [nextTask, setNextTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recharger les données au montage ET toutes les 2 secondes
  useEffect(() => {
    console.log('📱 HomeContent mounted');
    console.log('👤 userId:', userId);
    
    if (userId) {
      loadTodayTasks();
      
      // Rafraîchir automatiquement toutes les 2 secondes
      const interval = setInterval(() => {
        console.log('🔄 Auto-refresh des tâches...');
        loadTodayTasks();
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      console.error('❌ userId is missing!');
      setLoading(false);
    }
  }, [userId]);

  // Fonction pour convertir "HH:MM" en minutes depuis minuit
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
async function loadTodayTasks() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    console.log("📅 Date d'aujourd'hui:", todayStr);
    
    const tasks = await getTasksForDate(userId, todayStr);
    console.log("📋 Tâches d'aujourd'hui:", tasks);
    
    // Filtrer SEULEMENT les tâches d'aujourd'hui
    const todayTasksOnly = (tasks || []).filter(task => {
      const taskDate = task.date; // Supposons que task.date est au format YYYY-MM-DD
      return taskDate === todayStr;
    });
    
    console.log("✅ Tâches filtrées (aujourd'hui seulement):", todayTasksOnly);
    
    // Trier par heure
    const sortedTasks = todayTasksOnly.sort((a, b) => {
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
    
    setTodayTasks(sortedTasks);
    
    // Trouver la prochaine tâche (uniquement parmi les tâches d'aujourd'hui)
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    console.log("⏰ Heure actuelle (minutes):", currentMinutes);
    
    // Chercher la première tâche d'aujourd'hui NON COMPLÉTÉE qui est dans le futur
    const upcomingTask = sortedTasks.find(task => {
      if (task.completed) return false; // Ignorer les tâches complétées
      
      const taskMinutes = timeToMinutes(task.time);
      // Vérifier que la tâche est aujourd'hui ET dans le futur
      const taskDate = task.date;
      const isToday = taskDate === todayStr;
      const isFuture = taskMinutes > currentMinutes;
      
      console.log(`🔍 Tâche: ${task.title} à ${task.time} (${taskMinutes} min), date: ${taskDate}, aujourd'hui: ${isToday}, future: ${isFuture}`);
      
      return isToday && isFuture;
    });
    
    console.log("🎯 Prochaine tâche trouvée:", upcomingTask);
    
    // Si aucune tâche à venir pour aujourd'hui, prendre null
    setNextTask(upcomingTask || null);
    
    setLoading(false);
    
  } catch (error) {
    console.error('❌ Error loading tasks:', error);
    setTodayTasks([]);
    setNextTask(null);
    setLoading(false);
  }
}

  async function markTaskAsCompleted(taskId) {
    try {
      console.log('✔️ Marking task as completed:', taskId);
      const result = await toggleTaskCompleted(taskId, true);
      
      if (result) {
        Alert.alert('Succès', 'Tâche marquée comme complétée!');
        loadTodayTasks(); // Recharger les tâches
      } else {
        Alert.alert('Erreur', 'Impossible de marquer la tâche');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  }

  return (
    <View style={styles.homeContent}>
      {/* Header avec avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeLabel}>Bienvenue</Text>
          <Text style={styles.userName}>John Doe</Text>
        </View>
        <TouchableOpacity style={styles.notificationBell}>
          <Ionicons name="notifications" size={24} color="#FF7B6D" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Card de rappel - Next Task */}
      {loading ? (
        <View style={styles.reminderCard}>
          <View style={styles.reminderContent}>
            <View style={styles.reminderLeft}>
              <Text style={styles.reminderTitle}>Chargement...</Text>
            </View>
            <View style={styles.medicineIcon}>
              <Text style={styles.medicineEmoji}>⏳</Text>
            </View>
          </View>
        </View>
      ) : nextTask ? (
        <View style={styles.reminderCard}>
          <View style={styles.reminderBadge}>
            <Text style={styles.reminderBadgeText}>Au suivant</Text>
          </View>
          
          <View style={styles.reminderContent}>
            <View style={styles.reminderLeft}>
              <Text style={styles.reminderTitle}>{nextTask.title}</Text>
              <Text style={styles.reminderTime}>{nextTask.time}</Text>
            </View>
            <View style={styles.medicineIcon}>
              <Text style={styles.medicineEmoji}>💊</Text>
            </View>
          </View>

          {!nextTask.completed && (
            <TouchableOpacity 
              style={styles.takenButton}
              onPress={() => markTaskAsCompleted(nextTask.id)}
            >
              <Text style={styles.takenButtonText}>Marquer comme pris</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.reminderCard}>
          <View style={styles.reminderContent}>
            <View style={styles.reminderLeft}>
              <Text style={styles.reminderTitle}>Aucune tâche aujourd'hui</Text>
              <Text style={styles.reminderTime}>Vous êtes à jour!</Text>
            </View>
            <View style={styles.medicineIcon}>
              <Text style={styles.medicineEmoji}>✅</Text>
            </View>
          </View>
        </View>
      )}

      {/* Important rendez-vous */}
      <Text style={styles.sectionTitle}>
        Important rendez-vous d'aujourd'hui
      </Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : todayTasks.length === 0 ? (
        <View style={styles.emptyAppointments}>
          <Text style={styles.emptyText}>Aucun rendez-vous pour aujourd'hui</Text>
          <TouchableOpacity 
            style={styles.addTaskSmallButton}
            onPress={onNavigateToAgenda}
          >
            <Text style={styles.addTaskSmallButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.appointmentsList}>
          {todayTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.appointmentItem}>
              <View style={[
                styles.appointmentLine,
                task.completed && styles.appointmentLineCompleted
              ]} />
              <View style={styles.appointmentContent}>
                <Text style={[
                  styles.appointmentTitle,
                  task.completed && styles.appointmentTitleCompleted
                ]}>
                  {task.title}
                </Text>
                <Text style={styles.appointmentTime}>{task.time}</Text>
              </View>
              {task.completed && (
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              )}
            </View>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="chatbubble" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={onNavigateToAgenda}
        >
          <Ionicons name="calendar" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="fitness" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ========== OTHER TABS ==========
function ProfileContent() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.title}>Mon Profil</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
      </View>
    </View>
  );
}

function NotificationsContent() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Aucune nouvelle notification</Text>
    </View>
  );
}

function CallContent() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.title}>Appels d'urgence</Text>
      <Text style={styles.subtitle}>Contacts d'urgence</Text>
    </View>
  );
}

// ========== STYLES NAVIGATION ==========
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

// ========== STYLES PRINCIPAL ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  homeContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A8D5E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#FF7B6D',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  reminderCard: {
    backgroundColor: '#A8D5E2',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  reminderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  reminderBadgeText: {
    color: '#A8D5E2',
    fontSize: 12,
    fontWeight: '600',
  },
  reminderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reminderLeft: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reminderTime: {
    fontSize: 14,
    color: '#FF7B6D',
    fontWeight: '600',
  },
  medicineIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineEmoji: {
    fontSize: 28,
  },
  takenButton: {
    backgroundColor: '#FF7B6D',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  takenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  appointmentsList: {
    marginBottom: 25,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appointmentLine: {
    width: 3,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginRight: 15,
  },
  appointmentLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  appointmentTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  appointmentTime: {
    fontSize: 13,
    color: '#999',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  emptyAppointments: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  addTaskSmallButton: {
    backgroundColor: '#A8D5E2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  addTaskSmallButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  quickActionButton: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#A8D5E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileCard: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginTop: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
});