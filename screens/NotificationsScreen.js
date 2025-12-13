import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function NotificationsScreen({ onBack }) {
  const [notifications, setNotifications] = useState([
    { id: 1, name: 'Fournisseur 1', time: '2 M', date: "Aujourd'hui", read: false },
    { id: 2, name: 'Fournisseur 1', time: '2 M', date: "Aujourd'hui", read: true },
    { id: 3, name: 'Fournisseur 1', time: '2 M', date: "Aujourd'hui", read: false },
    { id: 4, name: 'Fournisseur 4', time: '1D', date: "Hier", read: false },
    { id: 5, name: 'Fournisseur 5', time: '5 D', date: "15 Avril", read: false },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const groupNotificationsByDate = () => {
    const grouped = {};
    notifications.forEach(notification => {
      if (!grouped[notification.date]) {
        grouped[notification.date] = [];
      }
      grouped[notification.date].push(notification);
    });
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Image
            source={require('../assets/Notif.png')}
            style={{ width: 28, height: 28 }} 
            resizeMode="contain"
          />
          {getUnreadCount() > 0 && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      {/* News Badge */}
      <View style={styles.newsBadgeContainer}>
        <View style={styles.newsBadge}>
          <Text style={styles.newsBadgeText}>News</Text>
          {getUnreadCount() > 0 && (
            <View style={styles.newsCount}>
              <Text style={styles.newsCountText}>{getUnreadCount()}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedNotifications).map((date, dateIndex) => (
          <View key={dateIndex}>
            {/* Date Header */}
            <View style={styles.dateHeader}>
              <View style={styles.dateLabel}>
                <Text style={styles.dateText}>{date}</Text>
              </View>
              {date === "Aujourd'hui" && (
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={styles.markAllText}>Marquer tout</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Notifications for this date */}
            {groupedNotifications[date].map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.notificationUnread
                ]}
              >
                <View style={styles.notificationIcon}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>≡</Text>
                  </View>
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationName}>{notification.name}</Text>
                </View>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#E87E6B',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E87E6B',
  },
  newsBadgeContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  newsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E87E6B',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newsBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  newsCount: {
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsCountText: {
    color: '#E87E6B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  dateLabel: {
    backgroundColor: '#D4E8E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  dateText: {
    color: '#E87E6B',
    fontSize: 14,
    fontWeight: '500',
  },
  markAllText: {
    color: '#E87E6B',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  notificationUnread: {
    backgroundColor: '#E8D4D8',
  },
  notificationIcon: {
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A8D5D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationTime: {
    fontSize: 14,
    color: '#666',
  },
});