import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

//import { DeviceEventEmitter } from 'react-native'; //android
const {ReactNativeEventEmitter, ReactNativeEventEmitterHelper} = NativeModules; //ios + android (ReactNativeEventEmitterHelper android only)
const theoEventEmitter = new NativeEventEmitter(ReactNativeEventEmitter);

export default class TheoEventEmitter {
  addListener(eventType: any, listener: any) {
    if (Platform.OS === 'android') {
      ReactNativeEventEmitterHelper.registerListenerForEvent(eventType);
    }
    return theoEventEmitter.addListener(eventType, listener);
  }
}
