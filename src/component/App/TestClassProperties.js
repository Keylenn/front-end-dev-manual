import React, {Component} from "react";

class TestClassProperties extends Component {
  state={
    canUseClassNewProperties: 'ojbk'
  }
  render(){
    return <h5>{this.state.canUseClassNewProperties}</h5>
  }
}

export default TestClassProperties;