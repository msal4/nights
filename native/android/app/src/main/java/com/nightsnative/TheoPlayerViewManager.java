package com.nightsnative;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.content.res.AssetManager;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.theoplayer.android.api.THEOplayerConfig;
import com.theoplayer.android.api.THEOplayerView;
import com.theoplayer.android.api.cast.chromecast.PlayerCastState;
import com.theoplayer.android.api.event.EventListener;
import com.theoplayer.android.api.event.chromecast.CastStateChangeEvent;
import com.theoplayer.android.api.event.chromecast.ChromecastEventTypes;
import com.theoplayer.android.api.event.player.PlayerEventTypes;
import com.theoplayer.android.api.event.player.PlayingEvent;
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes;
import com.theoplayer.android.api.event.track.texttrack.list.TrackListChangeEvent;
import com.theoplayer.android.api.player.track.texttrack.TextTrack;
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode;
import com.theoplayer.android.api.source.SourceDescription;

import java.io.IOException;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

public class TheoPlayerViewManager extends SimpleViewManager<THEOplayerView> implements LifecycleEventListener {
    private static final String TAG = TheoPlayerViewManager.class.getSimpleName();
    private static final String RCT_MODULE_NAME = "THEOplayerView";


    private THEOplayerView playerView;
    private Activity activity;

    @Override
    public String getName() {
        return RCT_MODULE_NAME;
    }
    TextTrack currentTextTrack;

    @SuppressLint("SourceLockedOrientationActivity")
    @Override
    protected THEOplayerView createViewInstance(final ThemedReactContext reactContext) {
        activity = reactContext.getCurrentActivity();

        final THEOplayerConfig config = new THEOplayerConfig.Builder()
                .chromeless(false)
                .defaultCss(true)
                .jsPaths("js/theoplayer.js")
                .cssPaths("css/theoplayer.css")
                .build();

        playerView = new THEOplayerView(activity, config);
        playerView.getFullScreenManager().requestFullScreen();
        playerView.evaluateJavaScript("init({player: player})", null);

        reactContext.addLifecycleEventListener(this);

        playerView.setLayoutParams(new LinearLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT));

        return playerView;
    }

    // Setting autoplay prop
    @ReactProp(name = "autoplay", defaultBoolean = false)
    public void setAutoplay(View view, boolean autoplay) {
        playerView.getPlayer().setAutoplay(autoplay);
    }

    // Setting fullscreenOrientationCoupling prop
    @ReactProp(name = "fullscreenOrientationCoupling", defaultBoolean = false)
    public void setFullscreenOrientationCoupling(View view, boolean fullscreenOrientationCoupling) {
        playerView.getSettings().setFullScreenOrientationCoupled(fullscreenOrientationCoupling);
    }

    // Setting source prop
    @ReactProp(name = "source")
    public void setSource(View view, ReadableMap source) {
        SourceDescription sourceDescription = SourceHelper.parseSourceFromJS(source);
        if (sourceDescription != null) {
            playerView.getPlayer().setSource(sourceDescription);
        }
    }

    //lifecycle events
    @Override
    public void onHostResume() {
        playerView.onResume();
    }

    @Override
    public void onHostPause() {
        playerView.onPause();
    }

    @Override
    public void onHostDestroy() {
        playerView.onDestroy();
    }
}