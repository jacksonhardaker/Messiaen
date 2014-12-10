/// <reference path="jquery-1.4.2.min.js" />



var schoenberg = {};

schoenberg.matrix = function () {

	var methods = {};



	var _pitches = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "Bb", "B"];



	var _initialRow = [];





	methods.initialise = function () {





		randomMatrix();

		//_initialRow = [0, 1, 2, 11, 10, 8, 4, 9, 3, 6, 5, 7];

	};



	var randomMatrix = function () {

		while (_initialRow.length < 12) {

			var numRand = Math.floor(Math.random() * 12);

			if (_initialRow.indexOf(numRand) === -1) {

				_initialRow.push(numRand);

			}

		}



		generateMatrix();

	};



	var generateMatrix = function () {

		var _initialInversion = [];



		//Generate inversion

		_initialInversion.push(_initialRow[0]);

		for (var i = 1, length = _initialRow.length; i < length; i++) {

			_initialInversion.push(getPitch(_initialInversion[i - 1], _initialRow[i] - _initialRow[i - 1]));

		}



		//Generate grid

		for (var i = 0, length = 12; i < length; i++) {

			var row = document.createElement("tr");



			var cell = document.createElement("td");

			cell.appendChild(document.createTextNode(_pitches[_initialInversion[i]]));

			row.appendChild(cell);

			var lastPitch = _initialInversion[i];



			for (var j = 1, length = 12; j < length; j++) {

				cell = document.createElement("td");



				lastPitch = getPitch(lastPitch, _initialRow[j - 1] - _initialRow[j]);



				cell.appendChild(document.createTextNode(_pitches[lastPitch]));

				row.appendChild(cell);

			}



			$("#12ToneMatrix").children("tbody").append(row);

		}

	};



	var getPitch = function (initialPitchIndex, semitoneDifference) {

		//alert(semitoneDifference);

		var pitch = initialPitchIndex - semitoneDifference;

		if (pitch < 0) {

			pitch += 12;

		}

		else if (pitch > 11) {

			pitch -= 12;

		}



		return pitch;

	};



	return methods;

} ();



$(document).ready(schoenberg.matrix.initialise);