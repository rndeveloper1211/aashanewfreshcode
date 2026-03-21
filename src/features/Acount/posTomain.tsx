import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

// Utils & Hooks
import useAxiosHook from '../../utils/network/AxiosClient';
import { decryptData } from '../../utils/encryptionUtils';
import { SCREEN_WIDTH, hScale, wScale } from '../../utils/styles/dimensions';
import { translate } from "../../utils/languageUtils/I18n";

// Components
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';

const PostoMain = () => {
  const { colorConfig } = useSelector(state => state.userInfo);
  const themeColor = colorConfig?.primaryColor || '#0A84FF';
  const { get, post } = useAxiosHook();

  // --- States ---
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sheetType, setSheetType] = useState(null); // 'method' | 'account' | null
  const [bankList, setBankList] = useState([]);
  const [balance, setBalance] = useState({ posremain: '0', remainbal: '0.00' });
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'IMPS',
    selectedAccNo: '',
    transactionPin: '',
  });

  const routes = useMemo(() => [
    { key: 'bank', title: 'To Bank' },
    { key: 'mainWallet', title: 'Wallet' },
    { key: 'distributor', title: 'Distributor' },
  ], []);

  // --- Effects ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [bankRes, balRes] = await Promise.all([
        get({ url: 'WalletUnload/api/data/ShowbankdetailsforWalletToBank' }),
        get({ url: 'Retailer/api/data/Show_ALL_balanceremRem' }),
      ]);

      if (balRes?.data?.[0]) setBalance(balRes.data[0]);

      if (bankRes?.vvvv) {
        const decrypted = JSON.parse(
          decryptData(bankRes.vvvv, bankRes.kkkk, bankRes.bankdetails),
        );
        setBankList(decrypted?.data || []);
      }
    } catch (err) {
      console.error("Data Load Error:", err);
    }
  };

  // --- Handlers ---
  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleTransfer = async () => {
    const { amount, paymentMethod, selectedAccNo, transactionPin } = formData;
    const currentKey = routes[index].key;

    // Basic Validation
    if (!amount || parseFloat(amount) <= 0) {
      return Alert.alert('Invalid Amount', 'Please enter a valid amount.');
    }

    if (currentKey === 'bank' && (!selectedAccNo || !transactionPin)) {
      return Alert.alert('Missing Info', 'Please select a bank account and enter your PIN.');
    }

    setLoading(true);
    try {
      if (currentKey === 'bank') {
        // Step 1: Generate Transaction ID
        const initRes = await post({ 
          url: `WalletUnload/api/data/GenerateWalletTransectiongenerateid?Amount=${amount}&Type=${paymentMethod}&AccountNo=${selectedAccNo}` 
        });

        if (initRes?.sts === 'Success') {
          // Step 2: Final Request
          const finalRes = await post({
            url: `WalletUnload/api/data/AddWalletToBankRequest?Amount=${amount}&Type=${paymentMethod}&transid=${initRes.transferid}&dmtpin=${transactionPin}&BankAccountNo=${selectedAccNo}`,
          });
          Alert.alert('Status', finalRes?.Message || 'Request Processed');
          setFormData({ ...formData, amount: '', transactionPin: '' });
        } else {
          Alert.alert('Process Failed', initRes?.msg || 'Could not initiate transfer.');
        }
      } else {
        // Wallet or Distributor logic
        const url = currentKey === 'mainWallet' 
          ? `MPOS/api/mPos/pos_to_Wallet_TransferAmount?amount=${amount}`
          : `MPOS/api/mPos/pos_to_Distributor_TransferAmount?amount=${amount}`;
        
        const res = await post({ url });
        Alert.alert(res?.Status || 'Success', res?.msg || 'Transfer request submitted');
        updateForm('amount', '');
      }
      loadInitialData(); // Refresh balances
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- UI Components ---
  const renderScene = useCallback(({ route }) => (
    <ScrollView 
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Amount Input Card */}
      <View style={styles.glassCard}>
        <Text style={styles.inputLabel}>{translate("Enter_Amount")}</Text>
        <FlotingInput
          label="₹ 0.00"
          value={formData.amount}
          onChangeTextCallback={(v) => updateForm('amount', v)}
          keyboardType="number-pad"
        />
      </View>

      {/* Bank Specific Fields */}
      {route.key === 'bank' && (
        <View style={[styles.glassCard, { marginTop: hScale(20) }]}>
          <Text style={styles.inputLabel}>{translate("Payment_Method")}</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setSheetType('method')}>
            <Text style={styles.selectorText}>{formData.paymentMethod}</Text>
            <OnelineDropdownSvg />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>{translate("Bank_Account")}</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setSheetType('account')}>
            <Text style={styles.selectorText}>
              {formData.selectedAccNo ? `**** ${formData.selectedAccNo.slice(-4)}` : 'Choose Account'}
            </Text>
            <OnelineDropdownSvg />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>{translate("Transaction_PIN")}</Text>
          <FlotingInput
            label="Enter Security PIN"
            value={formData.transactionPin}
            onChangeTextCallback={(v) => updateForm('transactionPin', v)}
            secureTextEntry
            keyboardType="number-pad"
          />
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={loading || !formData.amount}
        onPress={handleTransfer}
        style={[
          styles.primaryButton, 
          { backgroundColor: (loading || !formData.amount) ? '#D1D1D6' : themeColor }
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>PROCEED TO TRANSFER</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  ), [formData, loading, themeColor]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        {/* Header with Balances */}
        <View style={[styles.header, { backgroundColor: themeColor }]}>
          <AppBarSecond title="Money Transfer" titlestyle={{ color: '#FFF' }} />
          <View style={styles.balanceContainer}>
            <View style={styles.balItem}>
              <Text style={styles.balLabel}>POS BALANCE</Text>
              <Text style={styles.balAmount}>₹{balance.posremain}</Text>
            </View>
            <View style={styles.balDivider} />
            <View style={styles.balItem}>
              <Text style={styles.balLabel}>MAIN WALLET</Text>
              <Text style={styles.balAmount}>₹{balance.remainbal}</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SCREEN_WIDTH }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: themeColor, height: 3 }}
              style={styles.tabBar}
              activeColor={themeColor}
              inactiveColor="#8E8E93"
              labelStyle={styles.tabLabel}
            />
          )}
        />

        {/* Bottom Selection Sheet */}
        <BottomSheet 
          isVisible={!!sheetType} 
          onBackdropPress={() => setSheetType(null)}
          containerStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {sheetType === 'method' ? 'Select Method' : 'Select Bank Account'}
            </Text>
            
            {sheetType === 'method' ? (
              ['IMPS', 'NEFT'].map(method => (
                <TouchableOpacity 
                  key={method} 
                  style={styles.sheetItem} 
                  onPress={() => { updateForm('paymentMethod', method); setSheetType(null); }}
                >
                  <Text style={styles.sheetItemText}>{method}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ height: 350 }}>
                <FlashList
                  data={bankList}
                  estimatedItemSize={70}
                  keyExtractor={(item) => item.BankAccountNo}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.sheetItem} 
                      onPress={() => { updateForm('selectedAccNo', item.BankAccountNo); setSheetType(null); }}
                    >
                      <View>
                        <Text style={styles.sheetItemText}>{item.AcconutHolderName}</Text>
                        <Text style={styles.sheetSubText}>{item.BankName} • {item.BankAccountNo}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </BottomSheet>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostoMain;

// --- Premium Styles (iOS Focused) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { 
    paddingBottom: hScale(25), 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24,
    elevation: 5,
  },
  balanceContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: wScale(20),
    borderRadius: 18,
    padding: hScale(16),
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  balItem: { flex: 1, alignItems: 'center' },
  balLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  balAmount: { color: '#FFF', fontSize: 19, fontWeight: '800', marginTop: 4 },
  balDivider: { width: 1, height: '70%', backgroundColor: 'rgba(255,255,255,0.3)' },
  
  tabBar: { backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  tabLabel: { fontWeight: '700', fontSize: 13, textTransform: 'none' },
  tabContent: { padding: 20 },
  
  glassCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 }
    })
  },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#8E8E93', marginBottom: 8, marginTop: 10, textTransform: 'uppercase' },
  selector: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  selectorText: { fontSize: 15, color: '#1C1C1E', fontWeight: '500' },
  
  primaryButton: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  
  bottomSheet: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25,
    minHeight: 300 
  },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#E5E5EA', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginBottom: 15, textAlign: 'center' },
  sheetItem: { paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: '#F2F2F7' },
  sheetItemText: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  sheetSubText: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
});