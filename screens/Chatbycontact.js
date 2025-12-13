import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from "../lib/supabase"

export default function ContactChatScreen({ contact, onBack }) {
    if (!contact) return <Text>Loading...</Text>; // safety check
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef();
  const USER_ID = '17847301-5fdf-4499-8bdb-774a98c37ea0';

  useEffect(() => {
    loadMessages();

    // subscribe to real-time updates for this contact
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `contact_id=eq.${contact.id}` },
        (payload) => {
          setMessages(prev => [
            ...prev,
            {
              id: payload.new.id,
              sender: payload.new.sender_type === 'user' ? 'Vous' : contact.name,
              text: payload.new.text,
              time: formatTime(payload.new.created_at),
              date: formatDate(payload.new.created_at),
              isUser: payload.new.sender_type === 'user'
            }
          ]);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('contact_id', contact.id)
      .order('created_at', { ascending: true });

    if (data) {
      const formatted = data.map(msg => ({
        id: msg.id,
        sender: msg.sender_type === 'user' ? 'Vous' : contact.name,
        text: msg.text,
        time: formatTime(msg.created_at),
        date: formatDate(msg.created_at),
        isUser: msg.sender_type === 'user'
      }));
      setMessages(formatted);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else {
      console.log('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    await supabase.from('messages').insert({
      text: inputMessage,
      user_id: USER_ID,
      contact_id: contact.id,
      sender_type: 'user'
    });
    setInputMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
             <TouchableOpacity onPress={onBack}> 
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contact.name}</Text>
      </View>

      {/* Messages */}
   <FlatList
  ref={scrollViewRef}
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View
      style={{
        marginVertical: 5,
        alignItems: item.isUser ? 'flex-end' : 'flex-start'
      }}
    >
      {/* Message bubble */}
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.contactBubble
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>

      {/* Time just below bubble */}
      <Text style={[
        styles.messageTime,
        { marginTop: 2 } // small space from bubble
      ]}>
        {item.time}
      </Text>
    </View>
  )}
  contentContainerStyle={{ padding: 10 }}
/>



      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: 'white' }}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5EFE0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: '#F37C62',
    borderBottomColor:'#F37C62',
    marginBottom:20,
  },
  backIcon: {  color:'white', marginTop: 18,fontSize: 25, marginRight: 10 },
  headerTitle: {  color:'white',marginTop:20, alignSelf: 'center' ,fontSize: 18, fontWeight: 'bold' },
  messageBubble: { padding: 10, borderRadius: 10, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#D8E8DE', alignSelf: 'flex-end' },
  contactBubble: { backgroundColor: '#7BC4BD', alignSelf: 'flex-start' },
  messageText: { color: 'black' },
  messageTime: { fontSize: 10, color: '#F37C62', marginTop: 1, textAlign: 'right' },
  inputContainer: { backgroundcolor:'#D8E8DE', flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#ddd' },
  input: {marginBottom: 30, flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { marginBottom: 30, backgroundColor: '#7BC4BD', borderRadius: 20, paddingHorizontal: 15, justifyContent: 'center', marginLeft: 10 }
});
