import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleAuthProvider, db } from '../../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import AimList from '../AimList/AimList';
import AddAim from '../AddAim/AddAim';
import EditAimForm from '../EditAimForm/EditAimForm';

Modal.setAppElement('#root');

const Home = () => {
  const [user, setUser] = useState(null);
  const [aims, setAims] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAim, setEditingAim] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  // Загружаем цели текущего пользователя из Firestore
  useEffect(() => {
    if (!user) {
      setAims([]);
      return;
    }

    const q = query(collection(db, 'goals'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAims(goals);
    });

    return unsubscribe;
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const handleComplete = async aimId => {
    const aimRef = doc(db, 'goals', aimId);
    await updateDoc(aimRef, { completed: true });
  };

  const handleDelete = async aimId => {
    const aimRef = doc(db, 'goals', aimId);
    await deleteDoc(aimRef);
  };

  const handleEditStart = aim => {
    setEditingAim(aim);
  };

  const handleEditCancel = () => {
    setEditingAim(null);
  };

  const handleEditSave = async updatedAim => {
    const aimRef = doc(db, 'goals', updatedAim.id);
    await updateDoc(aimRef, {
      title: updatedAim.title,
      description: updatedAim.description,
    });
    setEditingAim(null);
  };

  return (
    <div>
      <header>
        <p>Привіт, {user ? user.displayName : 'Гість'} 👋</p>
        {user ? (
          <button onClick={handleSignOut}>Вийти</button>
        ) : (
          <button onClick={handleSignIn}>Увійти з Google</button>
        )}
      </header>

      {user && (
        <button onClick={() => setIsAddModalOpen(true)}>Додати ціль</button>
      )}

      {aims.length > 0 ? (
        <div>
          {aims.some(aim => !aim.completed) && (
            <>
              <h3>Заплановані цілі</h3>
              <AimList
                aims={aims.filter(aim => !aim.completed)}
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                handleEditStart={handleEditStart}
              />
            </>
          )}

          {aims.some(aim => aim.completed) && (
            <>
              <h3>Виконані цілі</h3>
              <AimList
                aims={aims.filter(aim => aim.completed)}
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

      {/* Модалка редактирования */}
      <Modal isOpen={!!editingAim} onRequestClose={handleEditCancel}>
        <EditAimForm
          aim={editingAim}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      </Modal>

      {/* Модалка добавления */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <AddAim onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Home;
