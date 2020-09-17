import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';

export default () => (
  <View style={styles.container}>
    <ActivityIndicator color="white" />
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
});
