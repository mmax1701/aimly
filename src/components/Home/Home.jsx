import React, { useState } from 'react';
import aim from '../../aim.json';
import AimList from '../AimList/AimList';

const Home = () => {
  const [aims, setAims] = useState(aim);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div>
        <div>x</div>
        <p>Привіт, name</p>
      </div>

      {aims && aims.length > 0 && (
        <div>
          <div>Заплановані цілі</div>
          <AimList aims={aims} />
          <div>Виконані цілі</div>
        </div>
      )}
    </div>
  );
};

export default Home;
