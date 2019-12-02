import React, { useEffect, useRef } from 'react';
import { purple, offBlack } from '../../constants/colors';
import tones, { mapTonesToLeadingC } from '../../constants/tones';
import useMessiaenContext from '../../hooks/useMessiaenContext';

const KeyOption = ({ tone, value }) => {
  return <option value={value}>{tone}</option>;
};

const KeyOptions = ({ tones }) => {
  return tones.map(({ value, label }) => <KeyOption tone={label} value={value} key={value} />);
};

const KeySelect = ({ options = mapTonesToLeadingC() }) => {
  const selectEl = useRef(null);
  const {
    selectedTone,
    setSelectedTone,
  } = useMessiaenContext();

  const onChange = ({ currentTarget }) => {
    setSelectedTone(
      tones[currentTarget.value]
    );
  };

  useEffect(() => {
    selectEl.current.selectedIndex = options.findIndex(option => option.label === selectedTone);
  }, [selectedTone, options]);

  return (
    <select
      ref={selectEl}
      id='keySelect'
      {...{ onChange }}>
      <KeyOptions tones={options} />

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

export default KeySelect;
