import React, { PureComponent } from 'react';

export default class Audio extends PureComponent{
  componentDidMount(){
    const {src} = this.props;
    console.log(123456);
    if(src){
      console.log(src);
      const theAudio = this.audioValue;
      console.log(theAudio);
      theAudio.src = '';
      theAudio.src = src;
      theAudio.load();
    }
  }

  render(){
    return (
      <audio ref={(audio) => { this.audioValue = audio; }} controls preload="none" controlsList="nodownload" >
        <track kind="captions" />
        您的浏览器不支持 audio 元素。
      </audio>
    )
  }
}