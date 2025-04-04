import { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? <Home user={user} /> : <Login setUser={setUser} />}
    </div>
  );
}

export default App;
