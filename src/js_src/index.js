/*eslint-disable indent, quotes */
// import React from 'react';
// import { render } from 'react-dom';

// import ReactApp from './reactApplication';

// function initApp () {
//   render(<ReactApp />, document.getElementById('app'));
// }

// window.addEventListener('load', initApp);
var htmlString = "<a-box id='box' position='-1 0.5 -3' rotation='0 45 0' color='#4CC3D9'></a-box>";
var el = document.getElementById("app");
el.innerHTML = htmlString;
