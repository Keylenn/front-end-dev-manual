import React from 'react';
import css from 'styled-jsx/css';
import { useDocumentTitle } from 'utils/custom-hooks';

export default function App() {
  useDocumentTitle('frontend dev manual');
  return(
    <>
      <div className="app">
        hello, frontend dev manual~
      </div>
      <style jsx>{staticStyle}</style>
    </>
  );
}


const staticStyle = css`
  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 20px; /*no*/
  }
`;