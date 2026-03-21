package com.digital2pay;

import android.os.Bundle;
// Ye naya import Edge-to-Edge ke liye zaroori hai
import androidx.core.view.WindowCompat; 
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "digital2pay";
  }

@Override
protected void onCreate(Bundle savedInstanceState) {
//  WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
  super.onCreate(null);
  RNBootSplash.init(this, R.style.BootTheme);
}

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        /* STEP 3: New Architecture (Fabric) check.
           Ye aapki gradle.properties ki settings ke basis pe architecture select karega.
        */
        DefaultNewArchitectureEntryPoint.getFabricEnabled()
    );
  }
}