import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: '20px',
  marginLeft: '20px',
});

const StyledButton = styled(Button)({
    backgroundColor: '#6565F9',
    color: 'white',
    padding: '10px 20px',
    fontSize: '26px',
    border: 'none',
    borderRadius: '5px',
    textTransform: 'none',
    cursor: 'pointer',
    '&.createCardbtn': {
        marginTop: '10px',
    },
    '&:hover': {
        backgroundColor: '#FCC01A',
    },
});

const ButtonGroup = ({ openDialog, createCustomCard, generatePDF }) => {
  return (
    <ButtonContainer>
      <StyledButton variant="contained" onClick={openDialog} className="button">
        Choose
      </StyledButton>
      <StyledButton variant="contained" onClick={createCustomCard} className="createCardbtn">
        Create own card
      </StyledButton>
      <StyledButton variant="contained" onClick={generatePDF} className="createCardbtn">
        Download card
      </StyledButton>
    </ButtonContainer>
  );
};

export default ButtonGroup;