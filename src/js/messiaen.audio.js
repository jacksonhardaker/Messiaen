// Messiaen Audio

const messiaenAudio = {};
const _pitches = ["C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "Bb", "B", "C"];
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
                pitch: _pitches[k],
                audio: `audio/mp3/${_folders[k]}/${j + 1}.mp3`,
                id: `${_pitches[k]}${j + 1}`,
                loaded: false
            });
        }
    }

    _audioChannels = new Array(100).fill({}).map(() => {
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



messiaenAudio.playChord = function (selectedPitches) {

    let pitchArray = selectedPitches.map(pitch => _pitches[pitch]);

    if (pitchArray.length > 0 && !_playingChord) {


        _playingChord = true;
        var chord = [];
        var keyboardStartingIndex = 0;
        var noteAdded = false;

        for (var i = 0; i < pitchArray.length; i++) {

            var pitch = pitchArray[i];
            noteAdded = false;

            for (var j = keyboardStartingIndex; j < _keyboard.length; j++) {

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

            if (!noteAdded) {

                for (var jj = keyboardStartingIndex; jj >= 0; jj--) {

                    if (_keyboard[jj].pitch === pitch) {
                        if (_keyboard[jj].loaded === false) {
                            messiaenAudio.preLoadPitch(pitch);
                        }

                        chord.push(_keyboard[jj].id);
                        keyboardStartingIndex = jj;
                        noteAdded = true;

                        break;
                    }
                }
            }
        }

        __playChord(chord);
    }
}

/**
 * Private Functions
 */

function __play() {

    var audio = document.getElementById(_notesToPlay[0]);

    for (var i = 0; i < _maxChannels; i++) {

        var now = new Date();

        if (_audioChannels[i].finished < now.getTime()) {			// is this channel finished?

            _audioChannels[i].finished = now.getTime() + audio.duration * 1000;
            _audioChannels[i].channel.src = audio.src;
            _audioChannels[i].channel.load();
            _audioChannels[i].channel.play();

            break;
        }
    }

    _unisonNotesToPlay.push(_notesToPlay[0]);
    _notesToPlay.splice(0, 1);

    if (_notesToPlay.length > 0) {
        setTimeout(__play, 150);
    }
    else {
        setTimeout(__playUnisonChord, 900);
    }
}

function __playUnisonChord() {

    var audio = document.getElementById(_unisonNotesToPlay[0]);

    for (var i = 0; i < _maxChannels; i++) {

        var now = new Date();

        if (_audioChannels[i].finished < now.getTime()) {			// is this channel finished?

            _audioChannels[i].finished = now.getTime() + audio.duration * 1000;
            _audioChannels[i].channel.src = audio.src;
            _audioChannels[i].channel.load();
            _audioChannels[i].channel.play();

            break;
        }

    }

    _unisonNotesToPlay.splice(0, 1);

    if (_unisonNotesToPlay.length > 0) {
        __playUnisonChord();
    }
    else {
        _playingChord = false;
        __togglePlayButton();
    }
}

function __playChord(chord) {

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
            for (var k = 0; k < chord.length; k++) {
                _notesToPlay.push(chord[k]);
            }

            __play();
        }
        else {
            // Wait a wee bit for the sounds to load, then try playing again.
            setTimeout(function () { __playChord(chord); }, 100);
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