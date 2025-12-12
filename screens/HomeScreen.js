import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { supabase } from '../supabase';

export default function HomeScreen({ onNext }) {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    const fillAndPrint = async () => {
      try {
        setStatus('Filling database...');
        const { error: insertError } = await supabase
          .from('tasks')
          .insert([
            { title: 'Task 1', completed: false },
            { title: 'Task 2', completed: true },
            { title: 'Task 3', completed: false }
          ]);

        if (insertError) {
          setStatus(`Error: ${insertError.message}`);
          return;
        }

        setStatus('Fetching data...');
        const { data } = await supabase.from('tasks').select('*');
        setTasks(data || []);
        setStatus('');
      } catch (error) {
        setStatus(`Failed: ${error.message}`);
      }
    };

    fillAndPrint();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Tasks from Database</Text>

      {status ? <Text>{status}</Text> : null}

      {tasks.map((task, i) => (
        <Text key={i} style={{ marginVertical: 5 }}>
          {task.completed ? '✓' : '○'} {task.title}
        </Text>
      ))}

      {tasks.length > 0 && <Text style={{ marginTop: 20 }}>Total: {tasks.length} tasks</Text>}

      <View style={{ marginTop: 30 }}>
        <Button title="Go to Next Screen" onPress={onNext} />
      </View>
    </ScrollView>
  );
}
