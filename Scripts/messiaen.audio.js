messiaen.audio = function () {

	var methods = {};



	var _keyboard = [];



	var _pitches = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'Bb', 'B'];

	var _folders = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];



	var _notesToPlay = [];



	var _maxChannels = 100;

	var _audioChannels = [];

	var _playingChord = false;



	methods.initialise = function () {

		var folder = (BrowserDetect.browser === "Opera" || BrowserDetect.browser === "Firefox") ? "Audio/Ogg/" : "Audio/Mp3/";

		var format = (BrowserDetect.browser === "Opera" || BrowserDetect.browser === "Firefox") ? ".ogg" : ".mp3";

		for (var j = 0; j < 5; j++) {

			for (var k = 0; k < 12; k++) {

				_keyboard.push({ pitch: _pitches[k], audio: folder + _folders[k] + "/" + (j + 1) + format, id: _pitches[k] + (j + 1), loaded: false });

			}

		}



		for (var i = 0; i < _maxChannels; i++) {

			var audioObj = [];

			audioObj["channel"] = new Audio();

			audioObj["finished"] = -1;



			_audioChannels.push(audioObj);

		}

	};



	methods.loadPitch = function (pitch) {

		for (var i = 0, length = _keyboard.length; i < length, note = _keyboard[i]; i++) {

			if (note.pitch === pitch && !note.loaded) {

				var audioTag = document.createElement("audio");

				audioTag.setAttribute("preload", "auto");

				audioTag.setAttribute("id", note.id);

				audioTag.setAttribute("src", note.audio);



				document.body.appendChild(audioTag);

				_keyboard[i].loaded = true;

			}

		}

	};



	var _unisonNotesToPlay = [];



	var __play = function () {

		var audio = document.getElementById(_notesToPlay[0]);

		for (var i = 0; i < _maxChannels; i++) {

			var now = new Date();

			if (_audioChannels[i]['finished'] < now.getTime()) {			// is this channel finished?

				_audioChannels[i]['finished'] = now.getTime() + audio.duration * 1000;

				_audioChannels[i]['channel'].src = audio.src;

				_audioChannels[i]['channel'].load();

				_audioChannels[i]['channel'].play();

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

	};



	var __playUnisonChord = function () {

		var audio = document.getElementById(_unisonNotesToPlay[0]);

		for (var i = 0; i < _maxChannels; i++) {

			var now = new Date();

			if (_audioChannels[i]['finished'] < now.getTime()) {			// is this channel finished?

				_audioChannels[i]['finished'] = now.getTime() + audio.duration * 1000;

				_audioChannels[i]['channel'].src = audio.src;

				_audioChannels[i]['channel'].load();

				_audioChannels[i]['channel'].play();

				break;

			}

		}

		_unisonNotesToPlay.splice(0, 1);



		if (_unisonNotesToPlay.length > 0) {

			__playUnisonChord();

		}

		else {

			_playingChord = false;

		}

	};



	methods.playChord = function (pitchArray) {

		if (!_playingChord) {

			_playingChord = true;

			var chord = [];



			var keyboardStartingIndex = 0;

			var noteAdded = false;

			for (var i = 0, length = pitchArray.length; i < length, pitch = pitchArray[i]; i++) {

				noteAdded = false;

				for (var j = keyboardStartingIndex, length = _keyboard.length; j < length; j++) {



					if (_keyboard[j].pitch === pitch) {

						if (_keyboard[j].loaded === false) {

							messiaen.audio.loadPitch(pitch);

						}

						chord.push(_keyboard[j].id);

						keyboardStartingIndex = j;

						noteAdded = true;

						break;

					}

				}

				if (!noteAdded) {

					for (var j = keyboardStartingIndex; j >= 0; j--) {



						if (_keyboard[j].pitch === pitch) {

							if (_keyboard[j].loaded === false) {

								messiaen.audio.loadPitch(pitch);

							}

							chord.push(_keyboard[j].id);

							keyboardStartingIndex = j;

							noteAdded = true;

							break;

						}

					}

				}

			}



			__playChord(chord);

		}

	};



	var __playChord = function (chord) {

		if (chord && chord.length !== 0) {

			var allLoaded = true;



			for (var i = 0, length = chord.length; i < length; i++) {

				if (!document.getElementById(chord[i]).readyState) {

					allLoaded = false;

					break;

				}

			}



			if (allLoaded) {

				for (var k = 0, length = chord.length; k < length; k++) {

					_notesToPlay.push(chord[k]);

				}

				__play();

			}

			else {

				setTimeout(function () { __playChord(chord); }, 100);

			}

		}

		else {

			document.getElementById("playMessiaenChordButton").children[0].style.display = "block";

			document.getElementById("playMessiaenChordButton").children[1].style.display = "none";

		}

	};



	return methods;

} ();