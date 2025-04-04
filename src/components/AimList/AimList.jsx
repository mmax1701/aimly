import React from 'react';

const AimList = ({ aims, handleComplete, handleDelete, handleEditStart }) => (
  <ul>
    {aims.map(aim => (
      <li key={aim.id}>
        <h4>{aim.title}</h4>
        <p>{aim.description}</p>
        {aim.imageURL && (
          <img src={aim.imageURL} alt="Фото" style={{ maxWidth: '200px' }} />
        )}
        <div>
          <button onClick={() => handleComplete(aim.id)}>
            {aim.completed ? 'Зробити незавершеною' : 'Завершити'}
          </button>
          <button onClick={() => handleEditStart(aim.id)}>Редагувати</button>
          <button onClick={() => handleDelete(aim.id)}>Видалити</button>
        </div>
      </li>
    ))}
  </ul>
);

export default AimList;
