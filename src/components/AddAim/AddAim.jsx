import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddAim = ({ onCancel }) => {
  const [goalText, setGoalText] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!goalText) return;

    setIsSaving(true);

    try {
      const user = auth.currentUser;

      const newGoal = {
        title: goalText,
        description,
        completed: false,
        createdAt: serverTimestamp(),
        userId: user?.uid || null,
      };

      await addDoc(collection(db, 'goals'), newGoal);
    } catch (error) {
      console.error('Ошибка при сохранении цели:', error);
      alert('Не удалось сохранить ціль.');
    } finally {
      setIsSaving(false);
      setGoalText('');
      setDescription('');
      onCancel();
    }
  };

  return (
    <div>
      <h2>Додати нову ціль</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Назва цілі:
            <input
              type="text"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Опис:
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="3"
            />
          </label>
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Збереження...' : 'Зберегти'}
        </button>
        <button type="button" onClick={onCancel}>
          Скасувати
        </button>
      </form>
    </div>
  );
};

export default AddAim;
