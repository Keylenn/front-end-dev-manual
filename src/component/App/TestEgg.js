import React from "react";
import {Button} from "antd";
import {asyncGet, asyncPost, asyncRequest} from '../../service/axios';

export default class TestEgg extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    asyncGet("/")
      .then(res => console.log('res_get', res));
  }
  handleClickOnTestPost = ()=>{
    asyncRequest({
      method: 'post',
      url: '/home',
      params: {
        firstName: 'Keylenn',
        lastName: 'HE'
      }
    })
      .then(res=>{
        console.log('res_post', res)
      });
  }
  render(){
    const style = {
      init: {
        marginLeft: '1rem'
      }
    }
    return (
      <Button type="primary"
              style={style.init}
              onClick={this.handleClickOnTestPost}>
        postWithCsrfToken
      </Button>
    ) ;
  }
}

