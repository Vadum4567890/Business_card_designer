import React, { useState, useRef } from 'react';
import ModalComponent from './components/ModalComponent';
import TemplateSelector from './components/TemplateSelector';
import ButtonGroup from './components/ButtonGroup';
import { styled } from '@mui/material/styles';
import LeftPanel from './components/LeftPanel';
import CardComponent from './components/CardComponent';
import html2canvas from 'html2canvas';
import NameInput from './components/Input/NameInput';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  backgroundColor: 'rgb(247, 245, 245)',
});

const AreaContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'row',
  height: '100vh',
  backgroundColor: 'rgb(247, 245, 245)',
  paddingRight: '20px',
});




const App = () => {
  const [isCustomCard, setIsCustomCard] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [rounded, setRounded] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(false);
  const [droppedElements, setDroppedElements] = useState([]);
  const [cardBackgroundColor, setCardBackgroundColor] = useState('rgb(247, 245, 245)');
  const [, setDraggingElement] = useState(null);
  const [addedElements,] = useState([]);
  const [addedElementsHistory, setAddedElementsHistory] = useState([]);
  const [nameInput, setNameInput] = useState({ visible: false, x: 0, y: 0, value: '' });
  const [positionInput, setPositionInput] = useState({
    x: 0,
    y: 0,
    visible: false,
    isDragging: false,
  });
  const nameInputContainerRef = useRef(null);
  const positionInputContainerRef = useRef(null);
  
  
  const cardContainerRef = useRef(null);

  const handleColorChange = (color) => {
    setCardBackgroundColor(color);
  };

  const showPositionInput = (x, y) => {
    setPositionInput((prevState) => ({
      ...prevState,
      x: x,
      y: y,
      visible: true,
    }));
  };

  const showNameInput = (x, y) => {
    setNameInput({ visible: true, x, y, value: '' });
  };

  const handleNameInputChange = (event) => {
    setName(event.target.value);
  };

  const handlePositionInputChange = (event) => {
    setPosition(event.target.value);
  };


  const addToHistory = (element) => {
    setAddedElementsHistory((prevHistory) => [...prevHistory, element]);
    setDroppedElements((prevDroppedElements) => [...prevDroppedElements, element]);
  };
  
  const [cardElements, setCardElements] = useState({
    logo: { x: 0, y: 0, scale: 1 },
    qrCode: { x: 0, y: 0, scale: 1 }
  });

  const handleElementDrag = (event, element) => {
    event.preventDefault();
    setDraggingElement(element);
  
    if (!cardElements[element]) return;
  
    const { x, y, scale } = cardElements[element];
    const { clientX, clientY } = event;
  
    setCardElements((prevElements) => ({
      ...prevElements,
      [element]: {
        ...prevElements[element],
        isDragging: true,
        prevX: x,
        prevY: y,
        prevScale: scale,
        clientX,
        clientY,
      },
    }));
  
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  
    function handleDragMove(e) {
      const dx = e.clientX - clientX;
      const dy = e.clientY - clientY;
  
      setCardElements((prevElements) => ({
        ...prevElements,
        [element]: {
          ...prevElements[element],
          x: x + dx,
          y: y + dy,
          clientX: e.clientX,
          clientY: e.clientY,
        },
      }));
    }
  
    function handleDragEnd() {
      setCardElements((prevElements) => ({
        ...prevElements,
        [element]: {
          ...prevElements[element],
          isDragging: false,
        },
      }));
  
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    }
  };
  
  
  const handleElementWheel = (event, element) => {
    event.preventDefault();
    event.stopPropagation();
  
    const { deltaY } = event;
    const scaleChange = deltaY > 0 ? -0.1 : 0.1;
  
    setCardElements((prevElements) => {
      const newScale = prevElements[element].scale + scaleChange;
      const minScale = 0.1; // Мінімальний розмір масштабу
      const maxScale = 2; // Максимальний розмір масштабу
  
      const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);
  
      return {
        ...prevElements,
        [element]: {
          ...prevElements[element],
          scale: clampedScale,
        },
      };
    });
  };

  const selectTemplate = (templateSrc) => {
    setSelectedCard(templateSrc);
    setIsCustomCard(false);
    setCardElements({
      logo: { x: 0, y: 0, scale: 1 },
      qrCode: { x: 0, y: 0, scale: 1 },
    });
    setIsLogoVisible(false);
    setIsLeftPanelVisible(false);
    setDroppedElements([]);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const saveCard = (event) => {
    event.preventDefault();
    closeDialog();
  };

  const createCustomCard = () => {
    setSelectedCard(null);
    setIsCustomCard(true);
    setIsLogoVisible(true);
    setIsLeftPanelVisible(true); 
    setDroppedElements(addedElements);
  };

  const handleDragStart = (event, src) => {
    if (src === 'button') {
      event.dataTransfer.setData('button', 'button'); // Set data type 'button' for the button
    }
    else if (src === 'input') {
      event.dataTransfer.setData('input', 'input')
    }
    else {
      event.dataTransfer.setData('text/plain', src);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const isButtonFromLeftPanel = event.dataTransfer.types.includes('button');
    if (isButtonFromLeftPanel) return;

    const isInputFromLeftPanel = event.dataTransfer.types.includes('button');
    if (isInputFromLeftPanel) return;

    const data = event.dataTransfer.getData('text/plain');
    if (!data) return;
  
    // Check if any element is being dragged
    const isAnyElementDragging = Object.values(cardElements).some((element) => element.isDragging);
    if (isAnyElementDragging) return;
  
    const cardRect = cardContainerRef.current.getBoundingClientRect();
  
    // Calculate the dropped element's position relative to the card container
    const droppedElementX = event.pageX - cardRect.left;
    const droppedElementY = event.pageY - cardRect.top;
    // Get the id of the dropped element from the data transfer
    const id = parseInt(data, 10);
  
    // Check if the element already exists in droppedElements
    const existingElement = droppedElements.find((element) => element.id === id);
  
    if (existingElement) {
      // If the element exists, update its position
      const updatedElements = droppedElements.map((element) =>
        element.id === id ? { ...element, x: droppedElementX, y: droppedElementY } : element
      );
  
      setDroppedElements(updatedElements);
    } else {
      // If the element doesn't exist, create a new dropped element object
      const newDroppedElement = {
        id,
        src: data,
        x: droppedElementX,
        y: droppedElementY,
        scale: 1,
      };
  
      // Add the new element to both the droppedElements and addedElementsHistory arrays
      addToHistory(newDroppedElement);
  
      setDroppedElements((prevDroppedElements) => [...prevDroppedElements, newDroppedElement]);
    }
  
    // Reset the isDragging property of the card elements
    const updatedCardElements = Object.fromEntries(
      Object.keys(cardElements).map((element) => [element, { ...cardElements[element], isDragging: false }])
    );
    setCardElements(updatedCardElements);
  };


  const undo = () => {
    if (addedElementsHistory.length === 0) return; 
    const lastAddedElement = addedElementsHistory[addedElementsHistory.length - 1]; 
    setAddedElementsHistory((prevHistory) => prevHistory.slice(0, -1)); 
    setDroppedElements((prevDroppedElements) =>
      prevDroppedElements.filter((element) => element.id !== lastAddedElement.id)
    );
  };


  
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      setRounded(checked);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'position') {
      setPosition(value);
    }
  };



  const generatePDF = () => {
    const cardComponentNode = cardContainerRef.current;
    const width = cardComponentNode.offsetWidth;
    const height = cardComponentNode.offsetHeight;
    html2canvas(cardComponentNode, { width, height }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imgData;
      downloadLink.download = 'card.png';
      downloadLink.click();
    });
  };

  return (
    <Container>
      <TemplateSelector selectTemplate={selectTemplate}/>
      <AreaContainer>
        {isLeftPanelVisible && <LeftPanel setDroppedElements={setDroppedElements} 
                                          handleDragStart={handleDragStart}
                                          handleColorChange={handleColorChange} 
                                          undo={undo} 
                                          addedElementsHistory={addedElementsHistory}  
                                          cardContainerRef={cardContainerRef} 
                                          showPositionInput={showPositionInput} 
                                          showNameInput={showNameInput}/> }
        <div ref={cardContainerRef}>
        <CardComponent
          cardContainerRef={cardContainerRef}
          selectedCard={selectedCard}
          isCustomCard={isCustomCard}
          cardBackgroundColor={cardBackgroundColor}
          isLogoVisible={isLogoVisible}
          cardElements={cardElements}
          droppedElements={droppedElements} 
          handleDrop={handleDrop} 
          handleElementDrag={handleElementDrag} 
          handleElementWheel={handleElementWheel}
          setDroppedElements={setDroppedElements}
          addedElementsHistory={addedElementsHistory}
          setAddedElementsHistory={setAddedElementsHistory}
          setCardElements={setCardElements}
          setNameInput={setNameInput}
          setPositionInput={setPositionInput}
          nameInput={nameInput}
          positionInput={positionInput}
          showNameInput={showNameInput} 
          showPositionInput={showPositionInput}
        />
         </div>
          {/* {nameInput.visible &&
        ReactDOM.createPortal(
          <div ref={nameInputContainerRef}>
            <NameInput value={name} onChange={handleNameInputChange} />
          </div>,
          document.body
        )}

      {positionInput.visible &&
        ReactDOM.createPortal(
          <div ref={positionInputContainerRef}>
            <PositionInput value={position} onChange={handlePositionInputChange} />
          </div>,
          document.body
        )} */}
        <ButtonGroup openDialog={openDialog} createCustomCard={createCustomCard} generatePDF={generatePDF} />
      </AreaContainer>
      <ModalComponent
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        name={name}
        position={position}
        rounded={rounded}
        handleInputChange={handleInputChange}
        saveCard={saveCard}
      />
    </Container>
  );
};

export default App;
