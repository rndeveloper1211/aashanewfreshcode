import { useCallback, useEffect, useRef, useState } from 'react';
import { PERMISSIONS, RESULTS, openSettings, requestMultiple } from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsOnLoc, setLoc_Data } from '../reduxUtils/store/userInfoSlice';
import { RootState } from '../reduxUtils/store';

export const useLocationHook = () => {
  const { colorConfig  ,Loc_Data} = useSelector((state: RootState) => state.userInfo);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(null);
  const [isgps, setIsGps] = useState(false);
  const isFetching = useRef(false);
  const dispatch = useDispatch();

  const showPermissionDialog = useCallback(() => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Permission Required',
      textBody: 'Please grant the location permission from settings.',
      closeOnOverlayTap: false,
      button: 'OK',
      onPressButton: () => {
        Dialog.hide();
        openSettings().catch(() => console.warn('Cannot open settings'));
      },
    });
  }, []);

  const getLocationData = useCallback(async (statuses) => {
    if (isFetching.current) return { latitude: '', longitude: '' };

    const hasFine = statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED;
    const hasCoarse = statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED;

    if (!hasFine && !hasCoarse) {
      setIsLocationPermissionGranted(false);
      return { latitude: '', longitude: '' };
    }

    setIsLocationPermissionGranted(true);
    isFetching.current = true;

    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: hasFine,
        timeout: 30000,
      });

      if (location) {
        const lat = location.latitude.toString();
        const long = location.longitude.toString();
        setLatitude(lat || Loc_Data['latitude']);
        setLongitude(long ||Loc_Data['longitude']);
        setIsGps(true);
        console.warn(lat, long,)

        if (location) {
          dispatch(setIsOnLoc(true));

          dispatch(setLoc_Data({
            latitude: lat,
            longitude: long,
            isGPS: false
          }));
        }


        return { latitude: lat, longitude: long };
      }
    } catch (error) {
      console.warn('Failed to get location:', error.message);

      // Handle "cancelled by another request"
      if (error.message === 'Location cancelled by another request') {
        // ToastAndroid.showWithGravity(
        //   'Retrying location...',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM
        // );
        // Retry once after 1s
        setTimeout(() => {getLocationData(statuses)}, 10000);
      } else {
        console.log(`${error.message === 'Location not available'}`,
        )

        dispatch(setLoc_Data({
          isGPS: true
        }));
        dispatch(setIsOnLoc(`${error.message === 'Location not available'}`));
        ToastAndroid.showWithGravity(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        setTimeout(() => {getLocationData(statuses), console.log( new Date())}, 20000);

      }
    } finally {
      isFetching.current = false;
    }

    return { latitude: '', longitude: '' };
  }, []);

  const getLocation = useCallback(async () => {
    try {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      ]);

      const granted =
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED ||
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED;

      if (granted) {
        return await getLocationData(statuses);
      } else {
        showPermissionDialog();
        return { latitude: '', longitude: '' };
      }
    } catch (e) {
      console.log('**DATA_LOC_ERR', e);
      return { latitude: '', longitude: '' };
    }
  }, [getLocationData, showPermissionDialog]);

  const checkLocationPermissionStatus = useCallback(async () => {
    const statuses = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    ]);

    const granted =
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED ||
      statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED;

    if (granted) {
      await getLocationData(statuses);
      return true;
    } else {
      return false;
    }
  }, [getLocationData]);

  const getLatLongValue = useCallback(() => {
    return { latitude, longitude };
  }, [latitude, longitude]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getLocation();
    }
    return () => {
      isMounted = false;
    };
  }, [getLocation]);

  return {
    isgps,
    latitude,
    longitude,
    isLocationPermissionGranted,
    getLocation,
    checkLocationPermissionStatus,
    getLatLongValue,
  };
};
