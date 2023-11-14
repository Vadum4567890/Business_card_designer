import React from 'react';

const DraggableElement = ({ src, onDragStart, resizable }) => {
    return (
      <img
        draggable
        src={src}
        alt="Draggable Element"
        style={{
          width: '50px',
          height: '50px',
          margin: '10px',
          cursor: 'move',
          resize: resizable ? 'both' : 'none', // Add 'resize' property if resizable is true
          overflow: 'hidden',
          border: '2px solid transparent', // Додали бордер
          borderRadius: '50%', // Додали радіус для круглого бордеру
          transition: 'border-color 0.2s',
        }}
        onMouseOver={(event) => {
            event.target.style.borderColor = '#1A1A36';
          }}
          // При виході курсору з елемента повертаємо бордер до transparent
          onMouseOut={(event) => {
            event.target.style.borderColor = 'transparent';
          }}
        onDragStart={(event) => onDragStart(event, src)}
      />
    );
  };
  export default DraggableElement;