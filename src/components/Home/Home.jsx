import React, { useState } from 'react';
import Modal from 'react-modal';

import aim from '../../aim.json';
import AimList from '../AimList/AimList';
import EditAimForm from '../EditAimForm/EditAimForm';
import AddAim from '../AddAim/AddAim';
import { nanoid } from 'nanoid';

Modal.setAppElement('#root');

const Home = () => {
  const [aims, setAims] = useState(aim);
  const [editingAim, setEditingAim] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setAims(prevAims => [aimWithId, ...prevAims]);
    setIsAddModalOpen(false);
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

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div>
        <p>Привіт, name</p>
      </div>
      <div>
        <button type="button" onClick={handleAddModalOpen}>
          Додати ціль
        </button>
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
          <p>Наразі список з цілями порожній</p>
        </div>
      )}

      {/* Модальное окно редактирования */}
      <Modal isOpen={!!editingAim} onRequestClose={handleEditCancel}>
        {editingAim && (
          <EditAimForm
            aim={editingAim}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
      </Modal>

      {/* Модальное окно добавления */}
      <Modal isOpen={isAddModalOpen} onRequestClose={handleAddModalClose}>
        <AddAim onSave={handleAddAim} onCancel={handleAddModalClose} />
      </Modal>
    </div>
  );
};

export default Home;
