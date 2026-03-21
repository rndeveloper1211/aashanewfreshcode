import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { hScale, wScale } from '../../utils/styles/dimensions';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import LinearGradient from 'react-native-linear-gradient';
import Calendarsvg from '../drawer/svgimgcomponents/Calendarsvg';
import SearchIcon from '../drawer/svgimgcomponents/Searchicon';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import DateRangePicker from '../../components/DateRange';
import { translate } from '../../utils/languageUtils/I18n';
import ShowLoader from '../../components/ShowLoder';
import isEmpty from 'lodash/isEmpty';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';

const DayBookReport = () => {
  const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo)
  const color1 = `${colorConfig.secondaryColor}20`
const [loading,setIsLoading]= useState(true)
  const [inforeport, setInforeport] = useState([]);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const { get, post } = useAxiosHook();
  const colorScheme = useColorScheme();
  const [days, setDays] = useState([])
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  useEffect(() => {
    DayE(selectedDate.from, selectedDate.to);
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date);
    setOpen(false);
  };

const DayE = async (from, to) => {
  setIsLoading(true);
  try {
    const formattedFrom = new Date(from).toISOString().split('T')[0];
    const formattedTo = new Date(to).toISOString().split('T')[0];

    const url = `${APP_URLS.daybook}from=${formattedFrom}&to=${formattedTo}`;

    const response = await get({ url });

    console.log('DAYBOOK RESPONSE', response);

    // ✅ FIXED HERE
    setInforeport(response?.data || []);
    setDays({ days: Number(response?.durations || 0) });

  } catch (error) {
    console.error('Error fetching data:', error);
    setInforeport([]);
  } finally {
    setIsLoading(false);
  }
};


  const getDateDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const timeDiff = Math.abs(d2 - d1);

    const days = Math.floor(timeDiff / (1000 * 3600 * 24));

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    return {
      days,
      years,
      months
    };
  };





  const isDarkTheme = colorScheme === 'dark';
  const styles = getStyles(isDarkTheme);
  const FinancialRow = ({ label, value }) => (

    <View style={styles.financialRow}>

      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{`\u{20B9} ${value}`}</Text>

    </View>

  );

const renderItem = ({ item }) => {
  const {
    openbal,
    RCH,
    PURCHASE,
    AEPS,
    IMPS,
    PAN,
    OLDDAYREFUND,
    OLDDAYFAILED,
    DIFF,
    closebal,
  } = item;

  const fromDate = new Date(selectedDate.from).toISOString().split('T')[0];
  const toDate = new Date(selectedDate.to).toISOString().split('T')[0];

  const diffColor = DIFF < 0 ? '#d32f2f' : '#2e7d32';

  return (
    <View
      style={{
        marginHorizontal: 14,
        marginVertical: 10,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      {/* 🔹 HEADER */}
      <View
        style={{
          backgroundColor: color1 || '#5e35b1',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 14,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ color: colorConfig.primaryColor, fontSize: 12 }}>
              {translate('From Date')}
            </Text>
            <Text style={{ color: colorConfig.secondaryColor, fontSize: 14, fontWeight: '600' }}>
              {fromDate}
            </Text>
          </View>

          <View>
            <Text style={{ color: colorConfig.labelColor, fontSize: 12, textAlign: 'center' }}>
              {translate('Duration')}
            </Text>
            <Text
              style={{
                color:colorConfig.secondaryButtonColor,
                fontSize: 15,
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              {days.days} Days
            </Text>
          </View>

          <View>
            <Text style={{ color:  colorConfig.primaryColor, fontSize: 12 }}>
              {translate('To Date')}
            </Text>
            <Text style={{ color:  colorConfig.secondaryColor, fontSize: 14, fontWeight: '600' }}>
              {toDate}
            </Text>
          </View>
        </View>
      </View>

      {/* 🔹 BODY */}
      <View style={{ padding: 16 }}>
        {/* Always show all rows, even if value is 0 */}
        <FinancialRow label="Opening Balance" value={openbal} />
        <FinancialRow label="Recharge" value={RCH} />
        <FinancialRow label="Purchase" value={PURCHASE} />
        <FinancialRow label="AEPS" value={AEPS} />
        <FinancialRow label="IMPS" value={IMPS} />
        <FinancialRow label="PAN" value={PAN} />
        <FinancialRow label="Old Day Refund" value={OLDDAYREFUND} />
        <FinancialRow label="Old Day Failed" value={OLDDAYFAILED} />

        {/* 🔹 DIFFERENCE - Show even if 0, as per user request */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            paddingVertical: 8,
            paddingHorizontal: 10,
            backgroundColor: diffColor + '15',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 14, color: '#555' }}>{translate("Other_Difference")}</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: diffColor,
            }}
          >
            ₹ {DIFF}
          </Text>
        </View>

        <FinancialRow label="Close Balance" value={closebal} />
      </View>
    </View>
  );
};

  return (
    <View style={styles.main}>
      {loading &&<ShowLoader/>}
      <AppBarSecond title={'Day Book'} />
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}>

        <DateRangePicker

          onDateSelected={(from, to) => setSelectedDate({ from, to })}

          SearchPress={(from, to, status) => DayE(from, to)}

          status={selectedStatus}

          setStatus={setSelectedStatus}

          isStShow={false}

          isshowRetailer={false}
          retailerID={(id) => { console.log(id) }}
        />
      </LinearGradient>
      <View style={styles.container}>

        {!IsDealer ? <FlatList
    ListEmptyComponent={
            
            
            <NoDatafound/>
          }
          data={inforeport}

          renderItem={renderItem}

          keyExtractor={(item, index) => index.toString()}

          contentContainerStyle={styles.listContainer}

        /> : 
        
        <FlatList
          data={inforeport}
          keyExtractor={(item) => item.Type}
          ListEmptyComponent={
            
            
            <NoDatafound/>
          }
          renderItem={({ item }) => (
            <View style={styles.reportItem}>
              <View style={styles.reportHeader}>
                <View style={styles.typeContainer}>
                  <Text style={styles.typeLabel}>{translate("Particular")}</Text>
                  <Text style={styles.type}>{item.Type}</Text>
                </View>
                <View style={styles.earnContainer}>
                  <Text style={styles.earnLabel}>{translate("Earn")}</Text>
                  <Text style={styles.earnAmount}>{`\u20B9 ${item.Amount}`}</Text>
                </View>
              </View>
              <View style={styles.reportFooter}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>{translate("Total_Success")}</Text>
                  <Text style={styles.footerAmount}>{`\u20B9 ${item.TotalSuccess}`}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>{translate("Total_Pending")}</Text>
                  <Text style={styles.footerAmount}>{`\u20B9 ${item.TotalPending}`}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>{translate("Total_Failed")}</Text>
                  <Text style={styles.footerAmount}>{`\u20B9 ${item.TotalFailed}`}</Text>
                </View>
              </View>
            </View>
          )}
        />}

      </View>
    </View>
  );
};

const getStyles = (isDarkTheme) => StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: isDarkTheme ? '#121212' : '#f0f0f0',
  },
  container: {
    paddingTop: wScale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wScale(10),
    borderRadius: 5,
  },
  datePickerButton: {
    paddingHorizontal: wScale(10),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wScale(1),
    borderColor: '#fff',

  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wScale(15),
    backgroundColor: '#007bff',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: wScale(1),

  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(14),
  },


  title: {
    color: '#fff',
    fontSize: 20,
  },
  datePicker: {
    backgroundColor: '#03dac6',
    padding: 10,
    borderRadius: 5,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  loader: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  reportItem: {
    backgroundColor: isDarkTheme ? '#1f1f1f' : '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    flex: 1,
    marginLeft: 10,
  },
  typeLabel: {
    fontSize: 10,
    color: isDarkTheme ? '#fff' : '#000',
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDarkTheme ? '#fff' : '#000',
  },
  earnContainer: {
    alignItems: 'flex-end',
  },
  earnLabel: {
    fontSize: 10,
    color: isDarkTheme ? '#fff' : '#000',
  },
  earnAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDarkTheme ? '#fff' : '#000',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: isDarkTheme ? '#fff' : '#000',
  },
  footerAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDarkTheme ? '#fff' : '#000',
  },

  /////////////////
  listContainer: {

    padding: 10,

  },

  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal:wScale(10),
    paddingVertical:hScale(5)
   
  },
card2: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  dateContainer: {
    marginBottom: 10,

  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  datevalue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  differenceRow: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  differenceVisible: {

    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderRadius:4

  },

  differenceHidden: {

    backgroundColor: 'transparent',

  },
});

export default DayBookReport;
