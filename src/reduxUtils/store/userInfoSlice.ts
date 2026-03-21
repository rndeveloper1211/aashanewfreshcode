import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Authentication & User Identity
  authToken: '',
  refreshToken: '',
  userId: '',
  loginId: '',
  Mpin: '',
  fcmToken: '',
  isDemoUser: false,
  unLocked: false,

  // App Settings
  appLanguage: 'en',
  activeAepsLine: null, // 'aeps1' or 'aeps2'
  needUpdate: true,
  IsDealer: false,
  IsRington: true,
  IsOnLoc: false,
  isFingerprintEnabled: false,

  // UI & Theme
  colorConfig: {
    primaryColor: '#3A7DFF',
    secondaryColor: '#9D5B87',
    primaryButtonColor: '#F1C40F',
    secondaryButtonColor: '#E74C3C',
    labelColor: '#2ECC71'
  },
  themeChangeTime: { themeUpdateTime: null },

  // Location & Device Info
  Loc_Data: {
    let: null,
    long: null,
    isGPS: null
  },
  latitude: '0',
  longitude: '0',
  deviceInfo: {
    brand: null,
    ipAddress: null,
    modelNumber: null,
    uniqueId: null,
    androidVersion: null,
    buildId: null,
    net: null,
    latitude: '0',
    longitude: '0',
    address: 'Unknown',
    city: 'Unknown',
    postalCode: '000000',
  },

  // Business / Service Data
  dashboardData: {},
  sliderImageData: [],
  versionData: {},
  rceIdStatus: {
    status: null,
    status2: null
  },
  rceId: null,
  cmsVerify: false,
  rctype: null,
  rcPrePayAnomut: null,
  cmsAddMFrom: null,
  radiantList: null,

  // Partial Payment Data (Merged from 2nd code)
  isPartial: false,
  totalPartialAmount: 0,
  currentPartialAmount: 0,
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    // Auth Setters
    setAuthToken: (state, action) => { state.authToken = action.payload; },
    setRefreshToken: (state, action) => { state.refreshToken = action.payload; },
    setUserId: (state, action) => { state.userId = action.payload; },
    setLoginId: (state, action) => { state.loginId = action.payload; },
    setMpin: (state, action) => { state.Mpin = action.payload; },
    setFcmToken: (state, action) => { state.fcmToken = action.payload; },
    setIsDemoUser: (state, action) => { state.isDemoUser = action.payload; },
    setUnlocked: (state, action) => { state.unLocked = action.payload; },

    // App & UI Config
    setAppLanguage: (state, action) => { state.appLanguage = action.payload; },
    setColorConfig: (state, action) => { state.colorConfig = action.payload; },
    setThemeChangeTime: (state, action) => { state.themeChangeTime = action.payload; },
    setFingerprintStatus: (state, action) => { state.isFingerprintEnabled = action.payload; },
    setIsRington: (state, action) => { state.IsRington = action.payload; },
    
    // Status & Flag Setters
    setNeedUpdate: (state, action) => { state.needUpdate = action.payload; },
    setIsDealer: (state, action) => { state.IsDealer = action.payload; },
    setIsOnLoc: (state, action) => { state.IsOnLoc = action.payload; },
    setActiveAepsLine: (state, action) => { state.activeAepsLine = action.payload; },
    
    // Data Setters
    setVersionData: (state, action) => { state.versionData = action.payload; },
    setDashboardData: (state, action) => { state.dashboardData = action.payload; },
    setSliderImageData: (state, action) => { state.sliderImageData = action.payload; },
    
    // Location & Device
    setLoc_Data: (state, action) => { state.Loc_Data = action.payload; },
    setLatitude: (state, action) => { state.latitude = action.payload; },
    setLongitude: (state, action) => { state.longitude = action.payload; },
    setDeviceInfo: (state, action) => { state.deviceInfo = action.payload; },

    // Service Specific
    setRceIdStatus: (state, action) => { state.rceIdStatus = action.payload; },
    setRceID: (state, action) => { state.rceId = action.payload; },
    setCmsVerify: (state, action) => { state.cmsVerify = action.payload; },
    setRctype: (state, action) => { state.rctype = action.payload; },
    setRcPrePayAnomut: (state, action) => { state.rcPrePayAnomut = action.payload; },
    setCmsAddMFrom: (state, action) => { state.cmsAddMFrom = action.payload; },
    setRadiantList: (state, action) => { state.radiantList = action.payload; },
    clearEntryScreen: (state) => { state.cmsAddMFrom = null; },

    // Partial Amount Logic
    setIsPartial: (state, action) => { state.isPartial = action.payload; },
    setPartialAmounts: (state, action) => {
      const { total, current } = action.payload;
      state.totalPartialAmount = total;
      state.currentPartialAmount = current;
    },

    // Global Reset
    reset: () => initialState,
  },
});

export const {
  setAuthToken,
  setRefreshToken,
  setUserId,
  setLoginId,
  setMpin,
  setFcmToken,
  setIsDemoUser,
  setUnlocked,
  setAppLanguage,
  setColorConfig,
  setThemeChangeTime,
  setFingerprintStatus,
  setIsRington,
  setNeedUpdate,
  setIsDealer,
  setIsOnLoc,
  setActiveAepsLine,
  setVersionData,
  setDashboardData,
  setSliderImageData,
  setLoc_Data,
  setLatitude,
  setLongitude,
  setDeviceInfo,
  setRceIdStatus,
  setRceID,
  setCmsVerify,
  setRctype,
  setRcPrePayAnomut,
  setCmsAddMFrom,
  setRadiantList,
  clearEntryScreen,
  setIsPartial,
  setPartialAmounts,
  reset
} = userInfoSlice.actions;

export default userInfoSlice.reducer;