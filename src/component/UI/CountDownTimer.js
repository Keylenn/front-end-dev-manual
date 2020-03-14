/*
 * @Description: 
 * @Author: hejilun
 * @Date: 2020-03-14 15:00:07
 * @LastEditors: hejilun
 * @LastEditTime: 2020-03-14 21:20:43
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import css from 'styled-jsx/css';

 export default function CountDownTimer({
   endTime,
   onEnd,
 }) {
   const initTime = formatTimeStamp ( getCountDownTimeStamp(endTime) );
   const [time, setTime] = useState(initTime);
   const [delay, setDelay] = useState(100);
   const [isRunning, setIsRunning] = useState(true);

   useInterval(()=>{
      const countDown = getCountDownTimeStamp(endTime);
      if( countDown <= 0 ) {
         setIsRunning(false);
         onEnd && onEnd();
      }
      setTime( formatTimeStamp ( countDown ) )
   }, isRunning ? delay : null)
   
   return (
      <>
        <div>
        <span>{time.hours}: </span>
        <span>{time.minute}: </span>
        <span>{time.second}: </span>
        <span>{time.millisecond}</span>
        </div>
        <style jsx>{staticStyle}</style>
      </>
   )
 }

 const staticStyle = css`
   span {
      width: 100px;
      /* padding: 10px; */
      background: #333;
      /* margin: 10px; */
      color: #fff;
      text-align: center;
   }
`;


 function useInterval(callback, delay=1000) {
   let { current: savedCallback } = useRef();
 
   // Remember the latest callback.
   useEffect(() => {
     savedCallback = callback;
   });
 
   // Set up the interval.
   useEffect(() => {
     function tick() {
       savedCallback();
     }
     if (delay !== null) {
       let id = setInterval(tick, delay);
       return () => clearInterval(id);
     }
   }, [delay]);
 }


 function getCountDownTimeStamp(endTime) {
   return endTime - new Date().getTime();
 }

 function fixZeroToNum(num=0, digit=2) {
    const numToStr = `${num}`;
   return `${numToStr.length < digit ? numToStr.replace(/^(?=\d)?/g, '0') : numToStr}`;
 }

 function formatTimeStamp(timeStamp) {
    const defaultTime = {
      hours: '00',
      minute: '00',
      second: '00',
      millisecond: '000'
    }
   if( timeStamp <= 0 ) return defaultTime;

   const hours = Number.parseInt(timeStamp / 1000 / 60 / 60, 10);
   const minute = Number.parseInt((timeStamp / 1000 / 60) % 60, 10);
   const second = Number.parseInt((timeStamp / 1000) % 60, 10);
   const millisecond = Number.parseInt(timeStamp % 1000, 10);

   return Object.assign({}, {...defaultTime}, {
      hours: fixZeroToNum(hours),
      minute: fixZeroToNum(minute),
      second: fixZeroToNum(second),
      millisecond: fixZeroToNum(millisecond, 3)
   })
 }