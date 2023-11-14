import React from 'react';
import { styled } from '@mui/material/styles';

const TemplatesContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
});

const Template = styled('div')({
  width: '400px',
  height: '255px',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  margin: '10px',
  '&:hover': {
    border: '3px solid black',
  },
  overflow: 'hidden', 
});

const TemplateImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover', 
});

const TemplateSelector = ({ selectTemplate }) => {
  return (
    <TemplatesContainer>
      <Template onClick={() => selectTemplate('img/preview2.svg')}>
        <TemplateImage src="img/preview2.svg" alt="Template 1" />
      </Template>
      <Template onClick={() => selectTemplate('img/preview3.svg')}>
        <TemplateImage src="img/preview3.svg" alt="Template 2" />
      </Template>
      <Template onClick={() => selectTemplate('img/preview4.svg')}>
        <TemplateImage src="img/preview4.svg" alt="Template 3" />
      </Template>
      <Template onClick={() => selectTemplate('img/preview5.svg')}>
        <TemplateImage src="img/preview5.svg" alt="Template 4" />
      </Template>
    </TemplatesContainer>
  );
};

export default TemplateSelector;