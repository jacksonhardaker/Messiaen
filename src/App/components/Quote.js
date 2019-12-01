import React from 'react';
import ExternalLink from './links/ExternalLink';

const Quote = () => {
  return (
    <div className='container'>
      <div className='row'>
        <blockquote className='column column-50 column-offset-25' cite='https://en.wikipedia.org/wiki/Modes_of_limited_transposition'>
          <span>...musical modes or scales that fulfill specific criteria relating to their symmetry and the repetition of their interval groups.</span>
          <footer>
            <cite>
              <ExternalLink href='https://en.wikipedia.org/wiki/Modes_of_limited_transposition'>Wikipedia</ExternalLink>
            </cite>
          </footer>
        </blockquote>
      </div>
      <style jsx>{`
        div.container {
          padding-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Quote;
