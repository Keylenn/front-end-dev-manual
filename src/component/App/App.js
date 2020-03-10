import React from 'react';
import css from 'styled-jsx/css';
import { useDocumentTitle } from 'utils/custom-hooks';
import CirNavItem from 'component/UI/CirNav/Item';
import { resolveCompdStyles } from 'utils/helper';
import allCompStyles from './compStyles';

const { compClass, compStyles } = resolveCompdStyles(allCompStyles);

export default function App() {
  useDocumentTitle('frontend dev manual');
  return(
    <>
      {/* <div className="app">
        Hello, Welcome to frontend dev manual~~
      </div> */}
      <CirNavItem 
        bgColor="#f1eaff"
        className={`item ${compClass}`}
      />
       <CirNavItem 
        bgColor="#f1eaff"
        className={`item2 ${compClass}`}
      />
      <style jsx>{staticStyle}</style>
      {compStyles}
    </>
  );
}


const staticStyle = css`
  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    font-size: 20px; /*no*/
  }
`;


