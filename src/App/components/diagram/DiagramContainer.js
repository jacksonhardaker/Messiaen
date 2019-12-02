import React, { useEffect } from 'react';
import SelectContainer from './SelectContainer';
import ControlsContainer from './ControlsContainer';
import { initialise } from '../../../js/messiaen.diagram';

const DiagramContainer = () => {

  useEffect(initialise, []);

  return (
    <section className='messiaenbackground'>
      
      <SelectContainer />

      <div>
        <canvas id='messiaenDiagram' width='300' height='300'></canvas>
      </div>

      <ControlsContainer />

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
      `}</style>
    </section>
  );
};

export default DiagramContainer;
