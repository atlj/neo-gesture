import * as React from 'react';
import {
  View,
  ViewProps,
  Dimensions,
  Text,
  LayoutChangeEvent,
  FlatList,
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
} & GesturesProps;

const Snappable = ({children, threshold, ...rest}: Props) => {
  const [phantom, setPhantom] = React.useState<boolean>(false);
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

  const onChange = (_, styles) => {
    const left: number = styles.left;
    const top: number = styles.top;
    let noMatch: boolean = true;
    SnappingLines.map(data => {
      if (data.orientation === 'Vertical') {
        // const middlepoint = viewDimensions.width / 2 + LocRotScale.left;
        let middlepoint = 75 + left;

        if (
          middlepoint < data.left + threshold &&
          middlepoint > data.left - threshold
        ) {
          //SNAP
          setLocRotScale({
            rotation: styles.transform.rotate,
            scale: styles.transform.scale,
            top: top,
            left: data.left - 75,
          });
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
      <Text>{`x:${LocRotScale.left} y:${LocRotScale.top}`}</Text>
      <View
        style={{
          position: 'absolute',
          opacity: phantom === true ? 1 : 0,
          left: LocRotScale.left,
          top: LocRotScale.top,
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
              width: event.nativeEvent.layout.width,
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

Snappable.defaultProps = {threshold: 15};

export default Snappable;
