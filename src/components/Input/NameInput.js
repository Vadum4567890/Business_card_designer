import React from 'react';

const NameInput = ({ name, onNameChange, hideNameInput, inputFocused, nameInput, setInputFocused}) => {
  const handleNameInputChange = (event) => {
    const newName = event.target.value;
    onNameChange(newName);
  };

  return (
    <input
        type="text"
        value={name}
        onChange={handleNameInputChange}
        placeholder='Your name'
        onBlur={hideNameInput}
        onFocus={() => setInputFocused(true)}
        autoFocus={inputFocused === true}
        style={{
            position: 'absolute',
          //  top: `${nameInput.y}px`,
            //left: `${nameInput.x}px`,
            marginBottom: '300px',
            width: '150px',
            zIndex: 10,
            cursor: nameInput.isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={(event) => event.stopPropagation()}
    />
  );
};

export default NameInput;