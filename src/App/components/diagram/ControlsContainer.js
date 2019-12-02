import React from 'react';

const ControlsContainer = () => {
  return (
    <section className='controls'>
      <div>
        <button className='button-outline' id='playMessiaenChordButton'>Play chord</button>
        <button className='button-outline' id='clearMessiaenChordButton'>Clear chord</button>
      </div>
      <div>
        <button className='button-outline' id='downloadMessiaenDiagramButton'>Download Diagram</button>
      </div>
      
      <style jsx>{`
        section.controls {
          margin: 0 auto;
          display: inline-flex;
          flex-direction: column;
        }
        button {
          margin: 5px;
        }
      `}</style>
    </section>
  );
};

export default ControlsContainer;
