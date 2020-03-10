import React from 'react';
import css from 'styled-jsx/css';

export default function CirNavItem({
    center = '',
    emoj ='',
    title = '666',
    bgColor= '#fff',
    className='',
}) {
  return(
    <>
      <div className={`item-box ${className}`}
        
      >
        {title}
      </div>
      <style jsx>{`
        .item-box {
            background: ${bgColor} 
        }
      `}</style>
      <style jsx>{staticStyle}</style>
    </>
  );
}



const staticStyle = css`
  .item-box  {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 24px;
  }
`;
