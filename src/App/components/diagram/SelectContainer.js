import React from 'react';
import { purple, offBlack } from '../../constants/colors';
import ModeSelect from './ModeSelect';
import KeySelect from './KeySelect';

const SelectContainer = () => {

  return (
    <section>
      <div>
        <ModeSelect />
      </div>
      <div>
        <KeySelect />
      </div>
      <style jsx>{`
        section {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
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
