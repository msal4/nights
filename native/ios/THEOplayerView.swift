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

    // Declarate subview for video scalling
    override func layoutSubviews() {
    super.layoutSubviews()
      player.frame = frame
      player.autoresizingMask = [.flexibleBottomMargin, .flexibleHeight, .flexibleLeftMargin, .flexibleRightMargin, .flexibleTopMargin, .flexibleWidth]
    }
}
