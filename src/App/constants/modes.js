const modes = [
  { name: 'First mode / Whole-tone scale', construction: [2, 2, 2, 2, 2] },
  { name: 'Second mode / Diminished scale', construction: [1, 2, 1, 2, 1, 2, 1] },
  { name: 'Third mode', construction: [2, 1, 1, 2, 1, 1, 2, 1] },
  { name: 'Fourth mode', construction: [1, 1, 3, 1, 1, 1, 3] },
  { name: 'Fifth mode', construction: [1, 4, 1, 1, 4] },
  { name: 'Sixth mode', construction: [2, 2, 1, 1, 2, 2, 1] },
  { name: 'Seventh mode', construction: [1, 1, 1, 2, 1, 1, 1, 1, 2] }
];

const getModeByIndex = index => modes[index];

const getModeNames = () => modes.map(mode => mode.name);

export {
  getModeByIndex,
  getModeNames,
};

export default modes;
