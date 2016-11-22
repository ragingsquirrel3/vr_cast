/*eslint-disable no-undef */
import React, { Component } from 'react';
import d3 from 'd3';
import getSpeciesColorScale from '../lib/getSpeciesColorScale';

const MAX_HEIGHT = 450;
const TARGET_ID = 'j-agr-sigma-target';
const TRANSITION_DURATION = 1000;
const DEFAULT_X = 0;
const DEFAULT_Y = 0;
const N_TICKS = 100;
const EDGE_COLOR = '#e2e2e2';

import style from './style.css';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.lastNodes = [];
  }

  componentDidMount() {
    this.drawGraph();
  }

  componentDidUpdate (prevProps) {
    if (this.didDataChange(prevProps.data, this.props.data)) {
      this.drawGraph();
    }
  }

  didDataChange(prevData, newData) {
    let areNodesEqual = (prevData.nodes.length !== newData.nodes.length);
    let areEdgesEqual = (prevData.edges.length !== newData.edges.length);
    return (areNodesEqual && areEdgesEqual);
  }

  getHeight() {
    return MAX_HEIGHT;
  }

  // the edges need by d3 to calc format
  getFormattedLinks() {
    let nodes = this.props.data.nodes;
    let edges = this.props.data.edges;
    function findIndexOfNodeById(id) {
      let thisNode = nodes.filter( d => d.id === id )[0];
      return nodes.indexOf(thisNode);
    }
    return edges.map( d => {
      let sourceIndex = findIndexOfNodeById(d.source);
      let targetIndex = findIndexOfNodeById(d.target);
      return { source: sourceIndex, target: targetIndex };
    });
  }

  getEdges() {
    let data = this.props.data;
    let rawEdges = data.edges;
    return rawEdges.map( (d, i) => {
      d.id = `e${i}`;
      d.color = EDGE_COLOR;
      return d;
    });
  }

  getNodes() {
    let colorScale = getSpeciesColorScale();
    return this.props.data.nodes.map( (d) => {
      d.color = colorScale(d.species);
      d.label = d.name;
      d.size = d.direct ? 1 : 0.5;
      return d;
    });
  }

  // calc static d3 force
  getFormattedNodes() {
    let nodes = this.getNodes();
    let links = this.getFormattedLinks();
    let force = d3.layout.force()
      .size([1, 1])
      .nodes(nodes)
      .links(links)
      .linkDistance(20);
    force.start();
    for (let i = 0; i <= N_TICKS; i++) {
      force.tick();
    }
    force.stop();
    // give start and end as x1, x2, y1, y2 for transition
    nodes = nodes.map( (d) => {
      // assign 'correct' to x2 y2
      let correctX = d.x;
      let correctY = d.y;
      d.x2 = correctX;
      d.y2 = correctY;
      // try to get old and assign to default x and y
      let oldNodes = this.lastNodes.filter( _d => d.id === _d.id );
      if (oldNodes.length) {
        let o = oldNodes[0];
        d.x = o.x2;
        d.y = o.y2;
      } else {
        d.x = DEFAULT_X;
        d.y = DEFAULT_Y;
      }
      return d;
    });
    this.lastNodes = nodes;
    return nodes;
  }

  drawGraph() {
    if (this.s) {
      this.s.graph.clear();
      this.s.refresh();
    }
    let _nodes = this.getFormattedNodes();
    let _edges = this.getEdges();
    if (!_nodes.length) return;
    let _graph = {
      nodes: _nodes,
      edges: _edges
    };
    this.s = new sigma({
      graph: _graph,
      container: TARGET_ID,
      settings: {
        animationsTime: TRANSITION_DURATION,
        labelThreshold: 100,
        minNodeSize: 0,
        maxNodeSize: 3
      }
    });
    sigma.plugins.animate(
      this.s,
      { x: 'x2', y: 'y2', size: 'size' },
      {
        duration: TRANSITION_DURATION
      }
    );
  }

  render() {
    return (
      <div className={style.graphContainer} ref='container'>
        <div id={TARGET_ID} style={{ height: this.getHeight() }} />
      </div>
    );
  }
}

Graph.propTypes = {
  data: React.PropTypes.object // { nodes: [], edges: [] }
};

export default Graph;
