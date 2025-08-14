import React from 'react';
import "../css/ExcluirConta.css"

const ExcluirConta = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>Tem certeza que quer fazer isso?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn btn-danger">Sim</button>
          <button onClick={onCancel} className="btn btn-secondary">Não</button>
        </div>
      </div>
    </div>
  );
};

export default ExcluirConta;
