//
//  THEOplayerView.swift
//  NightsNative
//
//  Created by Mohammed Salman on 9/26/20.
//

import Foundation
import UIKit
import THEOplayerSDK

@objc(THEOplayerView)
class THEOplayerView: UIView {
    var player: THEOplayer
    var onTimeUpdate: RCTBubblingEventBlock?
    var onLoadedData: RCTBubblingEventBlock?
  
    private var listeners: [String: EventListener] = [:]
  
    init() {
    // Set delegate
    if let appDelegate = UIApplication.shared.delegate as? AppDelegate, !appDelegate.castContextSet {
        THEOplayerCastHelper.setGCKCastContextSharedInstanceWithDefaultCastOptions()
        appDelegate.castContextSet = true
    }
      
      
      let scriptPaths = [
        Bundle.main.path(forResource: "assets/js/theoplayer", ofType: "js")
      ].compactMap { $0 }
      
      let stylePaths = [
        Bundle.main.path(forResource: "assets/css/fa/css/all.min", ofType: "css"),
        Bundle.main.path(forResource: "assets/css/theoplayer", ofType: "css")
      ].compactMap { $0 }
      
      print("scriptpaths: ", scriptPaths)
      print("stylepaths: ", stylePaths)
      
      let playerConfig = THEOplayerConfiguration(chromeless: false, cssPaths: stylePaths, jsPaths: scriptPaths, pip: nil)

      // Init player
      player = THEOplayer(configuration: playerConfig)
      player.evaluateJavaScript("init({player: player})")
      

      
      
      // Set frame
      super.init(frame: .zero)
      // Add as subview
      player.addAsSubview(of: self)
      
      // Register player on event emitter
      EventEmitter.sharedInstance.registerPlayer(player: player)
      
      // Set listener
      let loadedDataListener = player.addEventListener(type: PlayerEventTypes.LOADED_DATA) { [unowned self] event in
         print("Received \(event.type) event at \(event.currentTime)")
          guard self.onLoadedData != nil else {
            return
          }

        self.onLoadedData!([:])
      }
      listeners[PlayerEventTypes.LOADED_DATA.name] = loadedDataListener
      
      let timeUpdateListener = player.addEventListener(type: PlayerEventTypes.TIME_UPDATE) { [unowned self] event in
         print("Received \(event.type) event at \(event.currentTime)")
          guard self.onTimeUpdate != nil else {
            return
          }

         self.onTimeUpdate!(["currentTime": event.currentTime])
      }
      listeners[PlayerEventTypes.TIME_UPDATE.name] = timeUpdateListener
      
    }

    required init?(coder aDecoder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
    }

    // View property to set source which uses SourceDescription(check view+convert)
    @objc(setSource:) func setSource(source: SourceDescription) {
      player.source = source
    }

    // View property to set autoplay
    @objc(setAutoplay:) func setAutoplay(autoplay: Bool) {
      player.autoplay = autoplay
    }
  
    @objc(setOnLoadedData:) func setOnLoadedData(loadedData: @escaping RCTBubblingEventBlock) {
        onLoadedData = loadedData
    }
  
    @objc(setOnTimeUpdate:) func setOnTimeUpdate(timeUpdate: @escaping RCTBubblingEventBlock) {
        onTimeUpdate = timeUpdate
    }
  

    // Declarate subview for video scalling
    override func layoutSubviews() {
    super.layoutSubviews()
      player.frame = frame
      player.autoresizingMask = [.flexibleBottomMargin, .flexibleHeight, .flexibleLeftMargin, .flexibleRightMargin, .flexibleTopMargin, .flexibleWidth]
    }
  
  
    // De-init listeners
    deinit {
        for (eventName, listener) in listeners {
          switch eventName {
          case PlayerEventTypes.LOADED_DATA.name:
              player.removeEventListener(type: PlayerEventTypes.LOADED_DATA, listener: listener)
          case PlayerEventTypes.TIME_UPDATE.name:
            player.removeEventListener(type: PlayerEventTypes.TIME_UPDATE, listener: listener)
          default:
              break
          }
        }
    }
}
