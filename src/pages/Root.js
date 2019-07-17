import React from 'react';
import {HashRouter, Route, Link} from 'react-router-dom';
import Nav from 'component/Nav/Nav';
import PagesApp from './App';
import useAsyncComponent from 'utils/custom-hooks';


export default function PagesRoot() {
  return (
    <HashRouter>
      <>
        <Nav />
        <Route exact path='/' component={PagesApp}/>
        <Route path='/test' component={useAsyncComponent(
          () => import(/* webpackChunkName: 'page-test' */'./TestAsync')
        )}
        />
      </>
    </HashRouter>
  );
}