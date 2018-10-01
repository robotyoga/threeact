import React from 'react';

export default class SvgArrow extends React.PureComponent { 
  static defaultProps = {
    start: { x: 0, y: 0},
    end: { x: window.innerWidth, y: window.innerHeight },
    style: {
      stroke: 'yellow',
    }
  }
  
  render() {
    return (
      <React.Fragment>
        <line
          x1={this.props.start.x}
          y1={this.props.start.y}
          x2={this.props.end.x}
          y2={this.props.end.y}
          style={this.props.style}
        /> 
        <circle 
          cx={this.props.end.x}
          cy={this.props.end.y}
          r={5}
          style={this.props.style}
        />
      </React.Fragment>
    );
  }
}