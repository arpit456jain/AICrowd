import React from 'react';
import './NewTask.css'; // Import the CSS file

const NewTask = ({ onYes, onNo }) => {
  return (
    <div className="new-task-container">
      <p>New Task?</p>
      <div className="button-container">
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
      </div>
    </div>
  );
};

export default NewTask;
