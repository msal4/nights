package com.nightsnative;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;

import com.facebook.react.GoogleCastActivity;
import com.nightsnative.ToggleImmersiveModeModule;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends GoogleCastActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "NightsNative";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }
}
