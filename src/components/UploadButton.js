import React, { useState, useRef} from 'react';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Slider } from '@mui/material';
import 'react-image-crop/dist/ReactCrop.css';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';



const CropContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& .ReactCrop__image': {
    maxWidth: '100%',
    maxHeight: '70vh', 
  },
});

const UploadButton = ({ photoURL, setOpenCrop, setPhotoURL, setFile, setDroppedElements }) => {
  const [open, setOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef(null);
  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleOpenFileWindow = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setPhotoURL(null); 
    setFile(null); 
    setCrop({ x: 0, y: 0 });
    setZoom(1); 
    setRotation(0); 
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPhotoURL(URL.createObjectURL(file));
      setOpen(true);
    }
  };

  const cropImage = async () => {
    const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation);
    const croppedPhoto = {
        id: 'croppedPhoto',
        src: url,
        x: 0, // Set initial x position
        y: 0, // Set initial y position
        scale: 1, // Set initial scale
      };
      setDroppedElements((prevDroppedElements) => [...prevDroppedElements, croppedPhoto]);
    
    setPhotoURL(url);
    setFile(file);
    setOpen(false);
  };

  return (
    <>
      <Button style={{textTransform:'none'}} variant="contained" onClick={handleOpen}>
        Загрузить фото
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Выберите и обрежьте фото</DialogTitle>
        <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 },
        }}>
          <CropContainer>
            {photoURL && (
              <Cropper
                image={photoURL}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropChange={setCrop}
                onCropComplete={cropComplete}
              />
            )}
            
          </CropContainer>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotation + '°'}</Typography>
            <Slider
              valueLabelDisplay="auto"
              value={rotation}
              min={0}
              max={360}
              onChange={(e, rotation) => setRotation(rotation)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button variant="contained" onClick={handleOpenFileWindow}>
            Выбрать
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Отменить
          </Button>
          <Button variant="contained" onClick={cropImage}>
            Обрезать
          </Button>
        </Box>
      </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadButton;

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`;
};
