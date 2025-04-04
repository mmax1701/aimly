import React, { useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddAim = ({ onSave, onCancel }) => {
  const [newAim, setNewAim] = useState({
    title: '',
    description: '',
    photo: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setNewAim(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setNewAim(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!newAim.title.trim() || !newAim.description.trim()) return;

    setUploading(true);

    let photoURL = '';

    if (newAim.photo) {
      const storageRef = ref(storage, `aims/${newAim.photo.name}`);
      await uploadBytes(storageRef, newAim.photo);
      photoURL = await getDownloadURL(storageRef);
    }

    const aimData = {
      title: newAim.title,
      description: newAim.description,
      photo: photoURL,
    };

    onSave(aimData);
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Нова ціль</h2>
      <input
        type="text"
        name="title"
        placeholder="Назва цілі"
        value={newAim.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Опис цілі"
        value={newAim.description}
        onChange={handleChange}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {newAim.photo && (
        <div>
          <p>Завантажено: {newAim.photo.name}</p>
          <img
            src={URL.createObjectURL(newAim.photo)}
            alt="Preview"
            width="100"
          />
        </div>
      )}

      <button type="submit" disabled={uploading}>
        {uploading ? 'Завантаження...' : 'Додати'}
      </button>
      <button type="button" onClick={onCancel}>
        Скасувати
      </button>
    </form>
  );
};

export default AddAim;
