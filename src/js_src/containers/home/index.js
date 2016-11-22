import React, { Component } from 'react';

const BG_COLOR = 'black';

class Home extends Component {
  render() {
    return (
      <a-scene>
        <a-sky color={BG_COLOR}/>
        <a-sphere position="0 1.25 -1" radius="1.25" color="#EF2D5E"></a-sphere>
        <a-box position="-1 0.5 1" rotation="0 45 0" width="1" height="1" depth="1"  color="#4CC3D9"></a-box>
        <a-cylinder position="1 0.75 1" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
        <a-plane rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>

        <a-entity position="0 0 3.8">
          <a-camera></a-camera>
        </a-entity>
      </a-scene>
    );
  }
}

export default Home;
