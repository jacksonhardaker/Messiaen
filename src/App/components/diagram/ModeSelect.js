import React from 'react';
import { getModeNames } from '../../constants/modes';
import { offBlack, purple } from '../../constants/colors';

const ModeOption = ({ label, index }) => {
  return <option value={index}>{label}</option>;
};

const ModeOptions = ({modes}) => {
  return modes.map((label, index) => <ModeOption label={label} index={index} key={index} />);
};

const ModeSelect = () => {
  const modes = getModeNames();

  return (
    <select id='modeSelect'>
      <ModeOptions modes={modes} />

      <style jsx>{`
        select {
          border-color: ${offBlack};
        }
        select:focus {
          border-color: ${purple}
        }
      `}</style>
    </select>
  );
};

export default ModeSelect;
