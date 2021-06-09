import React from 'react';
import {SafeAreaView, StyleSheet, Image} from 'react-native';

import Gestures from './lib';

const App = () => {
  return (
    <SafeAreaView style={{backgroundColor: 'blue', flex: 1}}>
      <Gestures rotate="0deg">
        <Image
          width={300}
          height={300}
          source={{
            uri: 'https://image.freepik.com/free-vector/shining-circle-purple-lighting-isolated-dark-background_1441-2396.jpg',
          }}
        />
      </Gestures>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
