import React from 'react';
import ExternalLink from './links/ExternalLink';

const Quote = () => {
  return (
    <blockquote cite='https://en.wikipedia.org/wiki/Modes_of_limited_transposition'>
      ...musical modes or scales that fulfill specific criteria relating to their symmetry and the repetition of their interval groups.
      <footer>
        <cite>
          <ExternalLink href='https://en.wikipedia.org/wiki/Modes_of_limited_transposition'>Wikipedia</ExternalLink>
        </cite>
      </footer>
    </blockquote>
  );
};

export default Quote;
