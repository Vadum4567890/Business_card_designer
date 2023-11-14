import React, { useState } from "react";

import { styled } from '@mui/material/styles';

export const FileUploaderContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
});

export const UploadButton = styled('label')({
  cursor: 'pointer',
  backgroundColor: 'yellow',
  border: '1px solid black',
  borderRadius: '12px',
  padding: '20px',
  '&:hover': {
    backgroundColor: 'lightyellow',
  },
});

export const UploadInput = styled('input')({
  opacity: 0,
  position: 'absolute',
  zIndex: -1,
});

export const FilePreview = styled('img')({
  width: '200px',
  height: '200px',
  border: '1px dashed gray',
  '& .ReactCrop__image': {
    maxWidth: '100%',
    maxHeight: '70vh', 
  },
});


export const FileUploader = () => {
  const [imageURL, setImageURL] = useState();
  const fileReader = new FileReader();
  fileReader.onloadend = () => {
    setImageURL(fileReader.result);
  };
  const handleOnChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      fileReader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length) {
      fileReader.readAsDataURL(event.dataTransfer.files[0]);
    }
  };

  const handleDragEmpty = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <FileUploaderContainer className="file-uploader">
      <UploadButton htmlFor="file-loader-button" className="file-uploader__custom-button">
        Завантажити файл
      </UploadButton>
      <UploadInput
        id="file-loader-button"
        type="file"
        className="file-uploader__upload-button"
        onChange={handleOnChange}
      />
      <FilePreview
        src={imageURL ? imageURL : "no_photo.jpg"}
        alt="preview"
        onDrop={handleDrop}
        onDragEnter={handleDragEmpty}
        onDragOver={handleDragEmpty}
      />
      <div className="file-uploader__file-name">{imageURL ? imageURL.name : ""}</div>
    </FileUploaderContainer>
  );
};