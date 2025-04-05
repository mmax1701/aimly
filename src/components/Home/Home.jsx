import React, { useState } from 'react';
import Modal from 'react-modal';

import aim from '../../aim.json';
import AimList from '../AimList/AimList';
import EditAimForm from '../EditAimForm/EditAimForm'; // Импортируем форму
import { nanoid } from 'nanoid';
import AddAim from '../AddAim/AddAim';

const Home = () => {
  const [aims, setAims] = useState(aim);
  const [editingAim, setEditingAim] = useState(null);

  const handleComplete = aimId => {
    setAims(prevAims =>
      prevAims.map(aim =>
        aim.id === aimId ? { ...aim, completed: true } : aim
      )
    );
  };

  const handleDelete = aimId => {
    setAims(prevAims => prevAims.filter(aim => aim.id !== aimId));
  };

  const handleAddAim = newAim => {
    const aimWithId = { ...newAim, id: nanoid() };
    setAims(prevAims => [...prevAims, aimWithId]);
  };

  const handleEditStart = aimId => {
    const aimToEdit = aims.find(aim => aim.id === aimId);
    if (aimToEdit) {
      setEditingAim(aimToEdit);
    }
  };

  const handleEditCancel = () => {
    setEditingAim(null);
  };

  const handleEditSave = updatedAim => {
    setAims(prevAims =>
      prevAims.map(aim => (aim.id === updatedAim.id ? updatedAim : aim))
    );
    setEditingAim(null);
  };

  return (
    <div>
      <div>
        <div>x</div>
        <p>Привіт, name</p>
      </div>

      {aims.length > 0 ? (
        <div>
          {aims.some(aim => !aim.completed) && (
            <>
              <div>Заплановані цілі</div>
              <AimList
                aims={aims.filter(aim => !aim.completed)}
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                handleEditStart={handleEditStart}
              />
            </>
          )}

          {aims.some(aim => aim.completed) && (
            <>
              <div>Виконані цілі</div>
              <AimList
                aims={aims.filter(aim => aim.completed)}
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                handleEditStart={handleEditStart}
              />
            </>
          )}
        </div>
      ) : (
        <div>
          <div>Додай свою ціль</div>
          <AddAim onAddAim={handleAddAim} />
        </div>
      )}

      <Modal isOpen={!!editingAim} onRequestClose={handleEditCancel}>
        {editingAim && (
          <EditAimForm
            aim={editingAim}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;
