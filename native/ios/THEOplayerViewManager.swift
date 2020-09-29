import Foundation
import THEOplayerSDK

@objc(THEOplayerViewManager) class THEOplayerViewManager: RCTViewManager {
    var playerView = THEOplayerView()

    override func view() -> UIView! {
      return playerView
    }

    // Override implementation of queue setup
    // - Returns: when true class initialized on the main thread,
    //            when false class initialized on a background thread
    @objc
    override static func requiresMainQueueSetup() -> Bool {
      return true;
    }
}
