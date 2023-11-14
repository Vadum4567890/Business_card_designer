import React, { useState } from 'react';
import ColorPalette from './ColorPalette';
import DraggableElement from './DraggableElement';
import { Button } from '@mui/material';
import UploadButton from './UploadButton';


const LeftPanel = ({ 
     handleDragStart,
     handleColorChange, 
     undo, 
     addedElementsHistory, 
     setDroppedElements,
     showNameInput,
     showPositionInput,
     cardContainerRef }) => {

    const [, setFile] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [, setOpenCrop] = useState(false);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        setPhotoURL(fileReader.result);
    };

    const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFile(file);
        setPhotoURL(URL.createObjectURL(file));
        setOpenCrop(true);
    }
    };
  return (
    <div>
      <DraggableElement src="img/1.svg" onDragStart={handleDragStart} />
      <DraggableElement src="img/2.svg" onDragStart={handleDragStart} />
      <DraggableElement src="img/3.svg" onDragStart={handleDragStart} />
      <DraggableElement src="img/4.svg" onDragStart={handleDragStart} />
      <DraggableElement src="img/5.svg" onDragStart={handleDragStart} />
      <ColorPalette handleColorChange={handleColorChange} />
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px'}} >
        <Button style={{textTransform:'none'}} variant="outlined" onClick={undo} disabled={addedElementsHistory.length === 0}>
            Назад
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px'}}>
        <UploadButton  accept="image/*"
            id="profilePhoto"
            type="file"
            style={{ display: 'none' }}
            onChange={handleChange} {...{ photoURL, setOpenCrop, setPhotoURL, setFile }}
            setDroppedElements={setDroppedElements}
        /> 
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px'}} >
        <Button style={{textTransform:'none'}} onClick={() => showNameInput(cardContainerRef.current.offsetWidth / 2, cardContainerRef.current.offsetHeight / 2)}>Добавить имя</Button>
        <Button style={{textTransform:'none'}} onClick={() => showPositionInput(cardContainerRef.current.offsetWidth / 2, cardContainerRef.current.offsetHeight / 2)}>Добавить должность</Button>
      </div>
      
    </div>
  );
};

export default LeftPanel;