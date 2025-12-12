import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    const fillAndPrint = async () => {
      try {
        setStatus('Filling database...');
        
        // Fill the table
        const { error: insertError } = await supabase
          .from('tasks')
          .insert([
            { title: 'Task 1', completed: false },
            { title: 'Task 2', completed: true },
            { title: 'Task 3', completed: false }
          ]);
        
        if (insertError) {
          setStatus(`Error: ${insertError.message}. Table probably doesn't exist.`);
          return;
        }
        
        setStatus('Fetching data...');
        
        // Print the data
        const { data } = await supabase
          .from('tasks')
          .select('*');
        
        setTasks(data || []);
        setStatus('');
        
      } catch (error) {
        setStatus(`Failed: ${error.message}`);
      }
    };
    
    fillAndPrint();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tasks from Database</h1>
      {status && <p>{status}</p>}
      
      {tasks.length > 0 ? (
        <div>
          {tasks.map((task, i) => (
            <div key={i} style={{ margin: '10px 0' }}>
              {task.completed ? '✓' : '○'} {task.title}
            </div>
          ))}
          <p>Total: {tasks.length} tasks</p>
        </div>
      ) : !status ? (
        <p>No tasks found.</p>
      ) : null}
      
      {status && status.includes('Error') && (
        <div style={{ background: '#ffebee', padding: '10px', marginTop: '20px' }}>
          <p><strong>You need to create the table first:</strong></p>
          <p>1. Go to Supabase → SQL Editor</p>
          <p>2. Run this SQL command:</p>
          <pre style={{ background: '#f5f5f5', padding: '10px' }}>
            CREATE TABLE tasks (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, title TEXT NOT NULL, completed BOOLEAN DEFAULT false);
          </pre>
          <p>3. Refresh this page</p>
        </div>
      )}
    </div>
  );
}