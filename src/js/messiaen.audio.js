// Messiaen Audio

const messiaenAudio = {
    pitches: ["C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "Bb", "B", "C"]
};

const _folders = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const _maxChannels = 100;
const _keyboard = [];

let _audioChannels = [];
let _notesToPlay = [];
let _playingChord = false;
let _unisonNotesToPlay = [];

messiaenAudio.initialise = function () {

    for (var j = 0; j < 5; j++) {
        for (var k = 0; k < 12; k++) {

            _keyboard.push({
                pitch: messiaenAudio.pitches[k],
                audio: `audio/mp3/${_folders[k]}/${j + 1}.mp3`,
                id: `${messiaenAudio.pitches[k]}${j + 1}`,
                loaded: false
            });
        }
    }

    _audioChannels = new Array(_maxChannels).fill({}).map(() => {
        return {
            channel: new Audio(),
            finished: -1
        };
    });
}

messiaenAudio.preLoadPitch = function (pitch) {

    _keyboard.forEach((note) => {
        if (note.pitch === pitch && !note.loaded) {

            let wrapper = document.createElement('div');
            wrapper.innerHTML = `<audio preload='auto' id='${note.id}' src='${note.audio}'></audio>`;
            document.body.appendChild(wrapper);
            note.loaded = true;
        }
    });
}



messiaenAudio.buildAndPlayChord = function (selectedPitches) {

    let pitchArray = selectedPitches.map(pitch => messiaenAudio.pitches[pitch]);

    if (pitchArray.length > 0 && !_playingChord) {


        _playingChord = true;
        let chord = [];
        let keyboardStartingIndex = 0;
        let noteAdded = false;

        pitchArray.forEach((pitch, i) => {
            noteAdded = false;


            // Step up the chromatic scale
            for (let j = keyboardStartingIndex; j < _keyboard.length; j++) {

                if (_keyboard[j].pitch === pitch) {
                    if (_keyboard[j].loaded === false) {
                        messiaenAudio.preLoadPitch(pitch);
                    }

                    chord.push(_keyboard[j].id);
                    keyboardStartingIndex = j;
                    noteAdded = true;

                    break;
                }
            }

            // Didn't find a valid note to play, so step down the chromatic scale
            if (!noteAdded) {

                for (let k = keyboardStartingIndex; k >= 0; k--) {

                    if (_keyboard[k].pitch === pitch) {
                        if (_keyboard[k].loaded === false) {
                            messiaenAudio.preLoadPitch(pitch);
                        }

                        chord.push(_keyboard[k].id);
                        keyboardStartingIndex = k;
                        noteAdded = true;

                        break;
                    }
                }
            }
        });

        __play(chord);
    }
}

/**
 * Private Functions
 */

function __playNoteOfChordIndividually() {

    var audio = document.getElementById(_notesToPlay[0]);

    _audioChannels.some((audioChannel) => {
        let now = new Date()

        if (audioChannel.finished < now.getTime()) {
            audioChannel.finished = now.getTime() + audio.duration * 1000;
            audioChannel.channel.src = audio.src;
            audioChannel.channel.load();
            audioChannel.channel.play();

            return true;
        }
    });

    // Start constructing unison chord
    _unisonNotesToPlay.push(_notesToPlay[0]);

    // Remove played note from list of notes to play
    _notesToPlay.splice(0, 1);

    if (_notesToPlay.length > 0) {
        setTimeout(__playNoteOfChordIndividually, 150);
    }
    else {
        setTimeout(__playUnisonChord, 900);
    }
}

function __playUnisonChord() {

    var audio = document.getElementById(_unisonNotesToPlay[0]);

    _audioChannels.some((audioChannel) => {
        let now = new Date()

        if (audioChannel.finished < now.getTime()) {			// is this channel finished?

            audioChannel.finished = now.getTime() + audio.duration * 1000;
            audioChannel.channel.src = audio.src;
            audioChannel.channel.load();
            audioChannel.channel.play();

            return true;
        }
    });

    // Remove played note from list of notes to play
    _unisonNotesToPlay.splice(0, 1);

    if (_unisonNotesToPlay.length > 0) {
        __playUnisonChord();
    }
    else {
        // Finished
        _playingChord = false;
        __togglePlayButton();
    }
}

function __play(chord) {

    if (chord && chord.length !== 0) {
        __togglePlayButton();

        var allLoaded = true;

        for (var i = 0, length = chord.length; i < length; i++) {
            if (!document.getElementById(chord[i]).readyState) {
                allLoaded = false;

                break;
            }
        }

        if (allLoaded) {
            chord.forEach((note) => {
                _notesToPlay.push(note);
            });

            __playNoteOfChordIndividually();
        }
        else {
            // Wait a wee bit for the sounds to load, then try playing again.
            setTimeout(function () { __play(chord); }, 100);
        }
    }
    else {
        __togglePlayButton();
    }
}

function __togglePlayButton() {
    
    document.getElementById('playMessiaenChordButton').children[0].style.display = _playingChord ? 'none' : 'block';
    document.getElementById('playMessiaenChordButton').children[1].style.display = _playingChord ? 'block': 'none';
}

export default messiaenAudio;