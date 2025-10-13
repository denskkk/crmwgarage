// Quick start example: Add this to your App.tsx to test Supabase Auth

/*
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { LoginForm } from './components/LoginForm';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to CRM</h1>
      <p>Logged in as: {user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
      
      {/* Your existing CRM UI here *\/}
    </div>
  );
}

export default App;
*/
