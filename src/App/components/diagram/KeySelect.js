import React from 'react';
import { purple, offBlack } from '../../constants/colors';
import tones from '../../constants/tones';

const KeyOption = ({ tone, value }) => {
  return <option value={value}>{tone}</option>;
};

const KeyOptions = ({ tones }) => {
  return tones.map(({ value, label }) => <KeyOption tone={label} value={value} key={value} />);
};

const KeySelect = () => {
  // Map options and push 'C' to the front of the array.
  const options = tones.map((tone, index) => ({ value: index, label: tone }));
  options.unshift(options.pop());

  return (
    <select id='keySelect' defaultValue={4}>
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
