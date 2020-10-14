//import Foundation
//import THEOplayerSDK
//    
//class EventEmitter {
//    
//    /// Shared Instance.
//    public static var sharedInstance = EventEmitter()
//    
//    // ReactNativeEventEmitter is instantiated by React Native with the bridge.
//    private static var eventEmitter: ReactNativeEventEmitter!
//    private static var player: THEOplayer!
//    
//    private var listeners: [String: EventListener] = [:]
//    
//    private init() {}
//    
//    // When React Native instantiates the emitter it is registered here.
//    func registerEventEmitter(eventEmitter: ReactNativeEventEmitter) {
//      EventEmitter.eventEmitter = eventEmitter
//    }
//    
//    func registerPlayer(player: THEOplayer) {
//      EventEmitter.player = player
//    }
//    
//    // Dispatch one event
//    func dispatch(name: String, body: Any?) {
//      EventEmitter.eventEmitter.sendEvent(withName: name, body: body)
//    }
//    
//    // Dispatch event to all listeners
//    func dispatchToAll(body: Any?) {
//    for event in EventEmitter.eventEmitter.allEvents {
//        EventEmitter.eventEmitter.sendEvent(withName: event, body: body)
//    }
//    }
//    
//    func addEventListener(eventName : String) -> Bool {
//    
//    if listeners[eventName] != nil {
//        return true
//    }
//    
//    switch eventName {
//    case PlayerEventTypes.LOADED_DATA.name:
//        listeners[eventName] = EventEmitter.player.addEventListener(type: PlayerEventTypes.LOADED_DATA) { event in
//            print("Received \(event.type) event at \(event.currentTime)")
//            EventEmitter.sharedInstance.dispatch(name: event.type, body: ["currentTime": event.currentTime])
//        }
//      
//    case PlayerEventTypes.TIME_UPDATE.name:
//        listeners[eventName] = EventEmitter.player.addEventListener(type: PlayerEventTypes.TIME_UPDATE) { event in
//            print("Received \(event.type) event at \(event.currentTime)")
//            EventEmitter.sharedInstance.dispatch(name: event.type, body: ["currentTime": event.currentTime])
//        }
//      
//    default:
//      return false
//    }
//    
//    return true
//    }
//    
//    func removeAllEventListeners() {
//    for (eventName, listener) in listeners {
//        switch eventName {
//        case PlayerEventTypes.LOADED_DATA.name:
//          EventEmitter.player.removeEventListener(type: PlayerEventTypes.LOADED_DATA, listener: listener)
//        case PlayerEventTypes.TIME_UPDATE.name:
//          EventEmitter.player.removeEventListener(type: PlayerEventTypes.TIME_UPDATE, listener: listener)
//        default:
//            break
//        }
//    }
//    listeners = [:]
//    }
//}
