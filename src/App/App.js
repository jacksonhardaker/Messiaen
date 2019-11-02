import React from 'react';
import ReactDOM from 'react-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

const App = ({ title }) => {
  return (
    <>
      <SiteHeader {...{ title }}/>
      <main></main>
      <SiteFooter />
    </>
  );
};

export const renderApp = (domElement, props) => {
  ReactDOM.render(<App {...props} />, domElement);
};

export default App;
