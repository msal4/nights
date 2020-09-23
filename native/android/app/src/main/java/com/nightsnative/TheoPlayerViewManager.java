package com.nightsnative;

import android.app.Activity;
import android.view.View;
import android.widget.LinearLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.theoplayer.android.api.THEOplayerConfig;
import com.theoplayer.android.api.THEOplayerView;
import com.theoplayer.android.api.event.EventListener;
import com.theoplayer.android.api.event.player.LoadedDataEvent;
import com.theoplayer.android.api.event.player.PlayerEventTypes;
import com.theoplayer.android.api.event.player.TimeUpdateEvent;
import com.theoplayer.android.api.source.SourceDescription;

import java.util.Map;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

public class TheoPlayerViewManager extends SimpleViewManager<THEOplayerView> implements LifecycleEventListener {
    private static final String TAG = TheoPlayerViewManager.class.getSimpleName();
    private static final String RCT_MODULE_NAME = "THEOplayerView";


    public THEOplayerView playerView;
    public Activity activity;

    @Override
    public String getName() {
        return RCT_MODULE_NAME;
    }


    private enum InternalAndGlobalEventPair {
        onTimeUpdate("onTimeUpdateEventInternal", "onTimeUpdate"),
        onLoadedData("onLoadedDataEventInternal", "onLoadedData");

        String internalEvent;
        String globalEvent;

        InternalAndGlobalEventPair(String internalEvent, String globalEvent) {
            this.internalEvent = internalEvent;
            this.globalEvent = globalEvent;
        }
    }

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
        playerView.setLayoutParams(new LinearLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT));

        addPropertyChangeListeners(reactContext);

        playerView.evaluateJavaScript("init({player: player})", null);

        reactContext.addLifecycleEventListener(this);


        return playerView;
    }


    // Change listeners
    private void addPropertyChangeListeners(final ThemedReactContext reactContext) {
        playerView.getPlayer().addEventListener(PlayerEventTypes.LOADEDDATA, new EventListener<LoadedDataEvent>() {
            @Override
            public void handleEvent(final LoadedDataEvent playEvent) {
                WritableMap event = Arguments.createMap();

                // Local property change
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        playerView.getId(),
                        InternalAndGlobalEventPair.onLoadedData.internalEvent,
                        event);
            }
        });

        playerView.getPlayer().addEventListener(PlayerEventTypes.TIMEUPDATE, new EventListener<TimeUpdateEvent>() {
            @Override
            public void handleEvent(final TimeUpdateEvent updateEvent) {
                WritableMap event = Arguments.createMap();
                event.putDouble("currentTime", updateEvent.getCurrentTime());

                // Local property change
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        playerView.getId(),
                        InternalAndGlobalEventPair.onTimeUpdate.internalEvent,
                        event);
            }
        });

    }

    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        InternalAndGlobalEventPair.onLoadedData.internalEvent,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", InternalAndGlobalEventPair.onLoadedData.globalEvent)))
                .put(
                        InternalAndGlobalEventPair.onTimeUpdate.internalEvent,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", InternalAndGlobalEventPair.onTimeUpdate.globalEvent)))
                .build();
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