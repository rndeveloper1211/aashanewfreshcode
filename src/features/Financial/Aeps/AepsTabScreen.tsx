import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { hScale, SCREEN_WIDTH, wScale } from '../../../utils/styles/dimensions';
import { colors } from '../../../utils/styles/theme';

import AdharPay from './aadharpay';
import BalanceCheck from './Balancecheck';
import AepsMinistatement from './AepsMinistatement';
import AepsCW from './AepsCashwithdrawl';

import { AepsContext } from './context/AepsContext';
import { RootState } from '../../../reduxUtils/store';

import CheckBlance from '../../../utils/svgUtils/CheckBlance';
import Aeps from '../../../utils/svgUtils/Aeps';
import AadharPaysvg from '../../../utils/svgUtils/AadhaarPaysvg';
import StatementSvg from '../../../utils/svgUtils/StatementSvg';
import { translate } from '../../../utils/languageUtils/I18n';

const AepsTabScreen = () => {
  const navigation = useNavigation<any>();
  const { get } = useAxiosHook();

  const { colorConfig, activeAepsLine } = useSelector(
    (state: RootState) => state.userInfo
  );
  const themeColor = activeAepsLine ? '#1FAA59' : '#F4C430'; // Green vs Yellow
  const themeBg = activeAepsLine ? '#E8F5E9' : '#FFFDE7';    // Light Green vs Light Yellow
  const textColor = activeAepsLine ? '#1B5E20' : '#856404'; // Deep Green vs Deep Brown
  const color1 = `${colorConfig.primaryColor}`;

  const [index, setIndex] = useState(0);
  const [UserStatus, setUserStatus] = useState('');
  const [showEkycModal, setShowEkycModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // PREVIOUS VALUES TRACKER: Taaki re-render par faltu API call na ho
  const prevLineRef = useRef(activeAepsLine);
  const prevIndexRef = useRef(index);
  const isApiCalling = useRef(false);

  // Context States
  const [fingerprintData, setFingerprintData] = useState<any>();
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [deviceName, setDeviceName] = useState('Device');
  const [bankid, setBankId] = useState('');

  const routes = [
    { key: 'AepsCW', title: 'Aeps' },
    { key: 'BalanceCheck', title: 'Check Bal' },
    { key: 'AepsMiniStatement', title: 'M. Statement' },
    { key: 'AadharPay', title: 'Aadhar Pay' },
  ];

  const renderScene = SceneMap({
    AepsCW: AepsCW,
    BalanceCheck: BalanceCheck,
    AepsMiniStatement: AepsMinistatement,
    AadharPay: AdharPay,
  });

  const getSvgimg = (key: string) => {
    switch (key) {
      case 'AepsCW': return <AadharPaysvg />;
      case 'BalanceCheck': return <CheckBlance />;
      case 'AadharPay': return <Aeps />;
      case 'AepsMiniStatement': return <StatementSvg />;
      default: return null;
    }
  };

  const CheckAeps = useCallback(async () => {
    try {
      const url = activeAepsLine
        ? 'AEPS/api/Nifi/data/AepsStatusCheck'
        : 'AEPS/api/data/AepsStatusCheck';

      const response = await get({ url });
      if (response?.Response === 'Success') {
        setUserStatus('Success');
      } else {
        navigation.navigate('ServicepurchaseScreen', { typename: 'AEPS' });
      }
    } catch (err: any) {
      console.error('AEPS STATUS CHECK ERROR:', err?.message);
    }
  }, [activeAepsLine, get]);

  const CheckEkyc = useCallback(async () => {
    if (isApiCalling.current) return;

    try {
      setIsProcessing(true);
      isApiCalling.current = true;
      const finalUrl = activeAepsLine ? 'AEPS/api/Nifi/data/CheckEkyc' : APP_URLS.checkekyc;

      const response = await get({ url: finalUrl });

      if (typeof response === 'string' && response.includes('<!DOCTYPE html>')) {
         throw new Error("Server Error (404/500)");
      }

      const msg = response?.Message;
      const status = response?.Status;

      if (status === true) {
        await CheckAeps();
        return;
      }

      if (msg === '2FAREQUIRED') {
        setUserStatus('Success');
        return;
      }

      if (msg === 'REQUIREDOTP') {
        
        setUserStatus(msg);
               setShowEkycModal(true);

        // if (activeAepsLine) {
        // } else {
        //   navigation.navigate('Aepsekyc');
        // }
        return;
      }

      if (msg === 'REQUIREDSCAN') {
        navigation.navigate('Aepsekycscan');
        return;
      }

      Alert.alert(translate('notice') || 'Notice', msg || 'Unknown Status', [
        { text: 'Go Back', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert("API Error", e?.message || "Internal Server Error");
    } finally {
      isApiCalling.current = false;
      setIsProcessing(false);
    }
  }, [activeAepsLine, get, CheckAeps]);

  // 🔥 MAIN LOGIC: Stop redundant calls
  useEffect(() => {
    // Agar activeAepsLine change hui ho YA pehli baar load ho raha ho
    // Tab hi call karega, har tab (index) change par nahi
    if (prevLineRef.current !== activeAepsLine || UserStatus === '') {
        CheckEkyc();
        prevLineRef.current = activeAepsLine;
    }
  }, [activeAepsLine, CheckEkyc]);

  return (
    <AepsContext.Provider
      value={{
        fingerprintData, setFingerprintData,
        aadharNumber, setAadharNumber,
        consumerName, setConsumerName,
        mobileNumber, setMobileNumber,
        bankName, setBankName,
        scanFingerprint: null,
        setIsValid, isValid,
        deviceName, setDeviceName,
        bankid, setBankId,
      }}
    >
      <View style={styles.container}>
        {isProcessing && (
           <View style={styles.loaderCenter}>
              <ActivityIndicator size="large" color={color1} />
              <Text style={{marginTop: 10}}>{translate("checking_status") || "Checking Status..."}</Text>
           </View>
        )}

        {UserStatus === 'Success' && !isProcessing && (
          <TabView
            lazy
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(newIndex) => {
                // Tab change hone par sirf index update karo, API call nahi hogi
                setIndex(newIndex);
            }}
            initialLayout={{ width: SCREEN_WIDTH }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={[
                  styles.indicator,
                  { backgroundColor: colorConfig.primaryColor },
                ]}
                style={[styles.tabbar, { backgroundColor: color1 }]}
                renderLabel={({ route, focused }) => (
                  <View style={styles.labelview}>
                    {getSvgimg(route.key)}
                    <Text
                      style={[
                        styles.labelstyle,
                        { color: focused ? colors.dark_black : colors.black75 },
                      ]}
                    >
                      {route.title}
                    </Text>
                  </View>
                )}
              />
            )}
          />
        )}

  <Modal
          visible={showEkycModal}
          transparent
          animationType="none"
          onRequestClose={() => setShowEkycModal(false)}
        >
          <View style={styles.modalBg}>
            <View style={[styles.modalCard, { borderTopWidth: 5, borderTopColor: themeColor }]}>
              
              {/* Dynamic Icon based on Line */}
              <View style={[styles.modalIconCircle, { backgroundColor: themeBg }]}>
                <Text style={{ fontSize: 24, color: themeColor }}>🔔</Text>
              </View>

              <Text style={[styles.modalTitle, { color: themeColor }]}>
                {translate("Required")}
              </Text>
              
              <Text style={styles.modalText}>
                {translate("key_thisaeps_147") || "Please complete your e-KYC to proceed with this service."}
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelTouch} 
                  onPress={() => setShowEkycModal(false)}
                >
                  <Text style={styles.backBtn}>
                    {translate("cancel") || "Cancel"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: themeColor }]}
                  onPress={() => {
                    setShowEkycModal(false);
                    navigation.replace('Aepsekyc');
                  }}
                >
                  <Text style={styles.btnText}>
                    {translate("Complete_eKYC") || "Complete eKYC"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </AepsContext.Provider>
  );
};

export default AepsTabScreen;

const styles = StyleSheet.create({

modalBg: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', // Thoda dark overlay professional lagta hai
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalCard: { 
    width: '85%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: { 
    fontSize: wScale(18), 
    fontWeight: '800', 
    textAlign: 'center',
    marginBottom: 10
  },
  modalText: { 
    fontSize: wScale(14),
    lineHeight: 20,
    textAlign: 'center', 
    color: '#666', 
    marginBottom: 25 
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  cancelTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    height: 45,
  },
  backBtn: { 
    color: '#888', 
    fontWeight: '600',
    fontSize: wScale(14) 
  },
  primaryBtn: { 
    flex: 1.5,
    height: 45,
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: wScale(14) 
  },

  container: { flex: 1, backgroundColor: '#fff' },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabbar: { elevation: 0, height: hScale(70), justifyContent: 'center' },
  indicator: { height: 3 },
  labelview: { alignItems: 'center', justifyContent: 'center' },
  labelstyle: { fontSize: wScale(11), marginTop: 4, fontWeight: '600' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalText: { marginVertical: 15, color: '#555' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  backBtn: { color: '#f0a500', padding: 10 },
  primaryBtn: { backgroundColor: '#1e7e34', padding: 10, borderRadius: 6 },
});