import React from 'react';

const AddAim = () => {
  return (
    <div>
      <h1>Додати ціль</h1>
      <form>
        <div>
          <label htmlFor="title">Назва цілі:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="description">Опис:</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        <div>
          <label htmlFor="photo">Фото:</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
        </div>
        <button type="submit">Додати ціль</button>
      </form>
      <div>
        <button type="button">Скасувати</button>
      </div>
    </div>
  );
};

export default AddAim;
