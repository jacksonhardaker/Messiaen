import React from 'react';
import { purple, offBlack } from '../../constants/colors';
const SelectContainer = () => {
  return (
    <section>
      <div>
        <select id='modeSelect'>
          <option value='0'>First mode / Whole-tone scale</option>
          <option value='1'>Second mode / Diminished scale</option>
          <option value='2'>Third mode</option>
          <option value='3'>Fourth mode</option>
          <option value='4'>Fifth mode</option>
          <option value='5'>Sixth mode</option>
          <option value='6'>Seventh mode</option>
        </select>
      </div>
      <div>
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
      <style jsx>{`
        section {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        select {
          border-color: ${offBlack};
        }
        select:focus {
          border-color: ${purple}
        }
        div {
          width: 100%;
          max-width: 320px;
          margin: 0 0.75rem;
        }
      `}</style>
    </section>
  );
};

export default SelectContainer;
