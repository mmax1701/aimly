import React, { useState } from 'react';
import { storage, db, auth } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';

const AddAim = ({ onCancel }) => {
  const [goalText, setGoalText] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 👇 Компрессия изображения
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = event => {
      img.src = event.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 800;
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        blob => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          setImage(compressedFile);
        },
        'image/jpeg',
        0.7
      );
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!goalText) return;

    setIsUploading(true);
    let uploadedURL = '';

    try {
      if (image) {
        const storageRef = ref(storage, `images/${image.name}-${nanoid(6)}`);
        await uploadBytes(storageRef, image);
        uploadedURL = await getDownloadURL(storageRef);
      }

      const user = auth.currentUser;

      const newGoal = {
        title: goalText,
        description,
        imageURL: uploadedURL || '',
        completed: false,
        createdAt: serverTimestamp(),
        uid: user?.uid || null,
      };

      await addDoc(collection(db, 'goals'), newGoal);
    } catch (error) {
      console.error('Ошибка при сохранении цели:', error);
      alert('Не удалось сохранить цель.');
    } finally {
      setIsUploading(false);
      setGoalText('');
      setDescription('');
      setImage(null);
      onCancel(); // закрываем модалку
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

        <div>
          <label>
            Фото (опціонально):
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        {image && <p>Фото для завантаження: {image.name}</p>}

        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Завантаження...' : 'Зберегти'}
        </button>
        <button type="button" onClick={onCancel}>
          Скасувати
        </button>
      </form>
    </div>
  );
};

export default AddAim;
