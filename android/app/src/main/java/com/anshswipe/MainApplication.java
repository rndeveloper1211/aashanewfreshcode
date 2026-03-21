package com.digital2pay;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.soloader.SoLoader;
import java.util.List;
import com.digital2pay.AepsPackage;
import com.digital2pay.upi.UpiPackage;
import com.digital2pay.location.LocationPackage; // <-- add this
import com.digital2pay.security.SecurityPackage;
import com.digital2pay.ContactPicker.ContactPickerPackage;
import androidx.multidex.MultiDexApplication;
public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Custom Packages
           packages.add(new UpiPackage());
            packages.add(new AepsPackage());
            packages.add(new SecurityPackage());
            packages.add(new ContactPickerPackage());

    packages.add(new LocationPackage()); // <-- add here
          return packages;
        }

        @Override
        protected String getJSMainModuleName() { return "index"; }

        @Override
        protected boolean isNewArchEnabled() { return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED; }

        @Override
        protected Boolean isHermesEnabled() { return true; }

        @Override
        public boolean getUseDeveloperSupport() { return BuildConfig.DEBUG; }
      };

  @Override
  public ReactNativeHost getReactNativeHost() { return mReactNativeHost; }

  // New Architecture ke liye necessary hai, lekin Old Arch pe bhi safe hai
  @Override
  public ReactHost getReactHost() {
    return DefaultReactHost.getDefaultReactHost(this.getApplicationContext(), mReactNativeHost);
  }

@Override
public void onCreate() {
    super.onCreate();
    SoLoader.init(this, false);
    
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
        // यह लाइन पुराने मॉड्यूल्स को New Arch में सपोर्ट दिलाती है
        DefaultNewArchitectureEntryPoint.load();
    }
}
}

