import React from 'react';

const DiagramContainer = () => {
  const canvasStyles = {
    MozUserSelect: '-moz-none',
    WebkitUserSelect: 'none'
  };

  return (
    <section className='messiaenbackground'>
      <div style={{textAlign: 'center'}}>
        <select id='modeSelect'>
          <option value='0'>First mode / Whole-tone scale</option>
          <option value='1'>Second mode / Diminished scale</option>
          <option value='2'>Third mode</option>
          <option value='3'>Fourth mode</option>
          <option value='4'>Fifth mode</option>
          <option value='5'>Sixth mode</option>
          <option value='6'>Seventh mode</option>
        </select>
        <select id='keySelect'>
          <option value='11'>C</option>
          <option value='0'>C#/Db</option>
          <option value='1'>D</option>
          <option value='2'>D#/Eb</option>
          <option value='3'>E</option>
          <option value='4'>F</option>
          <option value='5'>F#/Gb</option>
          <option value='6'>G</option>
          <option value='7'>G#/Ab</option>
          <option value='8'>A</option>
          <option value='9'>A#/Bb</option>
          <option value='10'>B</option>
        </select>
      </div>

      <div style={{textAlign: 'center'}}>
        <canvas id='messiaenDiagram' width='300' height='300' style={canvasStyles}></canvas>
      </div>

      <div>
        <button className='button-outline' id='playMessiaenChordButton'>Play chord</button>
        <button className='button-outline' id='clearMessiaenChordButton'>Clear chord</button>
        <button className='button-outline' id='downloadMessiaenDiagramButton'>Download Diagram</button>
      </div>
    </section>
  );
};

export default DiagramContainer;
