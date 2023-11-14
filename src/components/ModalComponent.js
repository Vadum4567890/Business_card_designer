import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

const Modal = styled(Dialog)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ModalContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px',
  borderRadius: '10px',
  backgroundColor: '#fefefe',
});

const ModalTitle = styled(DialogTitle)({
  textAlign: 'center',
});

const CloseButton = styled(Button)({
  position: 'absolute',
  top: '10px',
  right: '10px',
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontWeight: 500,
  fontFamily: 'Arial, Helvetica, sans-serif',
});

const ModalLabel = styled('label')({
  marginBottom: '10px',
  color: '#161736',
  fontSize: 'x-large',
});

const SaveButton = styled(Button)({
  backgroundColor: '#6565F9',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#FCC01A',
  },
});

const ModalComponent = ({ isDialogOpen, closeDialog, name, position, rounded, handleInputChange, saveCard }) => {
  return (
    <Modal open={isDialogOpen} onClose={closeDialog}>
      <ModalContent>
        <ModalTitle>
          <CloseButton variant="contained" onClick={closeDialog}>
            &times;
          </CloseButton>
        </ModalTitle>
        <Form onSubmit={saveCard}>
          <ModalLabel htmlFor="name">
            Your <span>Name</span>
          </ModalLabel>
          <TextField
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name"
            value={name}
            onChange={handleInputChange}
          />
          <br />
          <ModalLabel htmlFor="position">Position</ModalLabel>
          <TextField
            type="text"
            id="position"
            name="position"
            placeholder="Manager"
            value={position}
            onChange={handleInputChange}
          />
          <br />
          <ModalLabel htmlFor="rounded">Bordered card?</ModalLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={rounded} onChange={handleInputChange} name="rounded" />}
              label="Yes"
            />
          </FormGroup>
          <br />
          <SaveButton type="submit" variant="contained">
            Сохранить
          </SaveButton>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;