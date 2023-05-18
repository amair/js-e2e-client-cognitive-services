// ./src/App.js

import React, { useState } from 'react';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './azure-cognitiveservices-computervision';

function App() {

  const [fileSelected, setFileSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    processImage(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    processImage(file);
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  

  const handleChange = (e) => {
    setFileSelected(e.target.value)
  }
  const onFileUrlEntered = (e) => {

    // hold UI
    setProcessing(true);
    setAnalysis(null);

    computerVision(fileSelected || null).then((item) => {
      // reset state/form
      setAnalysis(item);
      setFileSelected("");
      setProcessing(false);
    });

  };

  // Display JSON data in readable format
  const PrettyPrintJson = (data) => {
    return (<div><pre>{JSON.stringify(data, null, 2)}</pre></div>);
  }

  const DisplayResults = () => {
    return (
      <div>
        <h2>Computer Vision Analysis</h2>
        <div><img src={analysis.URL} height="200" border="1" alt={(analysis.description && analysis.description.captions && analysis.description.captions[0].text ? analysis.description.captions[0].text : "can't find caption")} /></div>
        {PrettyPrintJson(analysis)}
      </div>
    )
  };
  
  const Analyze = () => {
    return (
    <div>
      <h1>Analyze image 1</h1>
      {!processing &&
        <div>
          <div
            className={`dropzone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">Drag and drop an image or click here to select</label>
          </div>
          <div>
            <label>URL</label>
            <input type="text" placeholder="Enter URL or leave empty for random image from collection" size="50" onChange={handleChange}></input>
          </div>
          <button onClick={onFileUrlEntered}>Analyze</button>
          <div>
          {selectedImage && (
              <div>
                <h2>Selected Image:</h2>
                <img src={selectedImage} alt="Selected" style={{ maxWidth: '300px' }} />
              </div>
            )}
          </div>
        </div>
      }
      {processing && <div>Processing</div>}
      <hr />
      {analysis && DisplayResults()}
      </div>
    )
  }

  const CantAnalyze = () => {
    return (
      <div>Key and/or endpoint not configured in ./azure-cognitiveservices-computervision.js</div>
    )
  }
  
  function Render() {
    // const ready = ComputerVisionIsConfigured();
    const ready = true;

    if (ready) {
      return <Analyze />;
    }
    return <CantAnalyze />;
  }

  return (
    <div>
      {Render()}
    </div>
    
  );
}

export default App;
