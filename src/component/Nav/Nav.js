import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

export default function Nav(props) {
    const [current, setCurrent] = useState('home');
    const handleClickMenu = useCallback((e) => {
        setCurrent(e.key)
    })
    return(
        <Menu onClick={handleClickMenu} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="home">
                <Link to='/'>App</Link>
            </Menu.Item>
            <Menu.Item key="about">
                <Link to='/about'>TestAsync</Link>
            </Menu.Item>
        </Menu>
    );
}