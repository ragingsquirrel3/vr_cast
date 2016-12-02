import React from 'react';
import { Route  } from 'react-router';

// import About from './containers/about';
// import Help from './containers/help';
// import Home from './containers/home';
// import Layout from './containers/layout';
// import Search from './containers/search';

import viz from './components/viz';

export default (
  <Route component={viz} path='/' />
);
