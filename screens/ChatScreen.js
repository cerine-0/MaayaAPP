import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen({ onOpenChat }) {
      const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef();
  const USER_ID = '17847301-5fdf-4499-8bdb-774a98c37ea0';
  const unreadCount = messages.length;

  // Load messages and subscribe to real-time updates
  useEffect(() => {
    loadMessages();
    loadContacts();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => [
            ...prev,
            {
              id: payload.new.id,
              sender: payload.new.sender,
              text: payload.new.text,
              time: 'À l\'instant',
              date: 'Aujourd\'hui',
              isUser: payload.new.user_id === USER_ID
            }
          ]);
          setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch messages from Supabase
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      const formatted = data.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        time: formatTime(msg.created_at),
        date: formatDate(msg.created_at),
        isUser: msg.user_id === USER_ID
      }));
      setMessages(formatted);
    } else {
      console.log('Error loading messages:', error);
    }
  };

  // Fetch contacts from Supabase
  const loadContacts = async () => {
    const { data, error } = await supabase
      .from('contacts') // make sure your table is called 'contacts'
      .select('*')
      .eq('user_id', USER_ID)
      .order('created_at', { ascending: true });

    if (data) {
      setContacts(data);
    } else {
      console.log('Error loading contacts:', error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender: 'Vous',
        text: inputMessage,
        user_id: USER_ID
      })
      .select();

    if (!error) setInputMessage('');
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000 / 60);
    if (diff < 1) return 'À l\'instant';
    if (diff < 60) return `${diff} M`;
    if (diff < 1440) return `${Math.floor(diff / 60)} H`;
    return `${Math.floor(diff / 1440)} D`;
  };

  const formatDate = (timestamp) => {
    const today = new Date().toDateString();
    const date = new Date(timestamp).toDateString();
    if (date === today) return "Aujourd'hui";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date === yesterday.toDateString()) return "Hier";
    return new Date(timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  const groupedMessages = messages.reduce((acc, message) => {
    if (!acc[message.date]) acc[message.date] = [];
    acc[message.date].push(message);
    return acc;
  }, {});

  return (
    <View 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Image
            source={require('../assets/Notif.png')}
            style={{ width: 28, height: 28 }} 
            resizeMode="contain"
          />
          {unreadCount > 0 && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

    

 
 <ScrollView style={{ padding: 10 }}>
    {contacts.map(contact => (
      <TouchableOpacity 
        key={contact.id} 
        onPress={() => onOpenChat(contact)} // pass contact when clicked
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 20
        }}
      >
        <View style={{ 
          width: 60, 
          height: 60, 
          borderRadius: 30, 
          backgroundColor: '#7BC4BD', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginRight: 15 
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {contact.name[0]}
          </Text>
        </View>
        <Text style={{ fontSize: 16, maxWidth: 200 }} numberOfLines={1}>
          {contact.name}
        </Text>
      </TouchableOpacity>
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
    backgroundColor: '#F5EFE0',
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
  actualiteBadgeContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  actualiteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E87E6B',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actualiteBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  actualiteCount: {
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actualiteCountText: {
    color: '#E87E6B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageIcon: {
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
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 13,
    color: '#999',
  },
  messageBubble: {
    backgroundColor: '#D4E8E5',
    padding: 12,
    borderRadius: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#E8D4D8',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5EFE0',
    borderTopWidth: 1,
    borderTopColor: '#E0D8C8',
  },
  input: {
    flex: 1,
    backgroundColor: '#D4E8E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7BC4BD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendIcon: {
    fontSize: 20,
    color: '#fff',
  },
});