import React, { useState } from 'react';
import { Button } from '@mui/material';
import { fetchComputePopulation } from '../../chatbot/api';

export default function ComputePopulation(props) {
  const [inputValue, setInputValue] = useState('');
  const [show, setShow] = useState(true);
  const [down, setDown] = useState(true);

  // Handle sending messages
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSend = async () => {
    const isValidNumber = !isNaN(parseFloat(inputValue)) && isFinite(inputValue) && inputValue.trim() !== '';

    if (!isValidNumber) {
      console.log('Invalid input:', inputValue);
      return;
    }

    if (props.actionProvider.stateRef.isComputingPopulation) {
      console.log('Processing population input:', inputValue);
      props.actionProvider.handleComputePopulation(inputValue); 
      return;
    }

    try {
      const response = await fetchComputePopulation(inputValue);
      const data = await response.json();
      console.log('Computed population:', data);
    } catch (error) {
      console.error('Error computing population:', error);
    }

    setDown(true);
    props.actionProvider.handleComputePopulation(inputValue);
    setInputValue('');
    setShow(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {show ? (
        <div
          style={{
            width: 300,
            marginLeft: '9.2%',
            marginTop: `${down ? '20px' : '-50px'}`,
            padding: '5px 20px 20px',
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0px',
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                textAlign: 'left',
                padding: '10px 0 0',
                color: '#3a3b3d',
              }}
            >
              Input Population
            </p>
            <Button
              variant="contained"
              style={{
                background: '#e6237e',
                fontWeight: 600,
                marginTop: '10px',
                flexBasis: '22%',
                marginRight: '10px',
                fontSize: '13px',
                width: '50%',
              }}
              onClick={() => {
                props.actionProvider.enterComputePopulationMode();
                setShow(false);
                // props.actionProvider.showButtons();
              }}
            >
              Menu
            </Button>
          </div>

          <div
            style={{
              padding: '2px 4px 0',
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #e6237e',
              borderRadius: '5px',
            }}
          >
            <textarea
              className="textarea"
              style={{
                borderWidth: 0,
                borderColor: '#fff',
                outline: 0,
                width: '100%',
                height: '100px',
              }}
              placeholder="Enter population"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
            }}
          >
            <Button
              variant="contained"
              style={{
                background: '#e6237e',
                fontWeight: 600,
                marginTop: '10px',
                flexBasis: '22%',
                marginRight: '10px',
                width: '50%',
              }}
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}