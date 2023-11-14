import React from 'react';

const PositionInput = ({ position, onPositionChange }) => {
  const handlePositionInputChange = (event) => {
    const newPosition = event.target.value;
    onPositionChange(newPosition);
  };

  return (
    <input
      type="text"
      value={position}
      onChange={handlePositionInputChange}
      placeholder='Your position'
      // Додайте інші стилі, якщо потрібно
    />
  );
};

export default PositionInput;