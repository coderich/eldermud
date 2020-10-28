// import { jsPlumb, jsPlumbUtil } from 'jsplumb';
import { forward, doorOpen } from './SVGService';

// // this function takes a point from the midline and projects it to the
// // upper or lower guideline.
// const translatePoint = function(from, n, upper, amplitude) {
//   var dux = isFinite(n) ? (Math.cos(n) * amplitude) : 0;
//   var duy = isFinite(n) ? (Math.sin(n) * amplitude) : amplitude;
//   return [
//     from[0] - ((upper ? -1 : 1) * dux),
//     from[1] + ((upper ? -1 : 1) * duy)
//   ];
// };

// // this function returns a point on the line connecting
// // the two anchors, at a given distance from the start
// const pointOnLine = function(from, m, distance) {
//   var dux = isFinite(m) ? (Math.cos(m) * distance) : 0;
//   var duy = isFinite(m) ? (Math.sin(m) * distance) : distance;
//   return [
//       from[0] + dux,
//       from[1] + duy
//   ];
// };

// const StairConnector = function StairConnector(params) {
//   params = params || {};
//   const sup = jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
//   this.type = 'basic';

//   var wavelength = params.wavelength || 10,
//     amplitude = params.amplitude || 10,
//     spring = params.spring,
//     compressedThreshold = params.compressedThreshold || 5;

//   this._compute = (paintInfo, paintParams) => {
//     var dx = paintInfo.tx - paintInfo.sx,
//       dy = paintInfo.ty - paintInfo.sy,
//       d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)), // absolute delta
//       m = Math.atan2(dy, dx),
//       n = Math.atan2(dx, dy),
//       origin = [paintInfo.sx, paintInfo.sy],
//       current = [paintInfo.sx, paintInfo.sy],
//       w = spring ? d <= compressedThreshold ? 1 : d / 20 : wavelength,
//       peaks = Math.round(d / wavelength),
//       shift = d - (peaks * wavelength),
//       upper = true;

//     for (let i = 0; i < peaks - 1; i++) {
//       var xy = pointOnLine(origin, m, shift + ((i+1) * w)),
//         pxy = translatePoint(xy, n, upper, amplitude);

//       sup.addSegment(this, 'Straight', {
//         x1:current[0],
//         y1:current[1],
//         x2:pxy[0],
//         y2:pxy[1],
//       });

//       upper = !upper;
//       current = pxy;
//     }

//     // segment to end point
//     sup.addSegment(this, 'Straight', {
//       x1:current[0],
//       y1:current[1],
//       x2:paintInfo.tx,
//       y2:paintInfo.ty,
//     });
//   };
// };

// jsPlumbUtil.extend(StairConnector, jsPlumb.Connectors.AbstractConnector);
// jsPlumb.Connectors.Stairs = StairConnector;


const getRotation = (align, dir) => {
  switch (`${align}-${dir}`) {
    case 'up-n': case 'down-s': return 180;
    default: return 0;
  }
};

const getOverlays = (exit) => {
  const [conn, align] = exit.conn.split(':');
  const rotation = getRotation(align, exit.dir);

  switch (conn) {
    case 'stairs': {
      return [
        ['Custom', {
          create: (component) => {
            const el = global.document.createElement('div');
            const svg = global.document.createElement('div');
            svg.innerHTML = doorOpen;
            svg.setAttribute('style', 'width:18px;height:18px;fill:lightGrey;');
            // svg.style.transform = `rotate(${rotation}deg)`;
            el.appendChild(svg);
            return el;
          },
        }],
      ];
    }
    default: return [];
  }
};

export const getInfo = (row, col, exit, now) => {
  switch (exit.dir) {
    case 'n': return { target: `room-${row - 1}-${col}-${now}`, anchors: ['Top', 'Bottom'], overlays: getOverlays(exit) };
    case 's': return { target: `room-${row + 1}-${col}-${now}`, anchors: ['Bottom', 'Top'], overlays: getOverlays(exit) };
    case 'e': return { target: `room-${row}-${col + 1}-${now}`, anchors: ['Right', 'Left'], overlays: getOverlays(exit) };
    case 'w': return { target: `room-${row}-${col - 1}-${now}`, anchors: ['Left', 'Right'], overlays: getOverlays(exit) };
    case 'ne': return { target: `room-${row - 1}-${col + 1}-${now}`, anchors: ['TopRight', 'BottomLeft'], overlays: getOverlays(exit) };
    case 'nw': return { target: `room-${row - 1}-${col - 1}-${now}`, anchors: ['TopLeft', 'BottomRight'], overlays: getOverlays(exit) };
    case 'se': return { target: `room-${row + 1}-${col + 1}-${now}`, anchors: ['BottomRight', 'TopLeft'], overlays: getOverlays(exit) };
    case 'sw': return { target: `room-${row + 1}-${col - 1}-${now}`, anchors: ['BottomLeft', 'TopRight'], overlays: getOverlays(exit) };
    default: return { target: `room-${row}-${col}-${now}` };
  }
};

export const draw = (map) => {

};
