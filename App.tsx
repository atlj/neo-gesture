import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  PanResponder,
  View,
} from 'react-native';

import Snappable from './Snappable';

import Gestures from './lib';

interface location {
  x: number;
  y: number;
}

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Snappable width="auto">
        <View style={{borderWidth: 1, width: 150, borderColor: 'red'}}>
          <Text style={{fontSize: 40}}>deneme</Text>
        </View>
      </Snappable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
