import React from 'react';
import modes, { getModeNames } from '../../constants/modes';
import { offBlack, purple } from '../../constants/colors';
import useMessiaenContext from '../../hooks/useMessiaenContext';

const ModeOption = ({ label, index }) => {
  return <option value={index}>{label}</option>;
};

const ModeOptions = ({ modes }) => {
  return modes.map((label, index) => <ModeOption label={label} index={index} key={index} />);
};

const ModeSelect = () => {
  const {
    selectedMode,
    setSelectedMode,
  } = useMessiaenContext();
  const modeNames = getModeNames();

  const onChange = event => {
    const index = event.currentTarget.selectedIndex;

    setSelectedMode(
      modes[index]
    );
  };

  return (
    <select
      id='modeSelect'
      {...{ onChange }}
      defaultValue={modeNames.indexOf(selectedMode.name)}>
      <ModeOptions modes={modeNames} />

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
