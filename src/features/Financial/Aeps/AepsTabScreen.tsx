import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, StyleSheet, Alert, Text, Modal,
  TouchableOpacity, ActivityIndicator,
  ScrollView, StatusBar, BackHandler,
} from 'react-native';
import { useSelector } from 'react-redux';

import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { hScale, wScale } from '../../../utils/styles/dimensions';

import { AepsContext } from './context/AepsContext';
import { RootState } from '../../../reduxUtils/store';

// ✅ Import service screens directly — so they render INSIDE the Provider
import AepsCW          from './AepsCashwithdrawl';
import BalanceCheck    from './Balancecheck';
import AepsMinistatement from './AepsMinistatement';
import AdharPay        from './aadharpay';

import CheckBlance    from '../../../utils/svgUtils/CheckBlance';
import Aeps           from '../../../utils/svgUtils/Aeps';
import AadharPaysvg   from '../../../utils/svgUtils/AadhaarPaysvg';
import StatementSvg   from '../../../utils/svgUtils/StatementSvg';
import { translate }  from '../../../utils/languageUtils/I18n';

// ─── Service screen map ───────────────────────────────────────────────────────
// Key must match SERVICES[].key below
const SCREEN_MAP: Record<string, React.ComponentType> = {
  AepsCW,
  BalanceCheck,
  AepsMiniStatement: AepsMinistatement,
  AadharPay:         AdharPay,
};

// ─── Service card config ──────────────────────────────────────────────────────
const SERVICES = [
  {
    key:      'AepsCW',
    title:    'Cash\nWithdrawal',
    subtitle: 'Withdraw cash via Aadhaar',
    icon:     <AadharPaysvg />,
    accent:   '#4CAF50',
    bg:       '#E8F5E9',
  },
  {
    key:      'BalanceCheck',
    title:    'Balance\nCheck',
    subtitle: 'Check account balance',
    icon:     <CheckBlance />,
    accent:   '#2196F3',
    bg:       '#E3F2FD',
  },
  {
    key:      'AepsMiniStatement',
    title:    'Mini\nStatement',
    subtitle: 'View last transactions',
    icon:     <StatementSvg />,
    accent:   '#FF9800',
    bg:       '#FFF3E0',
  },
  {
    key:      'AadharPay',
    title:    'Aadhaar\nPay',
    subtitle: 'Pay using Aadhaar',
    icon:     <Aeps />,
    accent:   '#9C27B0',
    bg:       '#F3E5F5',
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
const AepsTabScreen = () => {
  const navigation = useNavigation<any>();
  const { get }    = useAxiosHook();

  const { colorConfig, activeAepsLine } = useSelector((s: RootState) => s.userInfo);
  const color1     = colorConfig.primaryColor;
  const themeColor = activeAepsLine ? '#1FAA59' : '#F4C430';
  const themeBg    = activeAepsLine ? '#E8F5E9' : '#FFFDE7';

  // ── Which service screen is open (null = show grid) ──
  const [activeService, setActiveService] = useState<string | null>(null);

  // ── Status / modal ──
  const [UserStatus, setUserStatus]       = useState('');
  const [showEkycModal, setShowEkycModal] = useState(false);
  const [isProcessing, setIsProcessing]   = useState(false);

  const prevLineRef  = useRef(activeAepsLine);
  const isApiCalling = useRef(false);

  // ── Shared context state (passed to ALL child service screens) ──
  const [fingerprintData, setFingerprintData] = useState<any>();
  const [aadharNumber,    setAadharNumber]    = useState('');
  const [bankName,        setBankName]        = useState('');
  const [mobileNumber,    setMobileNumber]    = useState('');
  const [consumerName,    setConsumerName]    = useState('');
  const [isValid,         setIsValid]         = useState(false);
  const [deviceName,      setDeviceName]      = useState('Device');
  const [bankid,          setBankId]          = useState('');

  // ── Android back: if a service is open → go back to grid ──
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeService) {
        setActiveService(null);
        return true; // consume the event
      }
      return false;  // let navigator handle it
    });
    return () => sub.remove();
  }, [activeService]);

  // ── API: AEPS status ──
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
      console.error('AEPS status check error:', err?.message);
    }
  }, [activeAepsLine, get]);

  // ── API: eKYC status ──
  const CheckEkyc = useCallback(async () => {
    if (isApiCalling.current) return;
    try {
      setIsProcessing(true);
      isApiCalling.current = true;

      const finalUrl = activeAepsLine
        ? 'AEPS/api/Nifi/data/CheckEkyc'
        : APP_URLS.checkekyc;
      const response = await get({ url: finalUrl });

      if (typeof response === 'string' && response.includes('<!DOCTYPE html>')) {
        throw new Error('Server Error (404/500)');
      }

      const msg    = response?.Message;
      const status = response?.Status;

      if (status === true)        { await CheckAeps(); return; }
      if (msg === '2FAREQUIRED')  { setUserStatus('Success'); return; }
      if (msg === 'REQUIREDOTP')  { setUserStatus(msg); setShowEkycModal(true); return; }
      if (msg === 'REQUIREDSCAN') { navigation.navigate('Aepsekycscan'); return; }

      Alert.alert(
        translate('notice') || 'Notice',
        msg || 'Unknown Status',
        [{ text: 'Go Back', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert('API Error', e?.message || 'Internal Server Error');
    } finally {
      isApiCalling.current = false;
      setIsProcessing(false);
    }
  }, [activeAepsLine, get, CheckAeps]);

  useEffect(() => {
    if (prevLineRef.current !== activeAepsLine || UserStatus === '') {
      CheckEkyc();
      prevLineRef.current = activeAepsLine;
    }
  }, [activeAepsLine, CheckEkyc]);

  // ── Context value (shared across ALL service screens) ────────────────────
  const contextValue = {
    fingerprintData, setFingerprintData,
    aadharNumber,    setAadharNumber,
    consumerName,    setConsumerName,
    mobileNumber,    setMobileNumber,
    bankName,        setBankName,
    scanFingerprint: null,
    isValid,         setIsValid,
    deviceName,      setDeviceName,
    bankid,          setBankId,
  };

  // ── Render the currently active service screen ────────────────────────────
  const renderActiveService = () => {
    const Screen = SCREEN_MAP[activeService!];
    if (!Screen) return null;
    return (
      <View style={styles.root}>
        {/* Sub-screen header with back to grid */}
        <View style={[styles.header, { backgroundColor: color1 }]}>
          <TouchableOpacity
            onPress={() => setActiveService(null)}
            style={styles.backBtn}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>
              {SERVICES.find(s => s.key === activeService)?.title.replace('\n', ' ')}
            </Text>
            <Text style={styles.headerSub}>AEPS Services</Text>
          </View>
          <View style={[styles.lineChip, { backgroundColor: themeColor + '30' }]}>
            <View style={[styles.lineDot, { backgroundColor: themeColor }]} />
            <Text style={[styles.lineLabel, { color: themeColor }]}>
              {activeAepsLine ? 'NIFI' : 'Standard'}
            </Text>
          </View>
        </View>
        {/* ✅ Screen renders INSIDE AepsContext.Provider → context works! */}
        <Screen />
      </View>
    );
  };

  // ── Grid card ─────────────────────────────────────────────────────────────
  const ServiceCard = ({ item }: { item: (typeof SERVICES)[number] }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.card, { backgroundColor: item.bg, borderColor: item.accent + '35' }]}
      onPress={() => setActiveService(item.key)}   // ✅ no navigation.navigate
    >
      <View style={[styles.cardAccentBar, { backgroundColor: item.accent }]} />
      <View style={[styles.iconBubble, { backgroundColor: item.accent + '20' }]}>
        {item.icon}
      </View>
      <Text style={[styles.cardTitle, { color: item.accent }]}>{item.title}</Text>
      <Text style={styles.cardSub}>{item.subtitle}</Text>
      <View style={[styles.arrowChip, { backgroundColor: item.accent }]}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <AepsContext.Provider value={contextValue}>
      <StatusBar barStyle="light-content" backgroundColor={color1} />

      {/* If a service is active, render it (still inside Provider) */}
      {activeService ? (
        renderActiveService()
      ) : (
        <View style={styles.root}>

          {/* Grid header */}
          <View style={[styles.header, { backgroundColor: color1 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>AEPS Services</Text>
              <Text style={styles.headerSub}>Aadhaar Enabled Payment System</Text>
            </View>
            <View style={[styles.lineChip, { backgroundColor: themeColor + '30' }]}>
              <View style={[styles.lineDot, { backgroundColor: themeColor }]} />
              <Text style={[styles.lineLabel, { color: themeColor }]}>
                {activeAepsLine ? 'NIFI' : 'Standard'}
              </Text>
            </View>
          </View>

          {/* Body */}
          {isProcessing ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={color1} />
              <Text style={styles.loaderText}>
                {translate('checking_status') || 'Checking Status…'}
              </Text>
            </View>
          ) : UserStatus === 'Success' ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>Choose a Service</Text>
              <View style={styles.grid}>
                {SERVICES.map((item) => (
                  <ServiceCard key={item.key} item={item} />
                ))}
              </View>
              <Text style={styles.footerNote}>
                🔒 Transactions are secured via biometric authentication
              </Text>
            </ScrollView>
          ) : null}

          {/* eKYC modal */}
          <Modal
            visible={showEkycModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowEkycModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, { borderTopColor: themeColor }]}>
                <View style={[styles.modalIconCircle, { backgroundColor: themeBg }]}>
                  <Text style={{ fontSize: 26, color: themeColor }}>🔔</Text>
                </View>
                <Text style={[styles.modalTitle, { color: themeColor }]}>
                  {translate('Required') || 'Action Required'}
                </Text>
                <Text style={styles.modalBody}>
                  {translate('key_thisaeps_147') ||
                    'Please complete your e-KYC to proceed with this service.'}
                </Text>
                <View style={styles.modalRow}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setShowEkycModal(false)}
                  >
                    <Text style={styles.modalCancelText}>
                      {translate('cancel') || 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalPrimaryBtn, { backgroundColor: themeColor }]}
                    onPress={() => {
                      setShowEkycModal(false);
                      navigation.replace('Aepsekyc');
                    }}
                  >
                    <Text style={styles.modalPrimaryText}>
                      {translate('Complete_eKYC') || 'Complete eKYC'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </View>
      )}
    </AepsContext.Provider>
  );
};

export default AepsTabScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: hScale(14), paddingBottom: hScale(16),
    paddingHorizontal: wScale(16),
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 6,
  },
  backBtn:       { padding: 6, marginRight: 10 },
  backArrow:     { fontSize: 28, color: '#fff', fontWeight: '300', lineHeight: 30 },
  headerTextWrap:{ flex: 1 },
  headerTitle:   { fontSize: wScale(17), fontWeight: '800', color: '#fff' },
  headerSub:     { fontSize: wScale(11), color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  lineChip:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  lineDot:       { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  lineLabel:     { fontSize: wScale(11), fontWeight: '700' },

  loaderWrap:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText:    { marginTop: 12, fontSize: wScale(14), color: '#555' },

  scrollContent: { paddingHorizontal: wScale(14), paddingTop: hScale(20), paddingBottom: hScale(30) },
  sectionLabel:  {
    fontSize: wScale(13), fontWeight: '700', color: '#888',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: hScale(14),
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: wScale(12) },

  card: {
    width: '47.5%', borderRadius: 18, padding: wScale(15),
    borderWidth: 1.5, overflow: 'hidden', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, marginBottom: hScale(4),
  },
  cardAccentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  iconBubble:    { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: hScale(12) },
  cardTitle:     { fontSize: wScale(15), fontWeight: '800', lineHeight: 20, marginBottom: 4 },
  cardSub:       { fontSize: wScale(11), color: '#888', lineHeight: 15, marginBottom: hScale(14) },
  arrowChip:     { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  arrowText:     { color: '#fff', fontSize: wScale(13), fontWeight: '700' },

  footerNote: { textAlign: 'center', fontSize: wScale(11), color: '#aaa', marginTop: hScale(20) },

  modalOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  modalCard:       { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', borderTopWidth: 5, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 8 },
  modalIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  modalTitle:      { fontSize: wScale(18), fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  modalBody:       { fontSize: wScale(13), color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalRow:        { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalCancelBtn:  { flex: 1, height: 46, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  modalCancelText: { color: '#999', fontWeight: '600', fontSize: wScale(14) },
  modalPrimaryBtn: { flex: 1.5, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  modalPrimaryText:{ color: '#fff', fontWeight: '800', fontSize: wScale(14) },
});