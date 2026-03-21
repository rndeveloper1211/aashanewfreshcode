# --- EXISTING RULES ---
-keep class com.facebook.react.common.build.ReactBuildConfig { *; }
-keep class com.facebook.react.bridge.CatalystInstanceImpl { *; }

# --- PAYU & JSON CRASH FIX (ADD THIS) ---
-keep class com.payu.** { *; }
-keep class in.payu.** { *; }
-keep class com.payu.crashlogger.** { *; }
-dontwarn com.payu.**

# JSONArray crash fix - DO NOT REMOVE
-keep class org.json.** { *; }
-keepclassmembers class org.json.** { *; }
-dontwarn org.json.**

# Android Startup fix
-keep class androidx.startup.** { *; }
-dontwarn androidx.startup.**

# --- CREDO PAY & OTHERS ---
-keep class in.credopay.** { *; }
-dontwarn in.payu.**
-dontwarn com.gemalto.**
-dontwarn com.tom_roush.**

# Retrofit & OkHttp
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**
-dontwarn okhttp3.**

# Device Number Fix
-keep class com.reactlibrary.devicenumber.** { *; }
-dontwarn com.google.android.gms.auth.api.credentials.**

-ignorewarnings