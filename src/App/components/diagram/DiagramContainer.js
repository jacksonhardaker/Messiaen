import React from 'react';
import SelectContainer from './SelectContainer';

const DiagramContainer = () => {
  return (
    <section className='messiaenbackground'>
      
      <SelectContainer />

      <div>
        <canvas id='messiaenDiagram' width='300' height='300'></canvas>
      </div>

      <section className='controls'>
        <div>
          <button className='button-outline' id='playMessiaenChordButton'>Play chord</button>
          <button className='button-outline' id='clearMessiaenChordButton'>Clear chord</button>
        </div>
        <div>
          <a className='button button-outline' id='downloadMessiaenDiagramButton'>Download Diagram</a>
        </div>
      </section>

      <style jsx>{`
        section.messiaenbackground {
          text-align: center;  
        }
        canvas {
          -moz-user-select: -moz-none;
          -khtml-user-select: none;
          -webkit-user-select: none;
          -o-user-select: none;
          user-select: none;
          max-width: 100%;
        }
        section.controls {
          margin: 0 auto;
          display: inline-flex;
          flex-direction: column;
        }
        section.controls button {
          margin: 5px;
        }
      `}</style>
    </section>
  );
};

export default DiagramContainer;
