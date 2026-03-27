package com.maxuspayy.location;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.LocationManager;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.Priority;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.Task;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;

public class LocationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final FusedLocationProviderClient fusedClient;

    public LocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.fusedClient = LocationServices.getFusedLocationProviderClient(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationModule";
    }

    // --- Naya Method: Direct GPS Popup dikhane ke liye ---
    @ReactMethod
    public void requestGPSEnabling(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("ACTIVITY_NULL", "Activity does not exist");
            return;
        }

        // Location Request setup
        LocationRequest locationRequest = new LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000)
                .setMinUpdateIntervalMillis(5000)
                .build();

        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest);

        SettingsClient client = LocationServices.getSettingsClient(activity);
        Task<LocationSettingsResponse> task = client.checkLocationSettings(builder.build());

        task.addOnSuccessListener(locationSettingsResponse -> {
            // GPS pehle se hi ON hai
            promise.resolve("ALREADY_ON");
        });

        task.addOnFailureListener(e -> {
            if (e instanceof ResolvableApiException) {
                try {
                    // Ye line system popup show karegi (Jisme OK/No Thanks hota hai)
                    ResolvableApiException resolvable = (ResolvableApiException) e;
                    resolvable.startResolutionForResult(activity, 1000);
                    promise.resolve("POPUP_SHOWN");
                } catch (IntentSender.SendIntentException sendEx) {
                    promise.reject("ERROR", "Error opening GPS popup");
                }
            } else {
                promise.reject("UNAVAILABLE", "Location settings are not resolvable");
            }
        });
    }

    @ReactMethod
    public void isLocationEnabled(Promise promise) {
        LocationManager locationManager = (LocationManager) reactContext.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager == null) {
            promise.resolve(false);
            return;
        }
        boolean gpsEnabled = false;
        try {
            gpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception e) { e.printStackTrace(); }
        promise.resolve(gpsEnabled);
    }

    @ReactMethod
    public void getCurrentLocation(Promise promise) {
        if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "Location permissions are not granted");
            return;
        }

        fusedClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, null)
                .addOnSuccessListener(location -> {
                    if (location == null) {
                        promise.reject("LOCATION_NULL", "Location not available. GPS might be OFF.");
                        return;
                    }

                    WritableMap map = Arguments.createMap();
                    double lat = location.getLatitude();
                    double lon = location.getLongitude();

                    map.putDouble("latitude", lat);
                    map.putDouble("longitude", lon);

                    try {
                        Geocoder geocoder = new Geocoder(reactContext, Locale.getDefault());
                        List<Address> addresses = geocoder.getFromLocation(lat, lon, 1);
                        if (addresses != null && !addresses.isEmpty()) {
                            Address addr = addresses.get(0);
                            map.putString("address", addr.getAddressLine(0) != null ? addr.getAddressLine(0) : "");
                            map.putString("city", addr.getLocality() != null ? addr.getLocality() : "");
                            map.putString("postalCode", addr.getPostalCode() != null ? addr.getPostalCode() : "");
                            map.putString("state", addr.getAdminArea() != null ? addr.getAdminArea() : "");
                        }
                    } catch (IOException e) {
                        clearAddressFields(map);
                    }

                    map.putString("ipAddress", getIPAddress());
                    promise.resolve(map);
                })
                .addOnFailureListener(e -> promise.reject("LOCATION_ERROR", e.getMessage()));
    }

    private void clearAddressFields(WritableMap map) {
        map.putString("address", "");
        map.putString("city", "");
        map.putString("postalCode", "");
        map.putString("state", "");
    }

    private String getIPAddress() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress() && !inetAddress.getHostAddress().contains(":")) {
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (Exception ignored) {}
        return "0.0.0.0";
    }
}