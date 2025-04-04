import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import AddAim from '../AddAim/AddAim';
import AimList from '../AimList/AimList';

const Home = () => {
  const [aims, setAims] = useState([]);
  const [addingAim, setAddingAim] = useState(false);
  const [editingAim, setEditingAim] = useState(null);

  const fetchAims = async () => {
    const querySnapshot = await getDocs(collection(db, 'goals'));
    const goalsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAims(goalsData);
  };

  useEffect(() => {
    fetchAims();
  }, []);

  const handleComplete = async id => {
    const aimRef = doc(db, 'goals', id);
    const aim = aims.find(goal => goal.id === id);
    await updateDoc(aimRef, { completed: !aim.completed });
    fetchAims();
  };

  const handleDelete = async id => {
    await deleteDoc(doc(db, 'goals', id));
    fetchAims();
  };

  const handleEditStart = aim => {
    setEditingAim(aim);
    setAddingAim(true);
  };

  const handleCancel = () => {
    setAddingAim(false);
    setEditingAim(null);
    fetchAims();
  };

  return (
    <div>
      <h1>Мої цілі</h1>
      {!addingAim && (
        <button onClick={() => setAddingAim(true)}>Додати ціль</button>
      )}
      {addingAim && <AddAim onCancel={handleCancel} />}
      <AimList
        aims={aims}
        handleComplete={handleComplete}
        handleDelete={handleDelete}
        handleEditStart={handleEditStart}
      />
    </div>
  );
};

export default Home;
