import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line no-unused-vars
const CardContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: '500px',
  height: '320px'
});


const QRCode = styled('img')({
    pointerEvents: 'auto',
    maxWidth: '100px',
    maxHeight: '100px',
    borderRadius: '5px',
  });
  
const Card = styled('div')({
    position: 'relative',
    width: '500px',
    
    height: '320px',

    overflow: 'hidden',
    '&:hover': {
      borderColor: 'black',
    },
    border: '1px solid black',
    '& .logo, & .qr-code': {
      position: 'absolute',
      cursor: 'move',
    },
    '& .dropped-element': {
      position: 'absolute',
      cursor: 'move',
      width: '50px',
      height: '50px',
    },
  });
  
  
  const Logo = styled('img')({
    display: 'block', // Замініть 'none' на 'block'
    pointerEvents: 'auto',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    top: '10px',
    left: '10px',
    width: '200px',
    height: 'auto',
   
  });


const CardComponent = ({
    selectedCard,
    isCustomCard,
    cardBackgroundColor, 
    isLogoVisible, 
    cardElements, 
    droppedElements, 
    setDroppedElements, 
    handleDrop, 
    handleElementDrag, 
    handleElementWheel, 
    cardContainerRef, 
    addedElementsHistory, 
    setCardElements,
    setPositionInput,
    setNameInput,
    nameInput,
    positionInput,
    }) => {

const [name, setName] = useState('');
const [position, setPosition] = useState('');
const [inputFocused, setInputFocused] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
const [inactiveInputPosition, setInactiveInputPosition] = useState({ x: 0, y: 0 });
const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
const [isTextDragging, setIsTextDragging] = useState(false);
const [, setMousePosition] = useState({ x: 0, y: 0 });
const [fontSize, setFontSize] = useState(12);
const [, setPositionInputRef] = useState(null);


    const handleNameInputChange = (event) => {
        const newName = event.target.value;
        setName(newName);
        setNameInput((prevState) => ({ ...prevState, value: newName }));
    };
    const handlePositionInputChange = (event) => {
        setPosition(event.target.value);
    };
    const hideNameInput = () => {
        setNameInput((prevState) => ({ ...prevState, visible: false }));
    };
    const hidePositionInput = useCallback(() => {
        setPositionInput((prevState) => ({ ...prevState, visible: false }));
    }, []);
    const handleDoubleClick = () => {
        setIsEditing(true);
    };

  const handleBlur = () => {
    setIsEditing(false);
    setNameInput((prevState) => ({ ...prevState, value: name }));
    setPositionInput((prevState) => ({ ...prevState, value: position }));
  };


    const handleCardClick = (event) => {
        const containerRect = cardContainerRef.current.getBoundingClientRect();
        const x = event.clientX - containerRect.left;
        const y = event.clientY - containerRect.top;
        setMousePosition({ x, y });
    }

    const handleDocumentClick = (event) => {
        const nameInputElement = document.getElementById('nameInput');
        if (nameInputElement && !nameInputElement.contains(event.target)) {
        hideNameInput();
        }

        const inputElement = document.getElementById('positionInput');
        if (inputElement && !inputElement.contains(event.target)) {
            hidePositionInput();
        }
    };


  const handleTextMouseDown = (event) => {
    event.stopPropagation();
    setIsTextDragging(true);
    const containerRect = cardContainerRef.current.getBoundingClientRect();
    const x = event.clientX - containerRect.left - textPosition.x;
    const y = event.clientY - containerRect.top - textPosition.y;
    setCursorOffset({ x, y });
  };

  const handleTextMouseMove = (event) => {
    event.stopPropagation();
    if (isTextDragging) {
      const containerRect = cardContainerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left - cursorOffset.x;
      const y = event.clientY - containerRect.top - cursorOffset.y;
      setTextPosition({ x, y });
    }
  };

  const handleTextWheel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { deltaY } = event;
    const fontSizeChange = deltaY > 0 ? -2 : 2; 
    const newFontSize = Math.max(fontSize + fontSizeChange, 10); 
    setFontSize(newFontSize);
  };



    useEffect(() => {
        // Застосовуємо обробник події на рівні документа
        document.addEventListener('click', handleDocumentClick);

        // При демонтажі компонента видаляємо обробник події
        return () => {
        document.removeEventListener('click', handleDocumentClick);
        };
    }, [hideNameInput, hidePositionInput]);


    useEffect(() => {
    setDroppedElements(addedElementsHistory);
    }, [addedElementsHistory, setDroppedElements]);

      
    const handleDroppedElementWheel = (event, elementToUpdate) => {
        event.preventDefault();
        event.stopPropagation();
      
        const { deltaY } = event;
        const scaleChange = deltaY > 0 ? -0.1 : 0.1; // Зміна знаку для зміни напрямку зменшення/збільшення масштабу
      
        setDroppedElements((prevDroppedElements) => {
          // Оновлюємо тільки той елемент, який має бути оновлений
          const updatedElements = prevDroppedElements.map((element) => {
            if (element === elementToUpdate) {
              const newScale = element.scale + scaleChange;
              const minScale = 0.1; // Мінімальний масштаб
              const maxScale = 2; // Максимальний масштаб
      
              // Обмеження масштабу в межах встановлених значень
              const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);
      
              return {
                ...element,
                scale: clampedScale,
              };
            } else {
              // Повертаємо незмінений елемент, якщо це не той, що має бути оновлений
              return element;
            }
          });
      
          return updatedElements;
        });
      };

      

      useEffect(() => {
        // Додаємо обробник події onWheel до текстового елемента
        const textElement = document.getElementById('textElement'); // Змініть 'textElement' на ідентифікатор текстового елемента відповідно до вашого коду
      
        if (textElement) {
          textElement.addEventListener('wheel', handleTextWheel);
        }
      
        // При демонтажі компонента видаляємо обробник події
        return () => {
          if (textElement) {
            textElement.removeEventListener('wheel', handleTextWheel);
          }
        };
      }, [fontSize]);

      useEffect(() => {
        const handleDocumentClick = (event) => {
          // Check if clicked outside the input
          const inputElement = document.getElementById('positionInput');
          if (inputElement && !inputElement.contains(event.target)) {
            hidePositionInput();
          }
        };
      
        // Add the event listener when the component mounts
        document.addEventListener('click', handleDocumentClick);
      
        // Remove the event listener when the component unmounts to avoid memory leaks
        return () => {
          document.removeEventListener('click', handleDocumentClick);
        };
      }, [hidePositionInput]);

      const handleTextMouseUp = (event) => {
        event.stopPropagation();
        setIsTextDragging(false);
      };

      useEffect(() => {
    if (isTextDragging) {
      window.addEventListener('mousemove', handleTextMouseMove);
      window.addEventListener('mouseup', handleTextMouseUp);
    } else {
      window.removeEventListener('mousemove', handleTextMouseMove);
      window.removeEventListener('mouseup', handleTextMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleTextMouseMove);
      window.removeEventListener('mouseup', handleTextMouseUp);
    };
  }, [isTextDragging]);
      useEffect(() => {
        // Calculate the center position of the card
        const cardContainerRect = cardContainerRef.current.getBoundingClientRect();
        const centerX = cardContainerRect.width / 2;
        const centerY = cardContainerRect.height / 2;
    
        // Set initial positions for text and input
        setTextPosition({ x: centerX, y: centerY });
        setInactiveInputPosition({ x: centerX, y: centerY });
      }, []);

    return (
        <>
       <CardContainer
      ref={cardContainerRef}
      id="cardContainer"
      className="card-container"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onClick={handleCardClick}
    >
      {selectedCard && !isCustomCard && (
        <Card className="card" style={{ backgroundColor: cardBackgroundColor }}>
          <img id="cardTemplate" src={selectedCard} alt="Selected Template" />

          {/* "dragged elements" */}
          {droppedElements.map((element, index) => (
            <div key={index} style={{ zIndex: 1 }}>
              <img
                src={element.src}
                alt={`Dropped Element ${index}`}
                className="dropped-element"
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  transform: `scale(${element.scale})`,
                }}
                onWheel={(event) => handleDroppedElementWheel(event, element)}
              />
            </div>
          ))}

          {isLogoVisible && (
            <React.Fragment>
              <QRCode
                className="qr-code"
                id="qrCode"
                src="img/qr-code.svg"
                alt="QR Code"
                style={{
                  transform: `translate(${cardElements.qrCode.x}px, ${cardElements.qrCode.y}px) scale(${cardElements.qrCode.scale})`,
                  pointerEvents: cardElements.qrCode.isDragging ? 'none' : 'auto',
                  maxWidth: '100px',
                  maxHeight: '100px',
                  borderRadius: '5px',
                  transition: cardElements.qrCode.isDragging ? 'none' : 'transform 0.3s ease-in-out',
                }}
                onMouseDown={(event) => handleElementDrag(event, 'qrCode')}
                onWheelCapture={(event) => handleElementWheel(event, 'qrCode')}
              />

              <Logo
                className="logo"
                id="logo"
                src="img/logo.png"
                alt="Logo"
                style={{
                  transform: `translate(${cardElements.logo.x}px, ${cardElements.logo.y}px) scale(${cardElements.logo.scale})`,
                  pointerEvents: cardElements.logo.isDragging ? 'none' : 'auto',
                  transition: cardElements.logo.isDragging ? 'none' : 'transform 0.3s ease-in-out',
                  zIndex: 2,
                }}
                onMouseDown={(event) => handleElementDrag(event, 'logo')}
                onWheelCapture={(event) => handleElementWheel(event, 'logo')}
              />
            </React.Fragment>
          )}
        </Card>
      )}

      {!selectedCard && isCustomCard && (
        <Card className="card" style={{ backgroundColor: cardBackgroundColor }}>
          {isLogoVisible && (
            <React.Fragment>
              <QRCode
                className="qr-code"
                id="qrCode"
                src="img/qr-code.svg"
                alt="QR Code"
                style={{
                  transform: `translate(${cardElements.qrCode.x}px, ${cardElements.qrCode.y}px) scale(${cardElements.qrCode.scale})`,
                  pointerEvents: 'auto',
                  maxWidth: '100px',
                  maxHeight: '100px',
                  borderRadius: '5px',
                  transition: 'transform 0.3s ease-in-out',
                }}
                onMouseDown={(event) => handleElementDrag(event, 'qrCode')}
                onWheelCapture={(event) => handleElementWheel(event, 'qrCode')}
              />

              <Logo
                className="logo"
                id="logo"
                src="img/logo.png"
                alt="Logo"
                style={{
                  transform: `translate(${cardElements.logo.x}px, ${cardElements.logo.y}px) scale(${cardElements.logo.scale})`,
                  pointerEvents: 'auto',
                  transition: 'transform 0.3s ease-in-out',
                  zIndex: 2,
                }}
                onMouseDown={(event) => handleElementDrag(event, 'logo')}
                onWheelCapture={(event) => handleElementWheel(event, 'logo')}
              />
               {nameInput.visible && (
                <input
                    type="text"
                    value={name}
                    onChange={handleNameInputChange}
                    placeholder='Your name'
                    onBlur={hideNameInput}
                    onFocus={() => setInputFocused(true)}
                    autoFocus={inputFocused === true}
                    style={{
                    position: 'absolute',
                    top: `${nameInput.y}px`,
                    left: `${nameInput.x}px`,
                    marginBottom: '300px',
                    width: '150px',
                    zIndex: 10,
                    cursor: nameInput.isDragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                />
                )}
                <div
                onDoubleClick={handleDoubleClick}
                onMouseDown={(event) => handleTextMouseDown(event)}
                
                style={{
                    position: 'absolute',
                    top: `${textPosition.y}px`,
                    left: `${textPosition.x+100}px`,
                    width: '150px', // Adjust the size as needed
                    height: '30px', // Adjust the size as needed
                    transform: `translate(-50%, -50%)`,
                    cursor: isTextDragging ? 'grabbing' : 'grab',
                    zIndex: 5,
                    //fontSize: `${fontSize}px`,
                }}
                >
                {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={handleNameInputChange}
                    onBlur={handleBlur}
                    onFocus={() => setInputFocused(true)}
                    autoFocus={inputFocused === true}
                    style={{
                        width: '100%',
                        height: '100%',
                        //transform: 'translate(-50%, -50%)',
                        cursor: isTextDragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                />
                ) : (
                    <p id="textElement"
                    onDoubleClick={handleDoubleClick}
                    onWheel={handleTextWheel}
                    style={{
                      fontSize: `${fontSize}px`,
                      cursor: isTextDragging ? 'grabbing' : 'grab',
                    }}
                    ><b>{name}</b></p>
                )}
                </div>
                {positionInput.visible && (
          <input
          ref={(el) => setPositionInputRef(el)}
          type="text"
          placeholder='Your position'
          value={position}
          onChange={handlePositionInputChange}
          onBlur={hidePositionInput}
          onFocus={() => setInputFocused(true)}
          autoFocus={inputFocused === true}
          style={{
            position: 'absolute',
            top: `${inactiveInputPosition.y}px`,
            left: `${inactiveInputPosition.x}px`,
            width: '150px',
            zIndex: 10,
            cursor:  positionInput.isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={(event) => event.stopPropagation()}
        />
        )}

        {/* Text element for the position */}
        <div
    onDoubleClick={handleDoubleClick}
    onMouseDown={(event) => handleTextMouseDown(event)}
    style={{
      position: 'absolute',
      top: `${textPosition.y + 50}px`,
      left: `${textPosition.x + 100}px`, // Offset the position of the position text element
      width: '150px', // Adjust the size as needed
      height: '30px', // Adjust the size as needed
      transform: `translate(-50%, -50%)`,
      cursor: isTextDragging ? 'grabbing' : 'grab',
      zIndex: 5,
      fontSize: `${fontSize}px`,
    }}
  >
          {isEditing ? (
            <input
              type="text"
              value={position}
              onChange={handlePositionInputChange}
              onBlur={handleBlur}
              onFocus={() => setInputFocused(true)}
              autoFocus={inputFocused === true}
              style={{
                width: '100%',
                height: '100%',
                cursor: isTextDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={(event) => event.stopPropagation()}
            />
          ) : (
            <p
              id="textElement"
              onDoubleClick={handleDoubleClick}
              onWheel={handleTextWheel}
              style={{
                fontSize: `${fontSize}px`,
                cursor: isTextDragging ? 'grabbing' : 'grab',
              }}
            >
              {position}
            </p>
          )}
        </div>

            </React.Fragment>
          )}

          {/* "dragged elements" */}
          {droppedElements.map((element, index) => (
            <div key={index} style={{ zIndex: 1 }}>
              <img
                src={element.src}
                alt={`Dropped Element ${index}`}
                className="dropped-element"
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  transform: `scale(${element.scale})`,
                }}
                onWheel={(event) => handleDroppedElementWheel(event, element)}
              />
            </div>
          ))}
        </Card>
      )}
       

    </CardContainer>
    </>
  );
};

export default CardComponent;