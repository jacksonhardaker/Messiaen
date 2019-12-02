import React from 'react';
import ReactDOM from 'react-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Quote from './components/Quote';
import DiagramContainer from './components/diagram/DiagramContainer';
import MessiaenProvider from './context/MessiaenContext';
// import Instructions from './components/Instructions';

const App = ({ title }) => {
  return (
    <MessiaenProvider>
      <SiteHeader {...{ title }}/>
      <main>
        <Quote />
        {/* <Instructions /> */}
        <DiagramContainer />
      </main>
      <SiteFooter />
    </MessiaenProvider>
  );
};

export const renderApp = (domElement, props) => {
  ReactDOM.render(<App {...props} />, domElement);
};

export default App;
