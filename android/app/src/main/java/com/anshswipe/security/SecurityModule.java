package com.digital2pay.security;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SecurityModule extends ReactContextBaseJavaModule {
    private static final int LOCK_REQUEST_CODE = 221;
    private Promise mPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == LOCK_REQUEST_CODE) {
                // Yahan mPromise ka null check bahut zaroori hai
                if (mPromise != null) {
                    if (resultCode == Activity.RESULT_OK) {
                        mPromise.resolve(true);
                    } else {
                        // Agar user cancel kare ya fail ho
                        mPromise.resolve(false);
                    }
                    mPromise = null; // Use karne ke baad hamesha null karein
                }
            }
        }
    };

    public SecurityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @NonNull
    @Override
    public String getName() {
        return "SecurityModule";
    }

    @ReactMethod
    public void showScreenLock(Promise promise) {
        // AGAR PEHLE SE KOI PROMISE CHAL RAHA HAI, TOH USE REJECT KAREIN
        if (mPromise != null) {
            mPromise.reject("PENDING_AUTH", "Another authentication is already in progress");
            // mPromise = null; // optional, but keep it clean
        }

        mPromise = promise;
        Activity currentActivity = getCurrentActivity();
        
        if (currentActivity == null) {
            promise.reject("ERROR", "Activity doesn't exist");
            mPromise = null;
            return;
        }

        KeyguardManager km = (KeyguardManager) getReactApplicationContext().getSystemService(Context.KEYGUARD_SERVICE);
        
        if (km != null && km.isDeviceSecure()) {
            Intent i = km.createConfirmDeviceCredentialIntent("Security Check", "Please unlock your app");
            if (i != null) {
                try {
                    currentActivity.startActivityForResult(i, LOCK_REQUEST_CODE);
                } catch (Exception e) {
                    promise.reject("INTENT_ERROR", "Could not start lock activity");
                    mPromise = null;
                }
            } else {
                promise.resolve(true); // Default to true if intent is null but device is secure
                mPromise = null;
            }
        } else {
            promise.reject("NO_LOCK", "No screen lock set on this device");
            mPromise = null;
        }
    }

    @ReactMethod
    public void checkDeviceSecurity(Promise promise) {
        try {
            KeyguardManager km = (KeyguardManager) 
                getReactApplicationContext().getSystemService(Context.KEYGUARD_SERVICE);

            if (km == null) {
                promise.reject("ERROR", "KeyguardManager not available");
                return;
            }

            boolean isSecure;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                isSecure = km.isDeviceSecure();
            } else {
                isSecure = km.isKeyguardSecure();
            }

            promise.resolve(isSecure ? "SECURE" : "NOT_SECURE");

        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}