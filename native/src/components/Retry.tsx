import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon, Text} from 'react-native-elements';

export default ({onRetry}: {onRetry: () => void}) => {
  return (
    <View style={styles.container}>
      <Button onPress={onRetry}>
        <Icon name="refresh" />
        <Text>Retry</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
