const tones = ['C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'Bb', 'B', 'C'];

// Map options and push 'C' to the front of the array.
const mapTonesToLeadingC = () => {
  const options = tones.map((tone, index) => ({ value: index, label: tone }));
  options.unshift(options.pop());

  return options;
};

export { mapTonesToLeadingC };

export default tones;
