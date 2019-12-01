import React from 'react';

const SiteFooter = () => {
  return (
    <footer>
      <p>&copy; 2011</p>
      <div>
        <p>Created by</p>
        <a href='http://www.syberenvanmunster.com/' target='_blank' rel='noopener noreferrer'>Syberen van Munster</a>
        <span> and </span>
        <a href='http://www.jacksonhardaker.com' target='_blank' rel='noopener noreferrer'>Jackson Hardaker</a>.
      </div>

      <style jsx>{`
          footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 50px 0;
          }
          div {
            text-align: center;
          }
          p {
            margin: 0;
          }
      `}</style>
    </footer>
  );
};

export default SiteFooter;
