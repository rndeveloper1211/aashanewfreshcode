import { translate } from "../../utils/languageUtils/I18n";
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { RootState } from '../../reduxUtils/store';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Calendarsvg from '../drawer/svgimgcomponents/Calendarsvg';
import AadharPay from '../drawer/svgimgcomponents/AdharPaysvg';
import RechargeSvg from '../drawer/svgimgcomponents/RechargeSvg';
import Pansvg from '../drawer/svgimgcomponents/Pansvg';
import IMPSsvg from '../drawer/svgimgcomponents/IMPSsvg';
import Upisvg from '../drawer/svgimgcomponents/Upisvg';
import SearchIcon from '../drawer/svgimgcomponents/Searchicon';
import DateRangePicker from '../../components/DateRange';
const DayEarningReport = () => {
  const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const [inforeport, setInforeport] = useState([]);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const { get, post } = useAxiosHook();
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  useEffect(() => {
    DayE(selectedDate.from, selectedDate.to, selectedStatus);
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date);
    setOpen(false);
  };

  const DayE = async (from, to, status) => {
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];
      const url2 = `${APP_URLS.ShowActualIncome}${formattedFrom}`;
      const url = `${APP_URLS.dayErm}${formattedFrom}`;
      const response = await get({ url: IsDealer ? url2 : url });
      console.log(response);

      console.log(IsDealer ? url2 : url)
      if (response.Status === 'Failed') {
        setInforeport([]);
      } else {
        setInforeport(response.RESULT);

      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const dummyData = [
    { Type: 'Aeps', Amount: 0, TotalSuccess: 0, TotalPending: 0, TotalFailed: 0 },
    { Type: 'Recharge', Amount: 0, TotalSuccess: 0, TotalPending: 0, TotalFailed: 0 },
    { Type: 'Pancard', Amount: 0, TotalSuccess: 0, TotalPending: 0, TotalFailed: 0 },
    { Type: 'DMT', Amount: 0, TotalSuccess: 0, TotalPending: 0, TotalFailed: 0 },
    { Type: 'UPI', Amount: 0, TotalSuccess: 0, TotalPending: 0, TotalFailed: 0 },
  ];


  const getIcon = (type) => {
    switch (type) {
      case 'Aeps':
        return <AadharPay color='#000' />;
      case 'Recharge':
        return <RechargeSvg color='#000' />;
      case 'Pancard':
        return <Pansvg color='#000' />;
      case 'DMT':
        return <IMPSsvg color='#000' />;
      case 'UPI':
        return <Upisvg />;
      default:
        return null;
    }
  }
  const isDarkTheme = colorScheme === 'dark';
  const styles = getStyles(isDarkTheme);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const onDateChange1 = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };
  return (
    <View style={styles.main}>
      <AppBarSecond title={'Income Report'} />
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
      >
        <DateRangePicker

          onDateSelected={(from, to) => setSelectedDate({ from, to })}

          SearchPress={(from, to, status) => DayE(from, to, status)}

          status={selectedStatus}

          setStatus={setSelectedStatus}

          isStShow={false}

          isshowRetailer={false}
          retailerID={(id) => { console.log(id); }} setSearchnumber={function (string: any): void {
            throw new Error('Function not implemented.');
          }} cmsStatu={false} onlyFromDate={false}

        />

      </LinearGradient>

      <View style={styles.container}>


        <FlatList
          data={inforeport.length === 0 ? dummyData : inforeport}
          keyExtractor={(item) => item.Type}
          renderItem={({ item }) => (
            <View style={[styles.reportItem, { backgroundColor: color1 }]}>
              <Text style={styles.typeLabel}>{translate("Particular")}</Text>

              <View style={styles.reportHeader}>

                {getIcon(item.Type)}
                <View style={styles.typeContainer}>

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
        />
      </View>
    </View>
  );
};

const getStyles = (isDarkTheme) => StyleSheet.create({
  main: { flex: 1 },
  container: {
    flex: 1,
    padding: wScale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wScale(10),
  },

  datePicker: {
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
    borderWidth: wScale(1),
    borderColor: '#fff',
    paddingVertical: hScale(4)
  },
  dateText: {
    color: '#fff',
    fontSize: wScale(16),
  },
  date: {
    color: '#fff',
    fontSize: wScale(14),
  },

  reportItem: {
    padding: wScale(10),
    borderRadius: 5,
    marginBottom: hScale(10),
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    flex: 1,
    marginLeft: wScale(5),
  },
  typeLabel: {
    fontSize: wScale(11),
    color: '#000',
    paddingBottom: hScale(4)
  },
  type: {
    fontSize: wScale(14),
    fontWeight: 'bold',
    color: '#000',
  },
  earnContainer: {
    alignItems: 'flex-end',
  },
  earnLabel: {
    fontSize: wScale(11),
    color: '#000',
  },
  earnAmount: {
    fontSize: wScale(14),
    fontWeight: 'bold',
    color: '#000',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hScale(10),
  },
  footerItem: {
    alignItems: 'center',
    borderWidth: wScale(.5),
    borderRadius: 100,
    paddingHorizontal: wScale(20),
    paddingVertical: hScale(2)
  },
  footerLabel: {
    fontSize: wScale(12),
    color: '#000',
  },
  footerAmount: {
    fontSize: wScale(14),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default DayEarningReport;
