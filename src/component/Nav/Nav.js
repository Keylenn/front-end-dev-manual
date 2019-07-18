import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

export default function Nav(props) {
    const hash = window.location.hash;
    const matchRes = hash.match(/(?<=(#\/))\w+(?=(\W))?/); //预搜索
    const key = matchRes ? matchRes[0] : 'home';
    const [current, setCurrent] = useState(key);
    const handleClickMenu = useCallback((e) => {
        setCurrent(e.key)
    })
    return(
        <Menu onClick={handleClickMenu} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="home">
                <Link to='/'>App</Link>
            </Menu.Item>
            <Menu.Item key="about">
                <Link to='/about'>About</Link>
            </Menu.Item>
        </Menu>
    );
}