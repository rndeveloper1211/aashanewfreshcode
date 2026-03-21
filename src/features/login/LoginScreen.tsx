import React, { useCallback, useEffect, useRef, useState, version } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  NativeModules,
  Alert,
  ToastAndroid,
  Modal,
  Linking,
  Button,
  Animated,
  Easing,
  Platform,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { decryptData, encrypt } from '../../utils/encryptionUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { translate } from '../../utils/languageUtils/I18n';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../utils/styles/dimensions';
import {
  ALERT_TYPE,
  Dialog,

} from 'react-native-alert-notification';
import messaging from '@react-native-firebase/messaging';

import { APP_URLS } from '../../utils/network/urls';
import {
  setAuthToken,
  setColorConfig,
  setFcmToken,
  setFingerprintStatus,
  setIsDealer,
  setRefreshToken,
  setUserId,
} from '../../reduxUtils/store/userInfoSlice';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useLocationHook } from '../../hooks/useLocationHook';
import { colors } from '../../utils/styles/theme';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import DynamicButton from '../drawer/button/DynamicButton';
import DeviceInfo, { getBrand, getBuildId, getBuildNumber, getCarrier, getDevice, getDeviceId, getDeviceName, getIpAddress, getModel, getSerialNumber, getSystemName, getSystemVersion, getUniqueId, getVersion } from 'react-native-device-info';
import ShowEye from '../drawer/HideShowImgBtn/ShowEye';
import ForgotPasswordModal from '../../components/ForgotPassword';
import { SvgUri, } from 'react-native-svg';
import SplashScreen from './SplashScreen';
import OTPModal from '../../components/OTPModal';
import ShowLoader from '../../components/ShowLoder';
import CheckSvg from '../drawer/svgimgcomponents/CheckSvg';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import registerNotification, { listenFCMDeviceToken, onReceiveNotification2 } from '../../utils/NotificationService';
import { appendLog, generateUniqueId, requestStoragePermission } from '../../components/log_file_Saver';
import BorderLine from '../../components/BorderLine';
import { DemoConfig } from './DemouserData';
import { useLocationManager } from '../../utils/hooks/useLocationManager';
import SecurityBottomSheet from '../../components/SecurityBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LanguageButton from '../../components/LanguageButton';

const LoginScreen = () => {
  const { colorConfig, Loc_Data, deviceInfo, isDemoUser } = useSelector((state: RootState) => state.userInfo);
const [modalVisible,setModalVisible] = useState(false)
  const [userEmail, setUserEmail] = useState('9812363043');
  const [userPassword, setUserPassword] = useState('Sanjay@450');
  const [mobileNumber, setMobileNumber] = useState('7414088555');
  const [uniqueId, setUniqueId] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [androidVersion, setCurrentAndroidVersion] = useState('');
  const [brand, setBrand] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [remember, setRemember] = useState(false);
  const [passwordimgreadius, setPasswordimgreadius] = useState(Number);
  const [Radius1, setRadius1] = useState(Number);
  const [Radius2, setRadius2] = useState(Number);
  const [svg, setSvg] = useState([])
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { latitude, longitude, isLocationPermissionGranted, getLocation, checkLocationPermissionStatus, getLatLongValue } = useLocationHook();
  const { SecurityModule } = NativeModules;


  const { authToken, refreshToken } = useSelector(

    (state: RootState) => state.userInfo,
  );
  const [secToken, setSecToken] = useState('')
  const { locationAllowed, refreshStrictly } = useLocationManager();
  const [ShowOtpModal, setShowOtpModal] = useState(false);
  const [isVer, setIsVer] = useState(true);
  const [showEnable, setShowEnable] = useState(false)
  const { post, get } = useAxiosHook();


  const getDeviceInfo = useCallback(async () => {
    const buildId = await getBuildId();
    await getLocation();

    const brand = getBrand();
    const ip = await getIpAddress();
    const model = getModel();
    const serialNum = await getUniqueId();
    const systemVersion = getSystemVersion();

    setBrand(brand);
    setIpAddress(ip);
    setModelNumber(model);
    setUniqueId(brand || 'Oppo');
    setCurrentAndroidVersion(systemVersion);

    console.log('**DATA**', {
      brand,
      ip,
      model,
      serialNum,
      systemVersion,
      buildId
    });
  }, []);
  // Jab mobile number 10 digits ka ho jaye, tab turant call ho

  useEffect(() => {
    console.log('USEEFFECT MOUNTED ✅');
    getDeviceInfo();
  }, []);
  const deviceInfoRef = useRef(deviceInfo);

  // 2. Jab bhi deviceInfo change ho, Ref ko update karein
  useEffect(() => {
    deviceInfoRef.current = deviceInfo;
  }, [deviceInfo]);

  //console.log('**latitude, longitude', latitude, longitude);

  useEffect(() => {
    const onFocusCall = navigation.addListener('focus', async () => {
      // console.log('**DATA_PERM11_CALLED', isPhonePermissionGranted);
      console.log('**DATA_PERM77_CALLED', isLocationPermissionGranted);
      const Model = getMobileDeviceId();
    })
    return onFocusCall;
  }, [navigation, latitude, longitude]);

  const extsvg = (svgarray) => {
    const result = {};
    svgarray.forEach((item) => {
      result[item.name] = item.svg;
    });
    return result;
  };
  const [loading, setLoading] = useState(true);

  const saveCredentials = async (id: string, password: string) => {
    try {
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userPassword', password);
      console.log('Credentials saved successfully');
    } catch (error) {
      console.log('Error saving credentials: ', error);
    }
  };

  const getCredentials = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      const password = await AsyncStorage.getItem('userPassword');

      if (id !== null && password !== null) {
        setUserEmail(id);
        setUserPassword(password);
        console.log('Retrieved credentials: ', id, password);
        return { id, password };
      } else {
        console.log('No credentials found');
        return null;
      }
    } catch (error) {
      console.log('Error retrieving credentials: ', error);
      return null;
    }
  };



  useEffect(() => {
    getCredentials()
    const fetchData = async () => {
      try {
        getDeviceInfo();

        const model = getMobileDeviceId();
        console.log(model, "Modelaaaaaaaa");

        const res = await get({ url: APP_URLS.getColors });

        console.log(res, '************************************************************')
        if (res) {
          dispatch(
            setColorConfig({
              primaryColor: res.BACKGROUNDCOLOR1 || '#56ffb9',
              secondaryColor: res.BACKGROUNDCOLOR2 || '#00eaff',
              primaryButtonColor: res.BUTTONCOLOR1 || '#2a4fd7',
              secondaryButtonColor: res.BUTTONCOLOR2 || '#8c22d7',
              labelColor: res.LABLECOLOR || '#FFFFFF',
            }),
          );
        }

        const response = await post({ url: APP_URLS.signUpSvg });
        console.log(response, '************************************************************')

        if (response && Array.isArray(response)) {
          setRadius1(response[0].Radius2);
          setRadius2(response[0].Radius3);

          const svgList = extsvg(response);
          setSvg(svgList);
        }



        if (authToken) {
          navigation.navigate('Dashboard');
        }

        await checkNotificationPermission()

      } catch (error) {
        console.error('Error fetching data:', error);
        const response = await post({ url: APP_URLS.signUpSvg });
        console.log(response, '************************************************************')

        Alert.alert('Error', 'There was an issue fetching the data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
    };

  }, [authToken, dispatch, get, navigation]); // Dependencies to trigger the effect




  const { getMobileDeviceId, getSimPhoneNumber, isPhonePermissionGranted, checkPhoneStatePermissionStatus } = useDeviceInfoHook();




  const openSettings = () => {
    console.log('Settings can be opened manually on iOS');

    if (Platform.OS === 'android') {
      Linking.openSettings().catch(() => console.warn('Unable to open settings'));
    } else {
      console.log('Settings can be opened manually on iOS');
    }
  };
  const checkNotificationPermission = async () => {
    const permissionStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

    if (permissionStatus === RESULTS.GRANTED) {

      ToastAndroid.show('Notification permission granted', ToastAndroid.LONG);
    } else if (permissionStatus === RESULTS.DENIED) {
      console.log('Notification permission denied');

      requestNotificationPermission();

    } else if (permissionStatus === RESULTS.BLOCKED) {
      requestNotificationPermission();

      console.log('Notification permission blocked');
    } else {
      console.log('Notification permission status unknown');
    }
  };


  useEffect(() => {
    if (mobileNumber && mobileNumber.length >= 9) {
      const autoFetch = async () => {
        try {
          console.log("Mobile number reached 10 digits. Fetching location...");
          await refreshStrictly();
        } catch (err) {
          console.log("Auto location fetch failed", err);
        }
      };

      autoFetch();
          refreshStrictly()

    }
  }, [mobileNumber]);

  console.log(deviceInfo, '%%%%%%%%%%%%%%%%%%%%%%%%%%')
  const requestNotificationPermission = async () => {
    const permissionStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS); // Request notification permission on Android

    if (permissionStatus === RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      Alert.alert(
        'Notification permission not granted',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => null,
          },
          {
            text: 'Open Setting',
            onPress: () => openSettings(),
          },

        ],
        { cancelable: false }
      );
      console.log('Notification permission not granted');
    }
  };
  const safeValue = (val) => {
    if (val === null || val === undefined || val === '') {
      return 'NA';
    }
    return String(val);
  };
  const [iswritelog, setisWriteLog] = useState(false)
  const onPressLogin = useCallback(async (otp) => {
    const uniqueId = 'DEBUG_OPPO'; // Logic trace karne ke liye constant tag
    Keyboard.dismiss();
    setIsLoading(true);

    // Trace variables
    let debugRole = 'NOT_SET';
    let debugMsg = 'INITIAL_STATE';

    try {
      await appendLog(iswritelog, "--- START LOGIN PROCESS ---", uniqueId);
      await appendLog(iswritelog, `[DEBUG] OTP Received: ${otp}`, uniqueId);

      setShowOtpModal(false);

      // 1. Network Check Trace
      const net = (await getCarrier()) || 'wifi/net';
      await appendLog(iswritelog, `[DEBUG] Step 2 - Network Type: ${net}`, uniqueId);

      // 2. Data Preparation Trace
      const rawData = [
        safeValue(userEmail),
        safeValue(userPassword),
        otp,
        safeValue(mobileNumber),
        safeValue(deviceInfoRef?.buildId),
        safeValue(deviceInfoRef?.uniqueId),
        safeValue(Loc_Data?.latitude),
        safeValue(Loc_Data?.longitude),
        safeValue(deviceInfoRef?.modelNumber),
        safeValue(deviceInfoRef?.brand),
        safeValue(deviceInfoRef?.ipAddress),
        safeValue(deviceInfoRef?.address),
        safeValue(deviceInfoRef?.city),
        safeValue(deviceInfoRef?.postalCode),
        safeValue(net)
      ];
      await appendLog(iswritelog, `[DEBUG] Step 3 - Raw Data Array: ${JSON.stringify(rawData)}`, uniqueId);

      // 3. Encryption Debugging
      await appendLog(iswritelog, "[DEBUG] Step 4 - Starting Encryption...", uniqueId);
      const encryption = encrypt(rawData);

      if (!encryption) {
        await appendLog(iswritelog, "[FATAL] Step 4.1 - Encryption returned NULL", uniqueId);
        throw new Error('Encryption Object is null');
      }

      await appendLog(iswritelog, `[DEBUG] Step 5 - Encryption Key: ${encryption.keyEncode}`, uniqueId);
      await appendLog(iswritelog, `[DEBUG] Step 5.1 - Encryption IV: ${encryption.ivEncode}`, uniqueId);
      await appendLog(iswritelog, `[DEBUG] Step 5.2 - Encrypted Data Length: ${encryption?.encryptedData?.length}`, uniqueId);

      if (!encryption?.encryptedData || encryption.encryptedData.length < 15) {
        await appendLog(iswritelog, `[FATAL] Step 5.3 - Encrypted Data Array incomplete. Length: ${encryption?.encryptedData?.length}`, uniqueId);
        throw new Error('Incomplete Encrypted Data');
      }

      // 4. Payload Mapping Trace
      const loginData = {
        UserName: encryption.encryptedData[0],
        Password: encryption.encryptedData[1],
        'X-OTP': encryption.encryptedData[2],
        Mobile: encryption.encryptedData[3],
        Imei: encryption.encryptedData[4],
        Devicetoken: encryption.encryptedData[5],
        Latitude: encryption.encryptedData[6],
        Longitude: encryption.encryptedData[7],
        ModelNo: encryption.encryptedData[8],
        BrandName: encryption.encryptedData[9],
        IPAddress: encryption.encryptedData[10],
        City: encryption.encryptedData[11],
        Address: encryption.encryptedData[12],
        PostalCode: encryption.encryptedData[13],
        InternetTYPE: encryption.encryptedData[14],
        grant_type: 'password',
      };
      await appendLog(iswritelog, `[DEBUG] Step 6 - Final Payload mapped successfully`, uniqueId);

      // 5. API Request Debug
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'bearer',
          value1: encryption.keyEncode,
          value2: encryption.ivEncode,
        },
      };
      await appendLog(iswritelog, `[DEBUG] Step 7 - Request Headers: ${JSON.stringify(config.headers)}`, uniqueId);

      await appendLog(iswritelog, "[DEBUG] Step 8 - Calling POST API...", uniqueId);
      const response = await post({
        url: APP_URLS.getToken,
        data: loginData,
        config,
      });

      // 6. Response Trace
      if (!response) {
        await appendLog(iswritelog, "[FATAL] Step 9 - API Response is NULL or Undefined", uniqueId);
      } else {
        await appendLog(iswritelog, `[DEBUG] Step 9 - Raw API Response: ${JSON.stringify(response)}`, uniqueId);
      }

      /* ---------------- LOGIC HANDLING ---------------- */

      if (response?.access_token) {
        debugRole = response.role || 'No Role Found';
        debugMsg = `finally ${debugRole} Login process completed.`;

        await appendLog(iswritelog, `[SUCCESS] Step 10 - Token received. Role: ${debugRole}`, uniqueId);

        dispatch(setIsDealer(debugRole === 'Dealer'));

        if (response.VideoKYC === 'VideoKYCPENDING') {
          await appendLog(iswritelog, "[INFO] Step 11 - Video KYC Pending", uniqueId);
          Alert.alert('', 'Video KYC Uploaded. Wait for admin approval.');
          return;
        }

        authenticate(response);
        dispatch(setUserId(response?.userId));
        dispatch(setRefreshToken(response?.refresh_token));
        userData(response[".expires"]);

      } else if (response?.error) {
        debugRole = 'API_ERROR';
        debugMsg = response?.error_description || 'Unknown API Error';

        await appendLog(iswritelog, `[ERROR] Step 10 - API Error: ${debugMsg}`, uniqueId);
        Alert.alert('Login Error', debugMsg);

        if (response.error === 'SENDOTP') {
          setShowOtpModal(true);
        }
      } else {
        await appendLog(iswritelog, "[ERROR] Step 10 - Unexpected Response Format", uniqueId);
      }

    } catch (error) {
      debugRole = 'EXCEPTION';
      debugMsg = error.message;
      await appendLog(iswritelog, `[CRITICAL] Step CATCH - Exception: ${error.message}`, uniqueId);
      console.error('Login Exception:', error);
      ToastAndroid.show('An error occurred', ToastAndroid.LONG);

    } finally {
      await appendLog(iswritelog, `[FINISH] Step FINAL - Sending Notification with Title: ${debugRole}`, uniqueId);

      // Notification ko data persist karne ke liye force karein
      onReceiveNotification2({
        notification: {
          title: debugRole,
          body: debugMsg,
        },
      });

      setIsLoading(false);
      await appendLog(iswritelog, "--- END LOGIN PROCESS ---", uniqueId);
    }

  }, [dispatch, navigation, post, userEmail, userPassword, mobileNumber, Loc_Data]);


  const onPressLogin2 = useCallback(async (otp) => {
    const uniqueId = 'DEBUG_OPPO'; // Logic trace karne ke liye constant tag
    Keyboard.dismiss();
    setIsLoading(true);

    // Trace variables
    let debugRole = 'NOT_SET';
    let debugMsg = 'INITIAL_STATE';

    try {
      await appendLog(iswritelog, "--- START LOGIN PROCESS ---", uniqueId);
      await appendLog(iswritelog, `[DEBUG] OTP Received: ${otp}`, uniqueId);

      setShowOtpModal(false);

      // 1. Network Check Trace
      const net = (await getCarrier()) || 'wifi/net';
      await appendLog(iswritelog, `[DEBUG] Step 2 - Network Type: ${net}`, uniqueId);

      // 2. Data Preparation Trace
      const rawData = [
        safeValue(userEmail),           // Dynamic (Keep for login)
        safeValue(userPassword),        // Dynamic (Keep for login)
        '123456',                       // Hardcoded OTP (Testing only)
        '9876543210',                   // Hardcoded Mobile
        'BUILD_ID_TEST_123',            // Hardcoded buildId
        'UNIQUE_ID_OPPO_TEST',          // Hardcoded uniqueId
        '27.3681',                      // Hardcoded latitude
        '75.0427',                      // Hardcoded longitude
        'CPH2249',                      // Hardcoded modelNumber
        'OPPO',                         // Hardcoded brand
        '192.168.1.1',                  // Hardcoded ipAddress
        'Test Address, Sikar',          // Hardcoded address
        'Sikar',                        // Hardcoded city
        '332311',                       // Hardcoded postalCode
        'wifi'                          // Hardcoded net
      ];
      await appendLog(iswritelog, `[DEBUG] Step 3 - Raw Data Array: ${JSON.stringify(rawData)}`, uniqueId);

      // 3. Encryption Debugging
      await appendLog(iswritelog, "[DEBUG] Step 4 - Starting Encryption...", uniqueId);
      const encryption = encrypt(rawData);

      if (!encryption) {
        await appendLog(iswritelog, "[FATAL] Step 4.1 - Encryption returned NULL", uniqueId);
        throw new Error('Encryption Object is null');
      }

      await appendLog(iswritelog, `[DEBUG] Step 5 - Encryption Key: ${encryption.keyEncode}`, uniqueId);
      await appendLog(iswritelog, `[DEBUG] Step 5.1 - Encryption IV: ${encryption.ivEncode}`, uniqueId);
      await appendLog(iswritelog, `[DEBUG] Step 5.2 - Encrypted Data Length: ${encryption?.encryptedData?.length}`, uniqueId);

      if (!encryption?.encryptedData || encryption.encryptedData.length < 15) {
        await appendLog(iswritelog, `[FATAL] Step 5.3 - Encrypted Data Array incomplete. Length: ${encryption?.encryptedData?.length}`, uniqueId);
        throw new Error('Incomplete Encrypted Data');
      }

      // 4. Payload Mapping Trace
      const loginData = {
        UserName: encryption.encryptedData[0],
        Password: encryption.encryptedData[1],
        'X-OTP': encryption.encryptedData[2],
        Mobile: encryption.encryptedData[3],
        Imei: encryption.encryptedData[4],
        Devicetoken: encryption.encryptedData[5],
        Latitude: encryption.encryptedData[6],
        Longitude: encryption.encryptedData[7],
        ModelNo: encryption.encryptedData[8],
        BrandName: encryption.encryptedData[9],
        IPAddress: encryption.encryptedData[10],
        City: encryption.encryptedData[11],
        Address: encryption.encryptedData[12],
        PostalCode: encryption.encryptedData[13],
        InternetTYPE: encryption.encryptedData[14],
        grant_type: 'password',
      };
      await appendLog(iswritelog, `[DEBUG] Step 6 - Final Payload mapped successfully`, uniqueId);

      // 5. API Request Debug
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'bearer',
          value1: encryption.keyEncode,
          value2: encryption.ivEncode,
        },
      };
      await appendLog(iswritelog, `[DEBUG] Step 7 - Request Headers: ${JSON.stringify(config.headers)}`, uniqueId);

      await appendLog(iswritelog, "[DEBUG] Step 8 - Calling POST API...", uniqueId);
      const response = await post({
        url: APP_URLS.getToken,
        data: loginData,
        config,
      });

      // 6. Response Trace
      if (!response) {
        await appendLog(iswritelog, "[FATAL] Step 9 - API Response is NULL or Undefined", uniqueId);
      } else {
        await appendLog(iswritelog, `[DEBUG] Step 9 - Raw API Response: ${JSON.stringify(response)}`, uniqueId);
      }

      /* ---------------- LOGIC HANDLING ---------------- */

      if (response?.access_token) {
        debugRole = response.role || 'No Role Found';
        debugMsg = `finally ${debugRole} Login process completed.`;

        await appendLog(iswritelog, `[SUCCESS] Step 10 - Token received. Role: ${debugRole}`, uniqueId);

        dispatch(setIsDealer(debugRole === 'Dealer'));

        if (response.VideoKYC === 'VideoKYCPENDING') {
          await appendLog(iswritelog, "[INFO] Step 11 - Video KYC Pending", uniqueId);
          Alert.alert('', 'Video KYC Uploaded. Wait for admin approval.');
          return;
        }

        authenticate(response);
        dispatch(setUserId(response?.userId));
        dispatch(setRefreshToken(response?.refresh_token));
        userData(response[".expires"]);

      } else if (response?.error) {
        debugRole = 'API_ERROR';
        debugMsg = response?.error_description || 'Unknown API Error';

        await appendLog(iswritelog, `[ERROR] Step 10 - API Error: ${debugMsg}`, uniqueId);
        Alert.alert('Login Error', debugMsg);

        if (response.error === 'SENDOTP') {
          setShowOtpModal(true);
        }
      } else {
        await appendLog(iswritelog, "[ERROR] Step 10 - Unexpected Response Format", uniqueId);
      }

    } catch (error) {
      debugRole = 'EXCEPTION';
      debugMsg = error.message;
      await appendLog(iswritelog, `[CRITICAL] Step CATCH - Exception: ${error.message}`, uniqueId);
      console.error('Login Exception:', error);
      ToastAndroid.show('An error occurred', ToastAndroid.LONG);

    } finally {
      await appendLog(iswritelog, `[FINISH] Step FINAL - Sending Notification with Title: ${debugRole}`, uniqueId);

      // Notification ko data persist karne ke liye force karein
      onReceiveNotification2({
        notification: {
          title: debugRole,
          body: debugMsg,
        },
      });

      setIsLoading(false);
      await appendLog(iswritelog, "--- END LOGIN PROCESS ---", uniqueId);
    }

  }, [dispatch, navigation, post, userEmail, userPassword, mobileNumber, Loc_Data]);

  const authenticate = useCallback(async (authData) => {
    try {
      setIsLoading(true);
      const currentDevice = deviceInfoRef.current;
      const isDemo = DemoConfig.demoNumbers.includes(userEmail);
      if (!isDemo && (!currentDevice?.latitude || currentDevice?.latitude == "0")) {
        // Agar location nahi hai, toh refresh call karke ruk jao
        handleLocationError();
        return;
      }

      let fcmToken = '';
      // ... (Aapka existing FCM logic)

      const params = new URLSearchParams({
        Devicetoken: fcmToken,
        Imeino: currentDevice.uniqueId || 'NA',
        Latitude: isDemo ? DemoConfig.defaultLocation.latitude : currentDevice.latitude.toString() || "NA",
        Longitude: isDemo ? DemoConfig.defaultLocation.longitude : currentDevice.longitude.toString() || "NA",
        Address: isDemo ? DemoConfig.defaultLocation.address : currentDevice.address || "NA",
        City: isDemo ? DemoConfig.defaultLocation.city : currentDevice.city || "NA",
        PostalCode: isDemo ? DemoConfig.defaultLocation.postalCode : currentDevice.postalCode || "NA",
        ModelNo: currentDevice.modelNumber || "NA",
        IPAddress: currentDevice.ipAddress || "NA",
        InternetTYPE: currentDevice.net || "NA",
        simslote1: 'SIM1' || "NA",
        simslote2: 'SIM2' || "NA",
        brandname: currentDevice.brand || "NA"
      });

      const url = `http://native.${APP_URLS.baseWebUrl}Common/api/data/authenticate?${params.toString()}`;
      const authResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authData?.access_token}`,
        },
      });

      const json = await authResponse.json();
      console.error(json, 'handleLocationError');
      if (json.status === 'SUCCESS') {
        const status = await SecurityModule.checkDeviceSecurity();

        if (status === 'SECURE') {
          setShowEnable(true);
          setSecToken(authData?.access_token);
        } else {
          dispatch(setAuthToken(authData?.access_token));
        }



      } else if (json.status === 'False' || json.message.includes("Location")) {

        handleLocationError();
      } else {
        Alert.alert("Auth Failed", json.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, handleLocationError]); // Dependency array mein deviceInfo zaroori hai

  const handleLocationError = () => {

    Alert.alert(
      "Security Verification Failed",
      "For security purposes, we need to verify your exact location. Please ensure GPS is ON and permissions are granted.",
      [
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
        { text: "Cancel", style: "cancel" },
        {
          text: "Try Again",
          onPress: async () => {
            try {
              await refreshStrictly();
              // location flow dubara start
            } catch (e) {
              console.log("Retry location error", e);
            }
          },
        },
      ]
    );
  };
  const onPressSignUp = () => {

    //navigation.navigate("WebSignUp")
    navigation.navigate("SignUpScreen", {
      svg, Radius2

    });
  }


  const ToggleSecureEntry = () => {
    setSecureEntry(!secureEntry)
  }
  const verifyOtp = async (otp) => {
    try {
      const res = await post({ url: `Common/api/data/CHECKPASSCODEPASSWORD?Passscodes=${otp}` })
      const status = res.Status;
      const role = await AsyncStorage.getItem('role');

      if (status == 'BOXNOTOPEN') {
        if (role == 'Retailer') {
          navigation.navigate({ name: 'Dashboard' });

        } else {

        }
      }


    } catch (error) {

    }
  }

  const userData = async (expiryDate) => {

    try {
      await AsyncStorage.setItem('expiryDate', expiryDate);
      console.log('Data saved successfully!');
    } catch (error) {
      console.log('Error saving data: ', error);
    }
  };
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAutofilled, setIsAutofilled] = useState(false);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  const [latestVersion, setLatestVersion] = useState([]);
  const [lockActive, setLockActive] = useState('')
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const version = await get({ url: APP_URLS.current_version });
        setLatestVersion(version);


      } catch (error) {
        console.error('Version fetch error:', error);
      }
    };
    fetchVersion();

    const checkLock = async () => {
      const status = await SecurityModule.checkDeviceSecurity();
      console.log(status);
      setLockActive(status);
    };
    checkLock()
  }, []);
  if (isVer === false) {
    fadeIn();

    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f5d']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            elevation: 5, // Add shadow effect for elevation (Android)
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >{translate("Update_Available")}</Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
              color: '#555',
            }}
          >{translate("key_sorryfor_137")}</Text>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`https://${APP_URLS.baseWebUrl}/Home/DownloadAPK`).catch(err =>
                console.error('Failed to open URL: ', err)
              );
            }}
            style={{
              backgroundColor: '#008CBA',
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 'bold',
              }}
            >{translate("Update_Now")}</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: '#888',
            }}
          >{translate("key_iftheapp_186")}</Text>
        </Animated.View>
      </LinearGradient>
    );
  }
  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#87ceeb',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image source={require('../../../assets/images/app_logo.png')}
          style={[styles.imgstyle, {
            width: wScale(100),
            height: wScale(100),
          }]} resizeMode='contain' />
      </View>
    );
  }
  const handleEnable = () => {
    setShowEnable(false);
    dispatch(setFingerprintStatus(true))
    dispatch(setAuthToken(secToken));

  }
  const handleDesable = () => {

    setShowEnable(false)
    dispatch(setAuthToken(secToken))
  }
  return (
<KeyboardAwareScrollView
    style={{ flex: 1, backgroundColor: 'transparent' }} 
    contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }} 
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={0} 
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.main}>
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={styles.gradientContainer}>
        <ScrollView keyboardShouldPersistTaps={"handled"}>
<View style={{paddingLeft:wScale(380) ,top:hScale(5) }}>
    <LanguageButton />
</View>
          <View
            style={styles.container}>
            <View style={[styles.Logocontainer,]}>
              <Image source={require('../../../assets/images/app_logo.png')}
                style={styles.imgstyle} resizeMode='contain' />
              <Text style={{ color: colorConfig.secondaryColor ? colorConfig.secondaryColor : 'white', fontWeight: 'bold' }}>
                {APP_URLS.AppName}
              </Text>
            </View>


            <View style={[styles.inputContainer, { borderRadius: Radius1 }]}>
              <View style={styles.InputImage}>

                <SvgUri
                  height={hScale(48)}
                  width={hScale(48)}
                  uri={svg.personUser}
                />

              </View>
              <TextInput
                style={[styles.textInput,]}
                cursorColor={'white'}
                placeholder={translate('emailOrMobile')}
                autoCapitalize="none"
                placeholderTextColor={'white'}
                value={userEmail}
                onChangeText={text => setUserEmail(text)}
              />
            </View>


            <View style={[styles.inputContainer, { borderRadius: Radius1 }]}>
              <View style={styles.InputImage}>
                <SvgUri
                  height={hScale(48)}
                  width={hScale(48)}
                  uri={svg.Password}
                />
              </View>
              <TextInput
                style={[styles.textInput,]}
                cursorColor={'white'}
                placeholder={translate('password')}
                value={userPassword}
                onChangeText={text => setUserPassword(text)}
                placeholderTextColor={'#fff'}
                secureTextEntry={secureEntry}

              />
              {userPassword.length >= 5 ? (
                <View style={styles.righticon}>
                  <TouchableOpacity onPressOut={ToggleSecureEntry} onPressIn={ToggleSecureEntry}>
                    <ShowEye color1="#fff" color2="#fff" />
                  </TouchableOpacity>
                </View>
              ) : ''}

            </View>
            <View style={styles.forgetrow}>
              <TouchableOpacity style={[styles.rememberow,]}
                onPress={() => {
                  Keyboard.dismiss();
                  setRemember(!remember);
                  if (remember) {
                    saveCredentials(userEmail, userPassword);
                  }

                }} >
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();

                    setRemember(!remember);
                    if (remember) {
                      saveCredentials(userEmail, userPassword);
                    }

                  }}
                  style={styles.remember}>
                  {remember ?
                    <CheckSvg size={8} />
                    : null}
                </TouchableOpacity>
                <Text style={[styles.forgettext, { paddingLeft: wScale(4) }]}>
                  {translate('remember_me')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onLongPress={() => {
                  setisWriteLog(true);
                  console.log(iswritelog)
                }}
                onPress={() => { setShowForgotPasswordModal(true) }}
                style={styles.forgetbtn}
              >
                <Text style={[styles.forgettext, { color: iswritelog ? 'red' : '#ffff' }]}>
                  {translate('forgotPassword')}<Text style={{ fontWeight: 'bold', fontSize: 15 }}></Text>
                </Text>
              </TouchableOpacity>

            </View>
            <DynamicButton
              onlong={() => { onPressLogin2("") }}
              title={
                isLoading ? <ActivityIndicator color={colorConfig.labelColor} size="large" /> :
                  "Login"}
              onPress={() => {

                if (userEmail && userPassword) {
                  onPressLogin('');
                } else {
                  listenFCMDeviceToken()
                  ToastAndroid.show("Please enter valid User ID and Password, you cannot leave it blank", ToastAndroid.SHORT);
                }
              }} styleoveride={undefined}

            />

            <View style={styles.signup_continer}>
              <Text style={styles.donthave_text}>
                {translate('signupText')}
              </Text>

              <TouchableOpacity
                // onLongPress={()=>registerNotification()}
                onPress={onPressSignUp}>
                <Text
                  style={[styles.donthave_text, { fontWeight: 'bold', }]}>
                  {translate('signUp')}
                </Text>
              </TouchableOpacity>
            </View>
            <ForgotPasswordModal
              id={userEmail}
              showForgotPasswordModal={showForgotPasswordModal}
              setShowForgotPasswordModal={setShowForgotPasswordModal}
              handleForgotPassword={undefined}
            />
            <OTPModal
              setShowOtpModal={setShowOtpModal}
              disabled={otp.length !== 6}
              showOtpModal={ShowOtpModal}
              setMobileOtp={setOtp}
              verifyOtp={() => {
                onPressLogin(otp)
              }}
              inputCount={6}
              sendID={userEmail}
            />

          </View>
          <SecurityBottomSheet
            visible={showEnable}
            onEnable={handleEnable}
            onLater={handleDesable}

          />
        </ScrollView>
        <View style={styles.packageRow} >

          <Text style={styles.prevText}>
            {latestVersion.PackageName}

          </Text>

          <BorderLine height={'100%'} width={.5} style={{ backgroundColor: '#fff' }} />
          <Text style={styles.prevText}>
            App Version : V{latestVersion.currentversion}
          </Text>
        </View>
      </LinearGradient>
    </View ></KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  Logocontainer: {
    backgroundColor: 'rgba(255,255, 255, 0.5)',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wScale(180),
    height: wScale(180),
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: hScale(40),
    padding: hScale(8)
  },
  imgstyle: {
    flex: 1
  },

  main: {
    flex: 1
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
  },
  container: {
    paddingHorizontal: wScale(40),
    paddingTop: hScale(60),
  },
  inputContainer: {
    marginTop: hScale(24),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: 'white',
    borderWidth: 0.2,
    height: hScale(48),

  },
  InputImage: {
  },
  lotiimg: { flex: 1, height: wScale(35), width: wScale(35) },
  textInput: {
    flex: 1,
    fontSize: wScale(18),
    color: '#fff',
    // textAlign: 'center',                                                                                                                                                                                   
  },
  input: {
    color: 'black',
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    margin: wScale(5),
  },

  forgetrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hScale(20),
    paddingTop: hScale(7),
  },
  rememberow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  remember: {
    borderWidth: wScale(.8),
    borderColor: '#fff',
    height: wScale(14),
    width: wScale(14),
    alignItems: 'center',
    marginRight: wScale(0),
    justifyContent: 'center',
    borderRadius: 4
  },
  forgetbtn: {

    backgroundColor: 'transparent',
  },
  forgettext: {
    fontSize: wScale(15),
    color: '#fff',

  },
  signup_continer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: hScale(20)
  },
  donthave_text: {
    fontSize: wScale(14.5),
    color: 'white', marginRight: wScale(4),
  },
  righticon: {
    justifyContent: 'center',
    marginRight: wScale(20),
    opacity: .3
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: wScale(10),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  resendText: {
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendButton: {
    marginTop: 10,
  },
  prevText: {
    fontSize: wScale(12),
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: wScale(5),
    textAlignVertical: 'center',
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hScale(10),
    height: hScale(12)
  }
});
export default LoginScreen;
