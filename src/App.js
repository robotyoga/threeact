import React from 'react';
import {
  Vector3,
  PerspectiveCamera,
} from 'three';
import {
  ORIGIN,
  RIGHT,
  UP,
  randomVector,
  intersection,
  copy,
  vec3ToScreenCoord,
} from './utils';
import { Vector } from './components';

export default class App extends React.PureComponent {
  constructor() {
    super();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.camera.position.set(0, 0, 5);
    this.camera.getWorldPosition();
    this.state = {
      vectors: [
        {
          origin: new Vector3(),
          direction: RIGHT,
        },
        {
          origin: randomVector().multiplyScalar((Math.random() * 2) + 2),
          direction: randomVector(),
        },
      ]
    }
  }

  onMouseMove = ({ clientX, clientY }) => {
    const mouseVector3 = new Vector3(
      ((clientX / window.innerWidth) * 2) - 1,
      -((clientY / window.innerHeight) * 2) + 1,
      0,
    );
    const vectors = this.state.vectors.slice();
    vectors[0].direction = mouseVector3.normalize();
    this.setState({ vectors });
  }

  onClick = () => {
    const vectors = this.state.vectors.slice();
    vectors[1].origin = randomVector().multiplyScalar((Math.random() * 2) + 2);
    vectors[1].direction = randomVector();
    this.setState({ vectors });
  }

  renderBasisVectors() {
    return [
      <Vector
        key="basisVectorX"
        start={vec3ToScreenCoord(ORIGIN, this.camera)}
        end={vec3ToScreenCoord(RIGHT, this.camera)}
        style={{
          stroke: 'red',
        }}
      />,
      <Vector
        key="basisVectorY"
        start={vec3ToScreenCoord(ORIGIN, this.camera)}
        end={vec3ToScreenCoord(UP, this.camera)}
        style={{
          stroke: 'green',
        }}
      />
    ]
  }

  renderIntersection() {
    const [a, b] = this.state.vectors;

    const c = intersection(a.origin, a.direction, b.origin, b.direction);
    const crossProduct = copy(a.direction).cross(b.direction)
    const isExternalEdge = crossProduct.z > 0;

    const arrowProps = {
      key: 'intersection',
      start: vec3ToScreenCoord(new Vector3(), this.camera),
      end: vec3ToScreenCoord(c, this.camera),
      style: { 
        stroke: isExternalEdge ? 'magenta' : 'cyan',
      }
    }
    return <Vector {...arrowProps} />
  }

  renderVectors() {
    return this.state.vectors.map(({origin, direction }, i) => {
      const start = vec3ToScreenCoord(origin, this.camera);
      const end = vec3ToScreenCoord(copy(origin).add(direction), this.camera);
      const arrowProps = {
        start,
        end,
        key: `arrow${i}`,
      };
      
      return <Vector {...arrowProps} />;
    })
  }
  
  render() {
    return (
      <svg
        onMouseMove={this.onMouseMove}
        onClick={this.onClick}
        style={{
          position: 'absolute',
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: '#333',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {this.renderBasisVectors()}
        {this.renderVectors()}
        {this.renderIntersection()}
      </svg>
    );
  }
}
