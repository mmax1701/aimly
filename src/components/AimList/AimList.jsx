import React from 'react';

const AimList = ({ aims, handleComplete, handleDelete, handleEditStart }) => (
  <ul>
    {aims.map(aim => (
      <li key={aim.id}>
        <h4>{aim.title}</h4>
        <p>{aim.description}</p>
        <div>
          <button onClick={() => handleComplete(aim.id)}>
            {aim.completed ? 'Зробити незавершеною' : 'Завершити'}
          </button>
          <button onClick={() => handleEditStart(aim)}>Редагувати</button>
          <button onClick={() => handleDelete(aim.id)}>Видалити</button>
        </div>
      </li>
    ))}
  </ul>
);

export default AimList;
