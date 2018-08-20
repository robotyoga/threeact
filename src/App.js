import React from 'react';
import React3 from 'react-three-renderer';
import {
  Vector2,
  Vector3,
  Raycaster,
  Euler,
  Object3D,
} from 'three';

function getFirstIntersection(mouseEvent, object, camera) {
  const { clientX, clientY } = mouseEvent;

  const { innerWidth, innerHeight } = window;

  const mouseVector = new Vector2();
  mouseVector.set(
    ((clientX / innerWidth) * 2) - 1,
    -((clientY / innerHeight) * 2) + 1,
  );

  const raycaster = new Raycaster();
  raycaster.setFromCamera(mouseVector, camera);
  
  const intersections = raycaster.intersectObject(object);
  if (intersections.length > 0) {
    return intersections[0];
  }

  return null;
}

function uvToWorldCoord(object, [u, v]) {
  if (!object) {
    return new Vector3();
  }
  const { width, height } = object.geometry.parameters;
  const point = new Vector3(
    (u - 0.5) * width,
    (v - 0.5) * height,
  );
  point.applyMatrix4(object.matrix);
  return point;
}

function vec3ToScreenCoord(point, camera) {
  if (!camera || !point) {
    return { x: 0, y: 0 };
  }
  const { innerWidth, innerHeight } = window;
  const projected = new Vector3;
  projected.copy(point)
  projected.project(camera);
  const windowCoord = {
    x: ((projected.x + 1) / 2) * innerWidth,
    y: -((projected.y - 1) / 2) * innerHeight,
  };
  return windowCoord;
}

function cornersToQuad([xa, ya], [xb, yb]) {
  const minX = Math.min(xa, xb);
  const maxX = Math.max(xa, xb);
  const minY = Math.min(ya, yb);
  const maxY = Math.max(ya, yb);
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ];
}

export default class App extends React.PureComponent {

  state = {
    planeRotation: new Euler(0, Math.PI / 4, 0),
    // planeRotation: new Euler(0, 0, 0),
    mouseIntersection: new Vector3(),
    cameraPosition: new Vector3(0, 0, 5),
    rectCorners: [
      [0.5, 0.5],
      [0.6, 0.6],
    ],
    points3D: [],
  }

  onMouseMove = (mouseEvent) => {
    const intersection = getFirstIntersection(mouseEvent, this.targetObject, this.camera);
    if (intersection) {
      const { x, y } = intersection.uv;
      this.setState({
        rectCorners: [
          [0.5, 0.5],
          [x, y],
        ],
      });
    }
  }

  componentDidMount() {
    this.targetObject = this.scene.children.find((object) => object.name === 'target');
  }
  
  render() {
    const { rectCorners } = this.state;
    const [cornerA, cornerB] = rectCorners;
    const { innerWidth, innerHeight } = window;
    const points = [];
    const uvQuad = cornersToQuad(cornerA, cornerB);
    const points3D = uvQuad.map((point) => {
      return uvToWorldCoord(this.targetObject, point);
    });
    const points2D = points3D.map((point) => {
      return vec3ToScreenCoord(point, this.camera);
    });
    const pointString = points2D.reduce((string, { x, y }) => {
      return `${string} ${x},${y}`
    }, '');

    return (
      <div
        onMouseMove={this.onMouseMove}
        style={{
          innerWidth,
          innerHeight,
        }}
      >
        <React3
          mainCamera="camera"
          width={innerWidth}
          height={innerHeight}
        >
          <scene ref={(scene) => this.scene = scene}>
            <perspectiveCamera
              name="camera"
              ref={(camera) => this.camera = camera}
              fov={75}
              aspect={innerWidth / innerHeight}
              near={0.1}
              far={1000}
              position={this.state.cameraPosition}
            />
            <mesh
              name="target"
              rotation={this.state.planeRotation}
            >
              <planeGeometry
                width={5}
                height={5}
              />
              <meshBasicMaterial 
                color={0xffffff} 
              />
            </mesh>
          </scene>
        </React3>
        <svg
          style={{
            position: 'absolute',
            width: innerWidth,
            height: innerHeight,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <polygon
            points={pointString}
          />
        </svg>
      </div>
    );
  }
}
