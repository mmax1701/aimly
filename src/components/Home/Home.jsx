import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { auth, googleAuthProvider } from '../../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import AimList from '../AimList/AimList';
import EditAimForm from '../EditAimForm/EditAimForm';
import AddAim from '../AddAim/AddAim';
import { nanoid } from 'nanoid';

Modal.setAppElement('#root');

const Home = () => {
  const [aims, setAims] = useState([]);
  const [editingAim, setEditingAim] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const handleComplete = aimId => {
    setAims(prevAims =>
      prevAims.map(aim =>
        aim.id === aimId ? { ...aim, completed: !aim.completed } : aim
      )
    );
  };

  const handleDelete = aimId => {
    setAims(prevAims => prevAims.filter(aim => aim.id !== aimId));
  };

  const handleAddAim = newAim => {
    const aimWithId = { ...newAim, id: nanoid(), completed: false };
    setAims(prev => [aimWithId, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleEditStart = aimId => {
    const aimToEdit = aims.find(aim => aim.id === aimId);
    if (aimToEdit) {
      setEditingAim(aimToEdit);
    }
  };

  const handleEditCancel = () => {
    setEditingAim(null);
  };

  const handleEditSave = updatedAim => {
    setAims(prev =>
      prev.map(aim => (aim.id === updatedAim.id ? updatedAim : aim))
    );
    setEditingAim(null);
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <p>Привіт, {user ? user.displayName : 'Гість'}</p>
        {user ? (
          <button onClick={handleSignOut}>Вийти</button>
        ) : (
          <button onClick={handleSignIn}>Увійти з Google</button>
        )}
      </div>

      <button onClick={() => setIsAddModalOpen(true)}>Додати ціль</button>

      {aims.length > 0 ? (
        <div>
          {aims.some(a => !a.completed) && (
            <>
              <h3>Заплановані</h3>
              <AimList
                aims={aims.filter(a => !a.completed)}
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                handleEditStart={handleEditStart}
              />
            </>
          )}

          {aims.some(a => a.completed) && (
            <>
              <h3>Виконані</h3>
              <AimList
                aims={aims.filter(a => a.completed)}
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                handleEditStart={handleEditStart}
              />
            </>
          )}
        </div>
      ) : (
        <p>Наразі список з цілями порожній</p>
      )}

      <Modal isOpen={!!editingAim} onRequestClose={handleEditCancel}>
        {editingAim && (
          <EditAimForm
            aim={editingAim}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <AddAim
          onSave={handleAddAim}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Home;
