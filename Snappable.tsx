import * as React from 'react';
import {
  View,
  Dimensions,
  Text,
  LayoutChangeEvent,
  ColorValue,
} from 'react-native';
import Gestures, {GesturesProps} from './lib';

const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

interface LocRotScale {
  top: number;
  left: number;
  scale: number;
  rotation: string;
}

interface ViewProperties {
  width: number;
  height: number;
}

interface SnappingLineHorizontal {
  orientation: 'Horizontal';
  top: number;
  color: ColorValue;
  key: number;
}

interface SnappingLineVertical {
  orientation: 'Vertical';
  left: number;
  color: ColorValue;
  key: number;
}

type SnappingLine = SnappingLineHorizontal | SnappingLineVertical;

type Props = {
  children: JSX.Element;
  threshold: number;
  /**
   * This is the width of the child object
   * @param {string} Auto
   * Take child's width automatically
   *
   * This can only be used if child component has a style object that contains width
   *
   * children.props.style.width
   *
   * @param {number} number
   * Give the child's width manually
   *
   */
  width: number | 'auto';
} & GesturesProps;

const Snappable = ({children, threshold, width, ...rest}: Props) => {
  const [phantom, setPhantom] = React.useState<boolean>(false);
  const [mid, setMid] = React.useState<number>(0);
  const [viewDimensions, setViewDimensions] = React.useState<ViewProperties>({
    height: 0,
    width: 0,
  });
  const [LocRotScale, setLocRotScale] = React.useState<LocRotScale>({
    left: 0,
    top: 0,
    rotation: '0deg',
    scale: 1,
  });

  const SnappingLines: Array<SnappingLine> = [
    {orientation: 'Vertical', left: screen.width / 2, color: 'blue', key: 1},
    {orientation: 'Vertical', left: screen.width - 15, color: 'yellow', key: 2},
    {orientation: 'Vertical', left: 50, color: 'brown', key: 3},
  ];

  const CalculateVerticalMidPoint = (styles, angle) => {
    const left: number = styles.left;
    const top: number = styles.top;
    let scale =
      styles.transform[0].scale !== undefined
        ? styles.transform[0].scale
        : LocRotScale.scale;

    let middlepoint =
      viewDimensions.width / 2 -
      (viewDimensions.width / 1.5) * (scale - 1) +
      (180 - Math.abs(180 - angle)) * scale +
      left;

    setMid(middlepoint);
    return middlepoint;
  };

  const onChange = (_, styles) => {
    /**
     * @var This variable affects how frequent the middle point should be calculated on rotations
     */
    const updateThreshold = 30;
    let lastRotation = 0;
    const left: number = styles.left;
    const top: number = styles.top;
    let noMatch: boolean = true;
    let angle: string | number = LocRotScale.rotation;
    if (angle === '0deg') {
      angle = 0;
    } else {
      let pointIndex = angle.indexOf('.');
      angle = angle.slice(0, pointIndex);
      angle = Number(angle);
    }
    if (angle < 0) {
      angle = 360 + angle;
    }
    if (angle > 360) {
      angle = angle % 360;
    }

    let middlepoint = CalculateVerticalMidPoint(styles, angle);

    SnappingLines.map(data => {
      if (data.orientation === 'Vertical') {
        if (
          middlepoint < data.left + threshold &&
          middlepoint > data.left - threshold
        ) {
          //SNAP
          setLocRotScale({
            rotation:
              styles.transform[1].rotate !== undefined
                ? styles.transform[1].rotate
                : LocRotScale.rotation,
            scale:
              styles.transform[0].scale !== undefined
                ? styles.transform[0].scale
                : LocRotScale.scale,
            top:
              top +
              18.5 * LocRotScale.scale -
              0.01 * viewDimensions.width * (180 - Math.abs(180 - angle)),
            left: data.left - viewDimensions.width / 2,
          });
          lastRotation = angle;
          setPhantom(true);
          noMatch = false;
        }
      } else {
        //TODO ADD HORIZONTAL SNAPPING
      }
    });
    if (noMatch) {
      setPhantom(false);
    }
  };
  return (
    <View
      style={{
        width: screen.width,
        height: screen.height,
        position: 'absolute',
      }}>
      <Text>{`x:${LocRotScale.left} y:${LocRotScale.top} rotation:${LocRotScale.rotation}`}</Text>
      <View
        style={{
          position: 'absolute',
          opacity: phantom === true ? 1 : 0,
          left: LocRotScale.left,
          top: LocRotScale.top,
          transform: [
            {scale: LocRotScale.scale},
            {rotate: LocRotScale.rotation},
          ],
        }}>
        {children}
      </View>
      <Gestures
        onChange={(_, styles) => {
          onChange(_, styles);
        }}
        rotate="0deg">
        <View
          onLayout={event => {
            setViewDimensions({
              width: width === 'auto' ? children.props.style.width : width,
              height: event.nativeEvent.layout.height,
            });
          }}
          style={{opacity: phantom === false ? 1 : 0}}>
          {children}
        </View>
      </Gestures>
      {SnappingLines.map(data => {
        if (data.orientation === 'Vertical') {
          return (
            <View
              style={{
                backgroundColor: data.color,
                position: 'absolute',
                width: 1,
                left: data.left,
                height: screen.height,
              }}
            />
          );
        } else {
          return (
            <View
              style={{
                backgroundColor: data.color,
                position: 'absolute',
                width: screen.width,
                top: data.top,
                height: 1,
              }}
            />
          );
        }
      })}
    </View>
  );
};

Snappable.defaultProps = {threshold: 15} as Props;

export default Snappable;
