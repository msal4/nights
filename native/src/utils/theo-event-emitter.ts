import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

const {ReactNativeEventEmitter, ReactNativeEventEmitterHelper} = NativeModules; //ios + android (ReactNativeEventEmitterHelper android only)
const theoEventEmitter = new NativeEventEmitter(ReactNativeEventEmitter); // DeviceEventEmitter

export default class TheoEventEmitter {
  addListener(eventType: any, listener: any) {
    if (Platform.OS === 'android') {
      ReactNativeEventEmitterHelper.registerListenerForEvent(eventType);
    }
    return theoEventEmitter.addListener(eventType, listener);
  }
}
