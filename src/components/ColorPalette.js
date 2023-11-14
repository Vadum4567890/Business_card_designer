import React, { useState } from 'react';
import { Button, Dialog, DialogContent } from '@mui/material';
import { SketchPicker } from 'react-color';

const ColorPalette = ({ handleColorChange }) => {
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('rgb(247, 245, 245)');

  const handleButtonClick = () => {
    setColorPickerOpen(true);
  };

  const handleColorPickerClose = () => {
    setColorPickerOpen(false);
  };

  const handleColorChangeComplete = (color) => {
    setSelectedColor(color.rgb);
    handleColorChange(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px'}}>
      <Button style={{textTransform:'none'}} variant="outlined" onClick={handleButtonClick}>
        Выбрать цвет
      </Button>
      <Dialog open={isColorPickerOpen} onClose={handleColorPickerClose}>
        <DialogContent>
          <SketchPicker color={selectedColor} onChangeComplete={handleColorChangeComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColorPalette;