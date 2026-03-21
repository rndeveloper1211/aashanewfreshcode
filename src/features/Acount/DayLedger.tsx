import { translate } from "../../utils/languageUtils/I18n";
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { hScale, wScale } from '../../utils/styles/dimensions';
import DateRangePicker from '../../components/DateRange';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import { FlashList } from '@shopify/flash-list';  

const DayLedgerReport = () => {
  const { colorConfig ,IsDealer} = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const [inforeport, setInforeport] = useState([]);
  const [loading, setLoading] = useState(false);
  const { get } = useAxiosHook();
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const retailerLedgerReport = async (from, to, status) => {
    setLoading(true);

    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];

    const url = `${APP_URLS.DealerLedger}${formattedFrom}`
      const response = await get({ url: IsDealer?url: `${APP_URLS.dayLedger}from=${formattedFrom}&to=${formattedTo}` });
      if (!response) {
        throw new Error('Network response was not ok');
      }
      setInforeport(IsDealer ?response.Report :response);
      console.log(response, 'resssss');
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retailerLedgerReport(selectedDate.from, selectedDate.to, selectedStatus);
  }, [selectedDate, selectedStatus]); 

  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const keyExtractor = (item, index) => index.toString();  

  // const renderItem = ({ item, index }) => (
  //   <View style={[styles.transactionContainer, { backgroundColor: color1 }]}>
  //     <View key={index} style={styles.transactionrow}>
  //       <View>
  //         <Text style={styles.timetext}>{translate("Transaction_Time")}</Text>
  //         <Text style={styles.timenumber}>{item.Date}</Text>
  //       </View>

  //       <View style={styles.postview}>
  //         <Text style={styles.timetext}>{translate("Amount")}</Text>
  //         <Text style={styles.timenumber}>₹ {item.Amount}</Text>
  //       </View>
  //     </View>

  //     <View style={styles.descriptionview}>
  //       <Text style={styles.transactionText}>{translate("Description")}</Text>
  //       <Text style={[styles.transactionText, { color: colorConfig.secondaryColor, paddingLeft: wScale(10) }]}>{item.Particulars}</Text>
  //     </View>

  //     <View style={styles.transactionrow}>
  //       <Text style={styles.transactionText}>
  //         {item.debit === 0.0 && item.credit === 0.0
  //           ? null
  //           : item.debit === 0.0
  //             ? 'Credit Balance: ₹ ' + item.credit
  //             : 'Debit Balance: ₹ ' + item.debit}
  //       </Text>

  //       <View style={styles.postview}>
  //         <Text style={styles.timetext}>{translate("Post_Balance")}</Text>
  //         <Text style={styles.timenumber}>₹ {item.Balance}</Text>
  //       </View>

  //     </View>
  //   </View>
  // );
const renderItem = ({ item }) => {
  const isCredit = item.debit === 0;

  return (
    <View style={[styles.card , { backgroundColor: '#fff'},
]}>
      
      {/* ===== HEADER ===== */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.dateText}>{item.Date}</Text>
          <Text style={styles.descText} numberOfLines={2}>
            {item.Particulars}
          </Text>
        </View>

        <Text
          style={[
            styles.amountText,
            { color: isCredit ? '#2ecc71' : '#e74c3c' },
          ]}
        >
          {isCredit ? '+' : '-'} ₹ {item.Amount}
        </Text>
      </View>

      {/* ===== DIVIDER ===== */}
      <View style={styles.divider} />

      {/* ===== FOOTER ===== */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.balanceLabel}>
            {isCredit ? 'Credit' : 'Debit'}
          </Text>
          <Text
            style={[
              styles.balanceValue,
              { color: isCredit ? '#2ecc71' : '#e74c3c' },
            ]}
          >
            ₹ {isCredit ? item.credit : item.debit}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.balanceLabel}>{translate("Post_Balance")}</Text>
          <Text style={styles.postBalance}>₹ {item.Balance}</Text>
        </View>
      </View>

    </View>
  );
};


  return (
    <View style={styles.main}>
      <AppBarSecond title={'Ledger Report'} />

      <DateRangePicker

        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => retailerLedgerReport(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        isStShow={false}
        isshowRetailer={false}
      />

      <View style={styles.container}>

        {loading ?
          <ActivityIndicator size="large" color={colorConfig.secondaryColor} />
          :
          inforeport.length === 0 ? (
            <NoDatafound />
          ) :
            <FlashList
              data={inforeport}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              estimatedItemSize={200}
            />

        }
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  main: { flex: 1 },
cardWrapper: {
  marginBottom: hScale(12),
  marginHorizontal: wScale(5),
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
},

cardInner: {
  backgroundColor: '#FFFFFFAA', // flutter opacity white
  borderRadius: 5,
  padding: wScale(10),
},

topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

bottomRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: hScale(5),
},

label: {
  fontSize: wScale(12),
  color: '#555',
},

value: {
  fontSize: wScale(14),
  fontWeight: 'bold',
  color: '#000',
},

// divider: {
//   height: 1,
//   backgroundColor: '#ddd',
//   marginVertical: hScale(6),
// },

descRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

descLabel: {
  fontSize: wScale(14),
  color: '#000',
},

descValue: {
  fontSize: wScale(14),
  textAlign: 'right',
  flex: 1,
  paddingLeft: wScale(8),
},
  container: {
    flex: 1,
    padding: wScale(10),
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
    borderWidth: wScale(1),
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(14),
  },
  dateText: {
    color: '#fff',
    fontSize: wScale(14),
  },
  timetext: {
    color: '#000',
    fontSize: wScale(14),
  },
  timenumber: {
    color: '#000',
    fontSize: wScale(16),
    fontWeight: 'bold'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: wScale(18),
    color: isDarkMode ? '#cccccc' : '#777777',
    marginTop: hScale(20),
  },
  transactionContainer: {
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(5),
    borderRadius: 5,
    marginBottom: hScale(15),
  },
  transactionText: {
    fontSize: wScale(16),
    color: '#000',
  },
  transactionrow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  descriptionview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: wScale(1),
    borderBottomWidth: wScale(1),
    alignItems: 'center',
    paddingVertical: hScale(3)
  },
  postview: {
    alignItems: 'flex-end'
  },
  card: {
  // backgroundColor: '#fff',
  borderRadius: 14,
  padding: wScale(14),
  marginBottom: hScale(12),
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 3,
},

headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},

dateText: {
  fontSize: wScale(12),
  color: '#7f8c8d',
},

descText: {
  fontSize: wScale(14),
  fontWeight: '600',
  color: '#2c3e50',
  marginTop: hScale(4),
  maxWidth: wScale(220),
},

amountText: {
  fontSize: wScale(16),
  fontWeight: '700',
},

divider: {
  height: 1,
  backgroundColor: '#eee',
  marginVertical: hScale(10),
},

footerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

balanceLabel: {
  fontSize: wScale(12),
  color: '#95a5a6',
},

balanceValue: {
  fontSize: wScale(14),
  fontWeight: '600',
  marginTop: hScale(2),
},

postBalance: {
  fontSize: wScale(15),
  fontWeight: '700',
  color: '#34495e',
},

});

export default DayLedgerReport;
