var messiaen = (messiaen) ? messiaen : {};

import browserDetect from './browser-detect.js';
import { matrix } from './matrix-calculations.js';
import messiaenAudio from './messiaen.audio.js';
import { offBlack, white, purple } from '../App/constants/colors.js';

messiaen.diagram = function() {

  var methods = {};

  const lineWidth = {
    shape: 4,
    selection: 2,
    circle: 2,
    text: 4
  };

  var _colors = {
    circle: offBlack,
    defaultText: offBlack,
    selectedText: white,
    highlightedText: purple,
    modeShape: white,
    chordShape: purple,
  };

  var _pitchAngleRanges = [
    { pitchIndex: 11, lower: -1 / 12, upper: 1 / 12, middle: 0 },
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
    { pitchIndex: 0, lower: 21 / 12, upper: 23 / 12, middle: 22 / 12 }
  ];

  var _modes = [
    { name: 'First mode / Whole-tone scale', construction: [2, 2, 2, 2, 2] },
    { name: 'Second mode / Diminished scale', construction: [1, 2, 1, 2, 1, 2, 1] },
    { name: 'Third mode', construction: [2, 1, 1, 2, 1, 1, 2, 1] },
    { name: 'Fourth mode', construction: [1, 1, 3, 1, 1, 1, 3] },
    { name: 'Fifth mode', construction: [1, 4, 1, 1, 4] },
    { name: 'Sixth mode', construction: [2, 2, 1, 1, 2, 2, 1] },
    { name: 'Seventh mode', construction: [1, 1, 1, 2, 1, 1, 1, 1, 2] }
  ];

  var _canvas = null;
  var _context = null;
  var _pitchTransformationMatrix = null;
  var _lineTransformationMatrix = null;
  var _pitchObjects = [];
  var _highlightedPitches = [];
  var _selectedPitches = [];
  var _currentKeyIndex = 11;
  var _currentModeIndex = 0;
  var _rotation = 0;
  var _diagramMouseDown = false;
  var _previousMouseCoords = null;
  var _requireRedraw = false;
  var _previousTime = null;
  var _pixelsPerMillisecond = 0;
  var _timeOutId = null;

  methods.initialise = function() {

    browserDetect.init();
    messiaenAudio.initialise();

    _canvas = document.getElementById('messiaenDiagram');
    _canvas.width = document.documentElement.clientHeight - 170;
    _canvas.height = document.documentElement.clientHeight - 170;
    _context = _canvas.getContext('2d');

    var modeSelect = document.getElementById('modeSelect');
    modeSelect.selectedIndex = 0;
    modeSelect.onchange = function() {

      var l = document.getElementById('modeSelect');
      _currentModeIndex = Number(l.children[l.selectedIndex].value);
      _selectedPitches = [];
      _requireRedraw = true;
    };

    var keySelect = document.getElementById('keySelect');
    keySelect.selectedIndex = 0;
    keySelect.onchange = function() {

      var previousKeyIndex = _currentKeyIndex;
      var l = document.getElementById('keySelect');
      _currentKeyIndex = Number(l.children[l.selectedIndex].value);
      _selectedPitches = [];
      __animateRotation(previousKeyIndex);
    };

    if ('ontouchstart' in document.documentElement) {

      document.getElementById('playMessiaenChordButton').addEventListener('touchstart', function() { messiaenAudio.buildAndPlayChord(_selectedPitches); return false; }, false);
      document.getElementById('clearMessiaenChordButton').addEventListener('touchstart', function() { _selectedPitches = []; _requireRedraw = true; return false; }, false);
      document.getElementById('downloadMessiaenDiagramButton').addEventListener('touchstart', function() { this.href = _canvas.toDataURL(); this.download = 'messiaen-diagram-' + new Date().getTime(); }, false);

      _canvas.addEventListener('touchstart', function(e) {

        _previousTime = new Date();
        _diagramMouseDown = true;

        if (_timeOutId !== null) {
          window.clearTimeout(_timeOutId);
          _timeOutId = null;
        }

        __diagramClick(e);

        document.addEventListener('touchmove', __documentMouseMove, false);
        document.addEventListener('touchend', function() {

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

      _canvas.onclick = __diagramClick;
      document.getElementById('playMessiaenChordButton').onclick = function() { messiaenAudio.buildAndPlayChord(_selectedPitches); };
      document.getElementById('clearMessiaenChordButton').onclick = function() { _selectedPitches = []; _requireRedraw = true; };
      document.getElementById('downloadMessiaenDiagramButton').onclick = function() { this.href = _canvas.toDataURL(); this.download = 'messiaen-diagram-' + new Date().getTime(); };

      _canvas.onmousedown = function() {

        _previousTime = new Date();
        _diagramMouseDown = true;

        if (_timeOutId !== null) {
          window.clearTimeout(_timeOutId);
          _timeOutId = null;
        }

        _canvas.style.cursor = 'pointer';
        document.onmousemove = __documentMouseMove;

        document.onmouseup = function() {

          _canvas.style.cursor = 'default';
          document.documentElement.style.cursor = 'default';
          _diagramMouseDown = false;
          _previousMouseCoords = null;
          document.onmousemove = function() { };
          document.onmouseup = function() { };
          _previousTime = null;
          __stopDiagramDragRotate();
        };

        return false;
      };
    }

    _requireRedraw = true;
    window.setInterval(function() { __drawScene(_rotation); }, 25);
  };

  var __stopDiagramDragRotate = function() {

    if (_pixelsPerMillisecond > 1 || _pixelsPerMillisecond < -1) {

      _timeOutId = setTimeout(function() {

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



  methods.getPitchObjects = function() {
    return _pitchObjects;
  };

  var __clearScene = function() {

    // Rendering breaks without this ¯\_(ツ)_/¯
    // eslint-disable-next-line no-self-assign
    _canvas.width = _canvas.width;

    _highlightedPitches = [];
    _pitchObjects = [];
  };

  var __drawScene = function() {

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

        _context.strokeStyle = _colors.modeShape;
        _context.lineWidth = lineWidth.shape;
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
      _context.strokeStyle = _colors.circle;
      _context.lineWidth = lineWidth.circle;

      _context.arc(_center.x, _center.y, radius, 0, Math.PI * 2, false);
      _context.stroke();
      _context.closePath();

      // Reset
      _context.setTransform(1, 0, 0, 1, 0, 0);

      // Connecting selected lines
      _context.beginPath();

      if (_selectedPitches.length > 1) {

        _context.strokeStyle = _colors.chordShape;
        _context.lineWidth = lineWidth.selection;
        _context.moveTo(_pitchObjects[_selectedPitches[0]].lineTransformationMatrix[2][0], _pitchObjects[_selectedPitches[0]].lineTransformationMatrix[2][1]);

        j = 1;
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



  var __drawPitches = function(rotation, center, radius) {

    _context.beginPath();
    _context.font = '200 24px "Libre Franklin", sans-serif';
    _context.fillStyle = _colors.defaultText;
    _context.textAlign = 'center';

    var mode = _modes[_currentModeIndex];
    var scaleDegree = _currentKeyIndex;

    _highlightedPitches.push(scaleDegree);

    for (var i = 0, length = mode.construction.length; i < length; i++) {

      scaleDegree = scaleDegree + mode.construction[i];
      scaleDegree = (scaleDegree >= 12) ? scaleDegree - 12 : scaleDegree;
      _highlightedPitches.push(scaleDegree);
    }

    messiaenAudio.pitches.forEach((pitch, i) => {
      if (_highlightedPitches.indexOf(i) !== -1) {
        _context.fillStyle = _colors.selectedText;
      }
      else {
        _context.fillStyle = _colors.defaultText;
      }

      if (_selectedPitches.indexOf(i) !== -1) {
        _context.fillStyle = _colors.highlightedText;
      }

      var x = Math.round(Math.cos((i + 10) * Math.PI / 6) * radius);
      var y = Math.round(Math.sin((i + 10) * Math.PI / 6) * radius);

      // Calculate matrix for pitch labels
      matrix.setTransformOrigin(_context, 1, 0, 0, 1, center.x, center.y);
      matrix.scale(_context, 1.06, 1.06);
      matrix.rotate(_context, rotation * Math.PI);
      matrix.translate(_context, x, y);
      matrix.rotate(_context, (i + 1) * Math.PI / 6);

      if (browserDetect.browser !== 'Safari') {
        _context.fillText(pitch, 0, 0);
      }
      else {
        _context.strokeText(pitch, 0, 0);
      }

      _pitchTransformationMatrix = matrix.currentTransformationMatrix();

      // Calculate matrix for connecting lines
      matrix.setTransformOrigin(_context, 1, 0, 0, 1, center.x, center.y);
      matrix.scale(_context, 0.973, 0.973);
      matrix.rotate(_context, rotation * Math.PI);
      matrix.translate(_context, x, y);
      matrix.rotate(_context, (i + 1) * Math.PI / 6);

      _lineTransformationMatrix = matrix.currentTransformationMatrix();
      _pitchObjects.push({ pitchIndex: i, pitchTransformationMatrix: _pitchTransformationMatrix, lineTransformationMatrix: _lineTransformationMatrix });
    });
    _context.closePath();
  };



  methods.getPitches = function() {
    return _pitchObjects;
  };

  var __getMouseCoords = function(e, relativeToCanvas) {

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

    return { x, y };
  };



  var __documentMouseMove = function(e) {

    if (e.touches !== undefined) {
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    }
    else {
      e.preventDefault();
    }

    if (_diagramMouseDown) {
      document.documentElement.style.cursor = 'pointer';
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

  var __diagramClick = function(e) {

    if (_timeOutId === null) {
      var coords = __getMouseCoords(e, true);

      _pitchObjects.forEach((pitchObject) => {
        if (coords.x <= pitchObject.pitchTransformationMatrix[2][0] + 30 && coords.x >= pitchObject.pitchTransformationMatrix[2][0] - 30
          && coords.y <= pitchObject.pitchTransformationMatrix[2][1] + 30 && coords.y >= pitchObject.pitchTransformationMatrix[2][1] - 30) {

          if (_highlightedPitches.indexOf(pitchObject.pitchIndex) !== -1 && _selectedPitches.indexOf(pitchObject.pitchIndex) === -1) {

            _selectedPitches.push(pitchObject.pitchIndex);
            _requireRedraw = true;
            messiaenAudio.preLoadPitch(messiaenAudio.pitches[pitchObject.pitchIndex]);
          }
          else if (_selectedPitches.indexOf(pitchObject.pitchIndex) !== -1) {

            _selectedPitches.splice(_selectedPitches.indexOf(pitchObject.pitchIndex), 1);
            _requireRedraw = true;
          }
        }
      });
    }
  };

  var __animateRotation = function(previousKeyIndex) {

    var index = previousKeyIndex;
    var spanCount = 0;

    while (index != _currentKeyIndex) {
      spanCount++;
      index++;

      if (index === 12) {
        index = 0;
      }
    }

    _pitchAngleRanges.some((pitchAngle) => {
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

          setTimeout(function() { __animateRotation(previousKeyIndex); }, 1);
        }

        return true;
      }
    });
  };

  return methods;
}();

window.onload = function() { messiaen.diagram.initialise(); };
