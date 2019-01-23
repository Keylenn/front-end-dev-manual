import React from "react";
import {Button} from "antd";
import {asyncGet, asyncPost, asyncRequest} from '../../service/axios';

export default class TestCRUD extends React.Component{
  constructor(props){
    super(props);
  }
  handleOnClickIndexBtn = ()=>{
    asyncGet("/users")
      .then(res => console.log('res_crud_index', res));
  }
  handleOnClickShowBtn = ()=>{
    asyncGet("/users/10005")
      .then(res => console.log('res_crud_show', res));
  }
  handleOnClickCreateBtn = ()=>{
    asyncPost("./users", {
      name: 'hjl',
      phone_number: '18812341234'
    })
      .then(res => console.log('res_crud_create', res));
  }
  handleOnClickUpdateBtn = ()=>{
    asyncRequest({
      method: 'put',
      url: '/users/10002',
      params: {
        systemid: 10002,
        phone_number: '18812231234'
      }
    })
      .then(res => console.log('res_crud_update', res));
  }
  handleOnClickDelBtn = ()=>{
    asyncRequest({
      method: 'delete',
      url: '/users/10002',
      params: {
        systemid: 10002,
      }
    })
      .then(res => console.log('res_crud_del', res));
  }
  render(){
    const style = {
      section:{
        display: 'flex'
      },
      btn: {
        marginTop: '1rem',
        marginLeft: '1rem'
      }
    }
    return (
      <section style={style.section}>
        <Button type="primary"
                style={style.btn}
                onClick={this.handleOnClickIndexBtn}>
          testIndex
        </Button>
        <Button type="primary"
                style={style.btn}
                onClick={this.handleOnClickShowBtn}>
          testShow
        </Button>
        <Button type="primary"
                style={style.btn}
                onClick={this.handleOnClickCreateBtn}>
          testCreate
        </Button>
        <Button type="primary"
                style={style.btn}
                onClick={this.handleOnClickUpdateBtn}>
          testUpdate
        </Button>
        <Button type="primary"
                style={style.btn}
                onClick={this.handleOnClickDelBtn}>
          testDel
        </Button>
      </section>
    ) ;
  }
}

