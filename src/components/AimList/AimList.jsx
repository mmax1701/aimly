import React from 'react';

const AimList = ({ aims }) => {
  return (
    <div>
      <ul>
        {aims.map(aim => (
          <li key={aim.id}>
            <div>{aim.title}</div>
            <div>{aim.description}</div>
            <div>{aim.photo}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AimList;
