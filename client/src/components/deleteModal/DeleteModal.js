import React from "react";
import './DeleteModal.scss'

function DeleteModal({ message, onClose}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
