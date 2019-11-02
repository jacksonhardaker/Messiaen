import './js/browser-detect.js';
import './js/matrix-calculations.js';
import './js/messiaen.audio.js';
import './js/messiaen.diagram.js';

import 'milligram/dist/milligram.min.css';
import './scss/typography.scss';
import './scss/base.scss';
import { renderApp } from './App/App.js';

const meta = document.querySelector('meta[name=messiaen]').dataset;
renderApp(document.getElementById('app'), meta);
