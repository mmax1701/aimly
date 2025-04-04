import React, { useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddAim = ({ onSave, onCancel }) => {
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleFileChange = e => setImage(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();

    let imageURL = '';
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      imageURL = await getDownloadURL(storageRef);
    }

    const newAim = {
      title: goal,
      description,
      imageURL,
      completed: false,
    };

    onSave(newAim);
    setGoal('');
    setDescription('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Нова ціль</h2>
      <input
        type="text"
        placeholder="Назва"
        value={goal}
        onChange={e => setGoal(e.target.value)}
        required
      />
      <textarea
        placeholder="Опис"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Зберегти</button>
      <button type="button" onClick={onCancel}>
        Скасувати
      </button>
    </form>
  );
};

export default AddAim;
