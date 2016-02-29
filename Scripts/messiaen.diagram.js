var messiaen = {};

messiaen.diagram = function () {

    var methods = {};



    var _colors = { background: "dbcebb", heading: "212136", circle: "1E0F13", defaultText: "fff", selectedText: "1E0F13", highlightedText: "AC2017", modeShape: "fff", chordShape: "AC2017" };



    var _pitches = ["C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "Bb", "B", "C"];



    var _pitchAngleRanges = [{ pitchIndex: 11, lower: -1 / 12, upper: 1 / 12, middle: 0 },

							 { pitchIndex: 10, lower: 1 / 12, upper: 3 / 12, middle: 2 / 12 },

							 { pitchIndex: 9, lower: 3 / 12, upper: 5 / 12, middle: 4 / 12 },

							 { pitchIndex: 8, lower: 5 / 12, upper: 7 / 12, middle: 6 / 12 },

							 { pitchIndex: 7, lower: 7 / 12, upper: 9 / 12, middle: 8 / 12 },

							 { pitchIndex: 6, lower: 9 / 12, upper: 11 / 12, middle: 10 / 12 },

							 { pitchIndex: 5, lower: 11 / 12, upper: 13 / 12, middle: 12 / 12 },

							 { pitchIndex: 4, lower: 13 / 12, upper: 15 / 12, middle: 14 / 12 },

							 { pitchIndex: 3, lower: 15 / 12, upper: 17 / 12, middle: 16 / 12 },

							 { pitchIndex: 2, lower: 17 / 12, upper: 19 / 12, middle: 18 / 12 },

							 { pitchIndex: 1, lower: 19 / 12, upper: 21 / 12, middle: 20 / 12 },

							 { pitchIndex: 0, lower: 21 / 12, upper: 23 / 12, middle: 22 / 12 }];



    var _modes = [{ name: "First mode / Whole-tone scale", construction: [2, 2, 2, 2, 2] },

        { name: "Second mode / Diminished scale", construction: [1, 2, 1, 2, 1, 2, 1] },

        { name: "Third mode", construction: [2, 1, 1, 2, 1, 1, 2, 1] },

        { name: "Fourth mode", construction: [1, 1, 3, 1, 1, 1, 3] },

        { name: "Fifth mode", construction: [1, 4, 1, 1, 4] },

        { name: "Sixth mode", construction: [2, 2, 1, 1, 2, 2, 1] },

        { name: "Seventh mode", construction: [1, 1, 1, 2, 1, 1, 1, 1, 2] }];



    var _canvas = null;

    var _context = null;


    /* Unused? */
    var _center = null;



    var _currentTransformationMatrix = null;



    var _pitchTransformationMatrix = null;

    var _lineTransformationMatrix = null;



    var _pitchObjects = [];

    var _highlightedPitches = [];

    var _selectedPitches = [];



    var _currentKeyIndex = 11;

    var _currentModeIndex = 0;



    var _rotation = 0;



    var _modeListBoundingBoxes = [];

    var _modeListBoundingBoxMouseOverIndex = null;



    var _diagramMouseDown = false;

    var _previousMouseCoords = null;



    var _requireRedraw = false;



    var _previousTime = null;

    var _pixelsPerMillisecond = 0;

    var _timeOutId = null;



    methods.initialise = function () {

        BrowserDetect.init();

        messiaen.audio.initialise();



        _canvas = document.getElementById("messiaenDiagram");

        _canvas.width = document.documentElement.clientHeight - 170;

        _canvas.height = document.documentElement.clientHeight - 170;

        _context = _canvas.getContext("2d");



        var modeSelect = document.getElementById("modeSelect");

        modeSelect.selectedIndex = 0;

        modeSelect.onchange = function (e) {

            var l = document.getElementById("modeSelect");

            _currentModeIndex = Number(l.children[l.selectedIndex].value);

            _selectedPitches = [];

            _requireRedraw = true;

        };



        var keySelect = document.getElementById("keySelect");

        keySelect.selectedIndex = 0;

        keySelect.onchange = function (e) {

            var previousKeyIndex = _currentKeyIndex;

            var l = document.getElementById("keySelect");

            _currentKeyIndex = Number(l.children[l.selectedIndex].value);

            _selectedPitches = [];

            __animateRotation(previousKeyIndex);

        };



        if ('ontouchstart' in document.documentElement) {

			/*document.getElementById("instructionsLink").addEventListener("touchstart", function () {

				if (document.getElementById("instructionsContent").style.display === "block") {

					document.getElementById("instructionsContent").style.display = "none";

				}

				else {

					document.getElementById("instructionsContent").style.display = "block";

				}

			}, false);*/



            document.getElementById("playMessiaenChordButton").addEventListener("touchstart", function (e) { __playChordClick(); return false; }, false);

            document.getElementById("clearMessiaenChordButton").addEventListener("touchstart", function (e) { _selectedPitches = []; _requireRedraw = true; return false; }, false);



            _canvas.addEventListener('touchstart', function (e) {

                _previousTime = new Date();

                _diagramMouseDown = true;



                if (_timeOutId !== null) {

                    window.clearTimeout(_timeOutId);

                    _timeOutId = null;

                }

                __diagramClick(e);



                document.addEventListener('touchmove', __documentMouseMove, false);

                document.addEventListener('touchend', function (e) {

                    _diagramMouseDown = false;

                    _previousMouseCoords = null;

                    _canvas.removeEventListener('touchmove');

                    _canvas.removeEventListener('touchend');

                    _previousTime = null;

                    __stopDiagramDragRotate();

                }, false);



                return false;

            }, false);

        }

        else {

			/*document.getElementById("instructionsLink").onclick = function () {

				if (document.getElementById("instructionsContent").style.display === "block") {

					document.getElementById("instructionsContent").style.display = "none";

				}

				else {

					document.getElementById("instructionsContent").style.display = "block";

				}

			};*/



            _canvas.onclick = __diagramClick;



            document.getElementById("playMessiaenChordButton").onclick = function () { __playChordClick(); };

            document.getElementById("clearMessiaenChordButton").onclick = function () { _selectedPitches = []; _requireRedraw = true; };



            _canvas.onmousedown = function () {

                _previousTime = new Date();

                _diagramMouseDown = true;



                if (_timeOutId !== null) {

                    window.clearTimeout(_timeOutId);

                    _timeOutId = null;

                }



                _canvas.style.cursor = "pointer";



                document.onmousemove = __documentMouseMove;

                document.onmouseup = function () {

                    _canvas.style.cursor = "default";

                    document.documentElement.style.cursor = "default";

                    _diagramMouseDown = false;

                    _previousMouseCoords = null;

                    document.onmousemove = function () { };

                    document.onmouseup = function () { };

                    _previousTime = null;

                    __stopDiagramDragRotate();

                };



                return false;

            };

        }



        _requireRedraw = true;

        window.setInterval(function () { __drawScene(_rotation); }, 25);

    };



    var __stopDiagramDragRotate = function () {

        if (_pixelsPerMillisecond > 1 || _pixelsPerMillisecond < -1) {

            _timeOutId = setTimeout(function () {



                _rotation -= (1 / 1024) * _pixelsPerMillisecond;

                if (_rotation < 0) {

                    _rotation = 2 + _rotation;

                }

                else if (_rotation >= 2) {

                    _rotation = _rotation - 2;

                }

                _requireRedraw = true;



                _pixelsPerMillisecond *= 0.992;

                __stopDiagramDragRotate();

            }, 1);

        }

        else {

            _timeOutId = null;

            _pixelsPerMillisecond = 0;

        }

    };



    methods.getPitchObjects = function () {

        return _pitchObjects;

    };



    var __clearScene = function () {

        _canvas.width = _canvas.width;

        _highlightedPitches = [];

        _pitchObjects = [];

        _modeListBoundingBoxes = [];

    };



    var __createMatrixIdentity = function () { return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; };



    var __drawScene = function (rotation) {

        if (_requireRedraw) {

            _requireRedraw = false;

            __clearScene();



            var _center = { x: _canvas.width / 2, y: _canvas.height / 2 };

            var radius = (_canvas.height / 2) - 50;



            // Pitches

            __drawPitches(_rotation, _center, radius);



            // Reset

            _context.setTransform(1, 0, 0, 1, 0, 0);



            // Connecting highlighted lines

            _context.beginPath();


            if (_highlightedPitches.length > 1) {

                _context.strokeStyle = "#" + _colors.modeShape;

                _context.lineWidth = 4;



                _context.moveTo(_pitchObjects[_highlightedPitches[0]].lineTransformationMatrix[2][0], _pitchObjects[_highlightedPitches[0]].lineTransformationMatrix[2][1]);



                var j = _highlightedPitches.length - 1;

                while (j >= 0) {

                    _context.lineTo(_pitchObjects[_highlightedPitches[j]].lineTransformationMatrix[2][0], _pitchObjects[_highlightedPitches[j]].lineTransformationMatrix[2][1]);

                    j--;

                }



                _context.stroke();

            }



            _context.closePath();



            // Reset

            _context.setTransform(1, 0, 0, 1, 0, 0);



            // Circle

            _context.beginPath();

            _context.strokeStyle = "#" + _colors.circle;

            _context.lineWidth = 5;



            _context.arc(_center.x, _center.y, radius, 0, Math.PI * 2, false);

            _context.stroke();

            _context.closePath();



            // Reset

            _context.setTransform(1, 0, 0, 1, 0, 0);



            // Connecting selected lines

            _context.beginPath();


            if (_selectedPitches.length > 1) {

                _context.strokeStyle = "#" + _colors.chordShape;

                _context.lineWidth = 2;



                _context.moveTo(_pitchObjects[_selectedPitches[0]].lineTransformationMatrix[2][0], _pitchObjects[_selectedPitches[0]].lineTransformationMatrix[2][1]);



                var j = 1;

                while (j < _selectedPitches.length) {

                    _context.lineTo(_pitchObjects[_selectedPitches[j]].lineTransformationMatrix[2][0], _pitchObjects[_selectedPitches[j]].lineTransformationMatrix[2][1]);

                    j++;

                }



                _context.stroke();

            }



            _context.closePath();



            _requireRedraw = false;

        }

    };



    var __drawPitches = function (rotation, center, radius) {

        _context.beginPath();



        _context.font = "300 24px Roboto, Arial, Helvetica, sans-serif";

        _context.fillStyle = "#" + _colors.defaultText;

        _context.textAlign = "center";



        var mode = _modes[_currentModeIndex];

        var scaleDegree = _currentKeyIndex;

        _highlightedPitches.push(scaleDegree);

        for (var i = 0, length = mode.construction.length; i < length; i++) {

            scaleDegree = scaleDegree + mode.construction[i];

            scaleDegree = (scaleDegree >= 12) ? scaleDegree - 12 : scaleDegree;

            _highlightedPitches.push(scaleDegree);

        }



        for (var i = 0, length = _pitches.length; i < length, pitch = _pitches[i]; i++) {



            if (_highlightedPitches.indexOf(i) !== -1) {

                _context.fillStyle = "#" + _colors.selectedText;

            }

            else {

                _context.fillStyle = "#" + _colors.defaultText;

            }



            if (_selectedPitches.indexOf(i) !== -1) {

                _context.fillStyle = "#" + _colors.highlightedText;
            }

            else {

            }



            var x = Math.round(Math.cos((i + 10) * Math.PI / 6) * radius);

            var y = Math.round(Math.sin((i + 10) * Math.PI / 6) * radius);



            var transformationMatrix = null;



            // Calculate matrix for pitch labels

            __setTransform(1, 0, 0, 1, center.x, center.y);

            __scale(1.06, 1.06);

            __rotate(rotation * Math.PI);

            __translate(x, y);

            __rotate((i + 1) * Math.PI / 6);



            if (BrowserDetect.browser !== "Safari") {

                _context.fillText(pitch, 0, 0);

            }

            else {

                _context.strokeText(pitch, 0, 0);

            }

            _pitchTransformationMatrix = _currentTransformationMatrix;



            // Calculate matrix for connecting lines

            __setTransform(1, 0, 0, 1, center.x, center.y);

            __scale(0.973, 0.973);

            __rotate(rotation * Math.PI);

            __translate(x, y);

            __rotate((i + 1) * Math.PI / 6);

            _lineTransformationMatrix = _currentTransformationMatrix;



            _pitchObjects.push({ pitchIndex: i, pitchTransformationMatrix: _pitchTransformationMatrix, lineTransformationMatrix: _lineTransformationMatrix });

        }

        _context.closePath();

    };



    methods.getPitches = function () {

        return _pitchObjects;

    };



    var __setTransform = function (m11, m21, m12, m22, dx, dy) {

        _context.setTransform(m11, m21, m12, m22, dx, dy);



        _currentTransformationMatrix = [[m11, m12, 0],

            [m21, m22, 0],

            [dx, dy, 1]];

    };



    var __scale = function (aX, aY) {

        _context.scale(aX, aY);



        var m = [[aX, 0, 0],

            [0, aY, 0],

            [0, 0, 1]];



        _currentTransformationMatrix = __matrixMultiply(m, _currentTransformationMatrix);

    };



    var __rotate = function (angle) {

        _context.rotate(angle);



        var m = [[Math.cos(angle), Math.sin(angle), 0],

            [-Math.sin(angle), Math.cos(angle), 0],

            [0, 0, 1]];



        _currentTransformationMatrix = __matrixMultiply(m, _currentTransformationMatrix);

    };



    var __translate = function (x, y) {

        _context.translate(x, y);



        var m = [[1, 0, 0],

            [0, 1, 0],

            [x, y, 1]];



        _currentTransformationMatrix = __matrixMultiply(m, _currentTransformationMatrix);

    };



    var __getMouseCoords = function (e, relativeToCanvas) {

        var x;

        var y;

        if (e.touches !== undefined) {

            x = e.touches[0].pageX + document.body.scrollLeft +

            document.documentElement.scrollLeft;

            y = e.touches[0].pageY + document.body.scrollTop +

            document.documentElement.scrollTop;

        }

        else {

            if (e.pageX != undefined && e.pageY != undefined) {

                x = e.pageX;

                y = e.pageY;

            }

            else {

                x = e.clientX + document.body.scrollLeft +

                document.documentElement.scrollLeft;

                y = e.clientY + document.body.scrollTop +

                document.documentElement.scrollTop;

            }

        }



        if (relativeToCanvas) {

            x -= _canvas.offsetLeft;

            y -= _canvas.offsetTop;

        }



        return { x: x, y: y };

    };



    var __documentMouseMove = function (e) {

        if (e.touches !== undefined) {

            if (e.touches.length === 1) {

                e.preventDefault();

            }

        }

        else {

            e.preventDefault();

        }



        if (_diagramMouseDown) {

            document.documentElement.style.cursor = "pointer";

            var coords = __getMouseCoords(e, false);



            if (_previousMouseCoords === null) {

                _previousMouseCoords = coords;

            }



            var dx = _previousMouseCoords.x - coords.x;

            var dy = _previousMouseCoords.y - coords.y;



            var midPointY = _canvas.offsetTop + (_canvas.height / 2);

            var midPointX = _canvas.offsetLeft + (_canvas.width / 2);



            if (coords.y > midPointY) {

                dx *= -1;

            }

            if (coords.x < midPointX) {

                dy *= -1;

            }



            var change = (Math.abs(dx) > Math.abs(dy)) ? dx : dy;



            _pixelsPerMillisecond = change / ((new Date() - _previousTime));



            _rotation -= (1 / 1024) * change;

            if (_rotation < 0) {

                _rotation = 2 + _rotation;

            }

            else if (_rotation >= 2) {

                _rotation = _rotation - 2;

            }



            _previousMouseCoords = coords;



            _requireRedraw = true;

            __drawScene(_rotation);



            _previousTime = new Date();

        }

    };



    var __diagramMouseMove = function (e) {

        if (!_diagramMouseDown) {

            var coords = __getMouseCoords(e, true);

        }

    };



    var __diagramClick = function (e) {

        if (_timeOutId === null) {

            var coords = __getMouseCoords(e, true);



            for (var i = 0, length = _pitchObjects.length; i < length, pitchObject = _pitchObjects[i]; i++) {

                if (coords.x <= pitchObject.pitchTransformationMatrix[2][0] + 30 && coords.x >= pitchObject.pitchTransformationMatrix[2][0] - 30

                    && coords.y <= pitchObject.pitchTransformationMatrix[2][1] + 30 && coords.y >= pitchObject.pitchTransformationMatrix[2][1] - 30) {



                    if (_highlightedPitches.indexOf(pitchObject.pitchIndex) !== -1 && _selectedPitches.indexOf(pitchObject.pitchIndex) === -1) {



                        _selectedPitches.push(pitchObject.pitchIndex);

                        _requireRedraw = true;



                        messiaen.audio.loadPitch(_pitches[pitchObject.pitchIndex]);

                    }

                    else if (_selectedPitches.indexOf(pitchObject.pitchIndex) !== -1) {

                        _selectedPitches.splice(_selectedPitches.indexOf(pitchObject.pitchIndex), 1);

                        _requireRedraw = true;

                    }

                }

            }

        }

    };



    var __diagramKeyPress = function (e) {

        var e = e || window.event;

        var keyCode = e.keyCode || e.which;



        switch (keyCode) {

            case 37:

                _rotation -= 1 / 128;

                if (_rotation < 0) {

                    _rotation = 2 + _rotation;

                }

                _requireRedraw = true;

                break;

            case 40:

                _selectedPitches = [];



                _currentModeIndex = (_currentModeIndex < 6) ? _currentModeIndex + 1 : 0;

                _requireRedraw = true;

                break;

            case 39:

                _rotation += 1 / 128;



                if (_rotation >= 2) {

                    _rotation = _rotation - 2;

                }

                _requireRedraw = true;

                break;

            case 38:

                _selectedPitches = [];



                _currentModeIndex = (_currentModeIndex > 0) ? _currentModeIndex - 1 : 6;

                _requireRedraw = true;

                break;

        }

    };



    var __animateRotation = function (previousKeyIndex) {

        var index = previousKeyIndex;

        var spanCount = 0;

        while (index != _currentKeyIndex) {

            spanCount++;

            index++;

            if (index === 12) {

                index = 0;

            }

        }



        for (var i = 0, length = _pitchAngleRanges.length; i < length, pitchAngle = _pitchAngleRanges[i]; i++) {

            if (pitchAngle.pitchIndex === _currentKeyIndex) {

                if (_rotation < pitchAngle.middle - 1 / 64 || _rotation > pitchAngle.middle + 1 / 64) {

                    if (spanCount <= 6) {

                        _rotation -= 1 / 64;

                        if (_rotation < 0) {

                            _rotation = 2 + _rotation;

                        }

                    }

                    else {

                        _rotation += 1 / 64;

                        if (_rotation >= 2) {

                            _rotation = _rotation - 2;

                        }

                    }

                    _requireRedraw = true;



                    setTimeout(function () { __animateRotation(previousKeyIndex); }, 1);

                }

                break;

            }

        }

    };



    var __playChordClick = function () {

        var chord = [];

        for (var k = 0, length = _selectedPitches.length; k < length; k++) {

            chord.push(_pitches[_selectedPitches[k]]);

        }

        messiaen.audio.playChord(chord);

    };



    var __matrixMultiply = function (m1, m2) {

        var result = __createMatrixIdentity();



        for (var x = 0; x < 3; x++) {

            for (var y = 0; y < 3; y++) {

                var sum = 0;



                for (var z = 0; z < 3; z++) {

                    sum += m1[x][z] * m2[z][y];

                }



                result[x][y] = sum;

            }

        }

        return result;

    };



    return methods;

} ();



window.onload = function () { messiaen.diagram.initialise(); };