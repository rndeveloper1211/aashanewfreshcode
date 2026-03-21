import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, PermissionsAndroid, NativeModules, Alert, Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { setDeviceInfo } from '../../reduxUtils/store/userInfoSlice';

const { LocationModule } = NativeModules;

export const useLocationManager = () => {

  const dispatch = useDispatch();

  const [isLoading2, setIsLoading2] = useState(true);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const isFetching = useRef(false);

  const getStaticInfo = () => ({
    brand: DeviceInfo.getBrand(),
    modelNumber: DeviceInfo.getModel(),
    androidVersion: DeviceInfo.getSystemVersion(),
    packageName: DeviceInfo.getBundleId(),
  });

  // ---------------- DEVICE + LOCATION FETCH ----------------

  const fetchDeviceInfo = useCallback(async () => {

    if (isFetching.current) return false;

    try {

      isFetching.current = true;

      const [buildId, ip, uniqueId, carrier] = await Promise.all([
        DeviceInfo.getBuildId(),
        DeviceInfo.getIpAddress(),
        DeviceInfo.getUniqueId(),
        DeviceInfo.getCarrier()
      ]);

      let locData = null;

      if (LocationModule) {

        const isEnabled = await LocationModule.isLocationEnabled();

        if (!isEnabled) return false;

        const loc = await Promise.race([
          LocationModule.getCurrentLocation(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT")), 8000)
          )
        ]);

        if (loc && loc.latitude !== '0' && loc.latitude !== 0) {
          locData = loc;
        }
      }

      if (locData) {

        const finalData = {
          ...getStaticInfo(),
          ipAddress: ip || '0.0.0.0',
          uniqueId,
          buildId,
          net: carrier || 'wifi/net',
          ...locData,
        };

        dispatch(setDeviceInfo(finalData));

        setLocationAllowed(true);

        return true;
      }

      return false;

    } catch (e) {

      console.log("Fetch Attempt Failed:", e.message);

      return false;

    } finally {

      isFetching.current = false;

    }

  }, [dispatch]);

  // ---------------- STRICT LOCATION FLOW ----------------

  const forceFetchStrictData = useCallback(async () => {

    setIsLoading2(true);

    // -------- Permission --------

    if (Platform.OS === 'android') {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {

        Alert.alert(
          "Permission Required",
          "This app requires location permission.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings()
            }
          ]
        );

        setIsLoading2(false);
        return;
      }
    }

    // -------- Retry Logic --------

    let success = false;
    let attempts = 0;

    while (!success && attempts < 5) {

      const isEnabled = await LocationModule?.isLocationEnabled?.();

      if (!isEnabled) {

        const status = await LocationModule?.requestGPSEnabling?.();

        if (status !== "ENABLED") {

          Alert.alert(
            "GPS Required",
            "Please enable GPS to continue.",
            [
              {
                text: "Enable GPS",
                onPress: () => forceFetchStrictData()
              }
            ]
          );

          setIsLoading2(false);
          return;
        }
      }

      success = await fetchDeviceInfo();

      if (!success) {
        attempts++;
        await new Promise(res => setTimeout(res, 1500));
      }
    }

    if (!success) {

      Alert.alert(
        "Location Error",
        "Unable to fetch location. Please check GPS."
      );

    }

    setIsLoading2(false);

  }, [fetchDeviceInfo]);

  // ---------------- AUTO START ----------------

  useEffect(() => {
    forceFetchStrictData();
  }, [forceFetchStrictData]);

  return {
    isLoading2,
    locationAllowed,
    refreshStrictly: forceFetchStrictData
  };
};