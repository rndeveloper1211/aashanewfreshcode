import { translate } from "../../utils/languageUtils/I18n";
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';

const OtherLinks = () => {
  const [inforeport, setInforeport] = useState([]);
  const [inforeport2, setInforeport2] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useAxiosHook();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const demoData = [
    { Name: 'Aadhar Face Driver', Link: 'https://play.google.com/store/search?q=aadhaar+face+rd' },
    { Name: 'Startek L1', Link: 'https://play.google.com/store/search?q=startek+l1+rd+service' },
    { Name: 'Mantra MFS110 L1', Link: 'https://play.google.com/store/apps/details?id=com.mantra.mfs110.rdservice' },
    { Name: 'Morpho L1', Link: 'https://play.google.com/store/search?q=morpho%20l1' },
  ];

  const masterBankList = {
    "accounts": [
      { "bank_name": "ICICI Bank", "link": "https://buy.icicibank.com/ucj/accounts" },
      { "bank_name": "Axis Bank", "link": "https://www.axisbank.com/retail/accounts" },
      { "bank_name": "IDFC First Bank", "link": "https://digital.idfcfirstbank.com/apply/savings" },
      { "bank_name": "Central Bank of India", "link": "https://vkyc.centralbank.co.in/home" },
      { "bank_name": "Union Bank of India", "link": "https://www.unionbankofindia.co.in/english/saving-account.aspx" },
      { "bank_name": "HDFC Bank", "link": "https://applyonline.hdfcbank.com/savings-account" },
      { "bank_name": "State Bank of India", "link": "https://sbi.co.in/web/yono/insta-plus" },
    ],
    "demat_accounts": [
      { "service_provider": "Motilal Oswal", "link": "https://moriseapp.page.link/DoWR7HduvjtkyvWr7" },
      { "service_provider": "Angel One", "link": "https://angel-one.onelink.me/Wjgr/xna61v25" }
    ]
  }

  const fetchReports = async () => {
    try {
      const response = await get({ url: `${APP_URLS.OtherLinks}` });
      if (response && response.uploadlink_list) {
        setInforeport([...response.uploadlink_list, ...demoData]);
      } else {
        setInforeport(demoData);
      }
    } catch (error) {
      setInforeport(demoData);
    } finally {
      setLoading(false);
    }
  };

  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (APP_URLS.AppName === 'Master Bank') {
      setInforeport(masterBankList['accounts']);
      setInforeport2(masterBankList['demat_accounts']);
      setLoading(false);
    } else {
      fetchReports();
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 2, duration: 1000, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 0, duration: 1000, easing: Easing.linear, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#FF5252', '#FFD700', '#4CAF50'],
  });

  const openURL = (url) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open link"));
  };

  const renderCard = (title, url, isDemat = false) => (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardInfo}>
        <View style={[styles.iconPlaceholder, {backgroundColor: colorConfig.primaryColor + '20'}]}>
           <Text style={{color: colorConfig.primaryColor, fontWeight: 'bold'}}>{title.charAt(0)}</Text>
        </View>
        <Text style={[styles.nameText, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => openURL(url)} 
        style={[styles.actionBtn, {backgroundColor: colorConfig.primaryColor}]}
      >
        <Text style={styles.actionBtnText}>{translate("Open")}</Text>
        <Animated.Text style={[styles.animBadge, { color: textColor }]}>● Live</Animated.Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.main, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppBarSecond
        title={APP_URLS.AppName === 'Master Bank' ? "Digital Services" : "Important Links"}
        onPressBack={() => {}}
      />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colorConfig.primaryColor} />
        </View>
      ) : (
        <FlatList
          data={[{key: 'section1'}]} // Wrapper for two lists
          contentContainerStyle={{paddingBottom: 40}}
          renderItem={() => (
            <>
              {/* Section 1 */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, {color: isDark ? '#bbb' : '#555'}]}>
                  {APP_URLS.AppName === "Master Bank" ? "SAVINGS ACCOUNTS" : "RESOURCES"}
                </Text>
              </View>
              <FlatList
                data={inforeport}
                scrollEnabled={false}
                keyExtractor={(_, index) => `list1-${index}`}
                renderItem={({ item }) => renderCard(
                  APP_URLS.AppName === 'Master Bank' ? item.bank_name : item.Name?.toUpperCase(),
                  item.Link || item.link
                )}
              />

              {/* Section 2 (Only for Master Bank) */}
              {APP_URLS.AppName === "Master Bank" && inforeport2.length > 0 && (
                <>
                  <View style={[styles.sectionHeader, {marginTop: 20}]}>
                    <Text style={[styles.sectionTitle, {color: isDark ? '#bbb' : '#555'}]}>DEMAT ACCOUNTS</Text>
                  </View>
                  <FlatList
                    data={inforeport2}
                    scrollEnabled={false}
                    keyExtractor={(_, index) => `list2-${index}`}
                    renderItem={({ item }) => renderCard(item.service_provider, item.link, true)}
                  />
                </>
              )}
            </>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center' },
  sectionHeader: {
    paddingHorizontal: wScale(20),
    marginVertical: hScale(12),
  },
  sectionTitle: {
    fontSize: wScale(12),
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wScale(16),
    marginVertical: hScale(6),
    padding: wScale(12),
    borderRadius: 16,
    // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 4,
  },
  cardLight: { backgroundColor: '#FFFFFF' },
  cardDark: { backgroundColor: '#1E1E1E' },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconPlaceholder: {
    width: wScale(40),
    height: wScale(40),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wScale(12),
  },
  nameText: {
    fontSize: wScale(15),
    fontWeight: '700',
    flex: 1,
  },
  textLight: { color: '#2D3436' },
  textDark: { color: '#E0E0E0' },
  actionBtn: {
    paddingHorizontal: wScale(14),
    paddingVertical: hScale(8),
    borderRadius: 10,
    alignItems: 'center',
    minWidth: wScale(80),
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: wScale(13),
    fontWeight: 'bold',
  },
  animBadge: {
    fontSize: wScale(9),
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});

export default OtherLinks;