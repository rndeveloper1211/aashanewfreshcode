import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, Alert, ToastAndroid } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { RootState } from '../../../reduxUtils/store';
import { hScale, SCREEN_WIDTH, wScale } from '../../../utils/styles/dimensions';
import { colors } from '../../../utils/styles/theme';
import AadharPaysvg from '../../../utils/svgUtils/AadhaarPaysvg';
import StatementSvg from '../../../utils/svgUtils/StatementSvg';
import CheckBlance from '../../../utils/svgUtils/CheckBlance';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import { translate } from '../../../utils/languageUtils/I18n';
import useAxiosHook from '../../../utils/network/AxiosClient';
import uuid from 'react-native-uuid';
import { APP_URLS } from '../../../utils/network/urls';
import { startTransaction } from 'react-native-instantpay-mpos';
import DynamicButton from '../../drawer/button/DynamicButton';
import { useSelector } from 'react-redux';
import MicroAtmsvg from '../../drawer/svgimgcomponents/MicroAtmsvg';
import BalancEnqurisvg from '../../drawer/svgimgcomponents/BalancEnqurisvg';
import Upisvg from '../../drawer/svgimgcomponents/Upisvg';
import PurchaseSvg from '../../drawer/svgimgcomponents/PurchaseSvg';
import { decryptData, encrypt } from '../../../utils/encryptionUtils';
import { useDeviceInfoHook } from '../../../utils/hooks/useDeviceInfoHook';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import { useLocationHook } from '../../../hooks/useLocationHook';
import ShowLoader from '../../../components/ShowLoder';
import { onReceiveNotification2 } from '../../../utils/NotificationService';


const enum TRANSACTION_TYPE {
  PURCHASE = 'PURCHASE',
  MICROATM = 'MICROATM',
  BALANCE_ENQUIRY = 'BALANCE_ENQUIRY',
  UPI = 'UPI'
}

const MicroatmTabScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.primaryColor}80`;
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const [isNewLogin, setIsNewLogin] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { post, get } = useAxiosHook();
  const [uniqueId, setUniqueId] = useState('');
  const [index, setIndex] = useState(0);
  const [buttonName, setButtonName] = useState('PURCHASE');
  const [amount, setAmount] = useState('');
  const [profileData, setProfileData] = useState<any>({});
  const { userId, Loc_Data } = useSelector((state: RootState) => state.userInfo);
  const [isLoading, setIsloading] = useState(false)
  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const [routes] = useState([
    { key: 'PURCHASE', title: 'PURCHASE' },
    { key: 'MICROATM', title: 'MICROATM' },
    { key: 'BALANCE_ENQUIRY', title: 'BALANCE ENQ' },
    { key: 'UPI', title: 'UPI' },
  ]);

  useEffect(() => {


    getData();
  }, []);
  const getData = useCallback(async () => {
    setIsloading(true);

    try {
      const result2 = await post({ url: 'MICROATM/api/data/MerchantCreateToSubmit' });
      const res = await get({ url: APP_URLS.getProfile });

      console.log(result2, "***************");

      if (res.data) {
        const decryptedProfile = decryptData(res.value1, res.value2, res.data);
        setProfileData(JSON.parse(decryptedProfile));
      }

      const status = result2.status;

      ToastAndroid.show(result2.msg, ToastAndroid.SHORT);

      // Handle different status cases
      if (status === true || status === 'Success') {
        const result = await post({ url: APP_URLS.getCredoCredentials });
        console.log(result)
        setIsNewLogin(result.IsNewLogin);
        setLoginId(result.LoginId);
        setPassword(result.Password);
      } else if (status === 'StatusCheck') {
        navigation.replace("MAtmStatusCheck");
        return;
      } else if (status === 'Device') {
        navigation.replace("RegisterVM30", { deviceSerial: result2.devicesr });
        return;
      } else if (status === 'REGISTER') {
        ActiveMicroATM(); // Trigger activation function
      } else if (["BOTHNOTDONE", "NOTOK", "ALLNOTDONE"].includes(status)) {
        navigation.navigate('ServicepurchaseScreen', { typename: "VM30" });
      } else {
        alert(result2.msg);
      }

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsloading(false);
    }
  }, [

    navigation,
  ]);
  const ActiveMicroATM = async () => {
    try {
      const res = await post({ url: 'MICROATM/api/data/ActiveMicroATM' });

      console.log(res, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

      const status = res.status == true || res.status == 'Success';
      if (status) {
        navigation.navigate("MAtmStatusCheck");
      } else {

        Alert.alert('Alert', res.msg, [{ text: "OK", onPress: () => navigation.navigate("Home") }]);

      }
    } catch (error) {
    }
  }
  const { latitude, longitude } = Loc_Data;
  const transaction = useCallback(async () => {
    console.log(latitude, longitude);
    const id = uuid.v4().toString().substring(0, 16);
    console.log('**CHECK_2', id)
    setUniqueId(id);
    const mobileNetwork = await getNetworkCarrier();
    const ipp = await getMobileIp();
    const Model = await getMobileDeviceId();
    console.log(buttonName === 'BALANCE_ENQUIRY')
    if (buttonName === 'BALANCE_ENQUIRY') {
      startCredoTransaction(id);

    } else if (buttonName === 'UPI') {


      // Encrypt karne se pehle values
      const encryption = await encrypt([
        id,
        ipp,
        'UPI',
        Model, // Device
        latitude,
        longitude,
        Model, // Model
        'city',
        'postcode',
        mobileNetwork,
        'address',
        amount,
      ]);

      const Transtionid = encodeURIComponent(encryption.encryptedData[0]);
      const IPaddressss = encodeURIComponent(encryption.encryptedData[1]);
      const Type = encodeURIComponent(encryption.encryptedData[2]);
      const Devicetoken = encodeURIComponent(encryption.encryptedData[3]);
      const Latitude1 = encodeURIComponent(encryption.encryptedData[4]);
      const longitude1 = encodeURIComponent(encryption.encryptedData[5]);
      const ModelNo = encodeURIComponent(encryption.encryptedData[6]);
      const City = encodeURIComponent(encryption.encryptedData[7]);
      const PostalCode = encodeURIComponent(encryption.encryptedData[8]);
      const InternetTYPE = encodeURIComponent(encryption.encryptedData[9]);
      const Addresss = encodeURIComponent(encryption.encryptedData[10]);

      const value1 = encodeURIComponent(encryption.keyEncode);
      const value2 = encodeURIComponent(encryption.ivEncode);
      try {
        const res = await post({
          url: `MICROATM/api/data/Apitransitions?Transtionid=${Transtionid}&Amount=${(parseFloat(amount).toFixed(1)).toString()}&IPaddressss=${IPaddressss}&Type=${Type}&Devicetoken=${Devicetoken}&Latitude=${Latitude1}&Longitude=${longitude1}&ModelNo=${ModelNo}&City=${City}&PostalCode=${PostalCode}&InternetTYPE=${InternetTYPE}&Addresss=${Addresss}&value1=${value1}&value2=${value2}`
        });
        //if({"Message": "Request Process Done ", "Status": "Success"})
        if (res.Status === 'Success') {
          startCredoTransaction(id);
        } else {
          Alert.alert('Alert', res.Message, [{ text: "OK" }]);
        }
        // If you want to navigate based on response
        // if (res.status == true) {
        //   navigation.navigate("MAtmStatusCheck");
        // } else {
        //   Alert.alert('Alert', res.msg, [{ text: "OK", onPress: () => navigation.navigate("Home") }]);
        // }
      } catch (error) {
        console.log(error, 'Error in transaction');
      }

    } else {

      const encryption = await encrypt([
        id,
        ipp,
        buttonName === 'PURCHASE' ? 'cash' : 'microatm',
        Model, // Device
        latitude,
        longitude,

        Model, // Model
        'city',
        'postcode',
        mobileNetwork,
        'address',
        amount,
      ]);

      const Transtionid = encodeURIComponent(encryption.encryptedData[0]);
      const IPaddressss = encodeURIComponent(encryption.encryptedData[1]);
      const Type = encodeURIComponent(encryption.encryptedData[2]);
      const Devicetoken = encodeURIComponent(encryption.encryptedData[3]);
      const latitude = encodeURIComponent(encryption.encryptedData[4]);
      const longitude = encodeURIComponent(encryption.encryptedData[5]);
      const ModelNo = encodeURIComponent(encryption.encryptedData[6]);
      const City = encodeURIComponent(encryption.encryptedData[7]);
      const PostalCode = encodeURIComponent(encryption.encryptedData[8]);
      const InternetTYPE = encodeURIComponent(encryption.encryptedData[9]);
      const Addresss = encodeURIComponent(encryption.encryptedData[10]);

      const value1 = encodeURIComponent(encryption.keyEncode);
      const value2 = encodeURIComponent(encryption.ivEncode);
      try {
        const res = await post({
          url: `MICROATM/api/data/Apitransitions?Transtionid=${Transtionid}&Amount=${(parseFloat(amount).toFixed(1)).toString()}&IPaddressss=${IPaddressss}&Type=${Type}&Devicetoken=${Devicetoken}&Latitude=${latitude}&Longitude=${longitude}&ModelNo=${ModelNo}&City=${City}&PostalCode=${PostalCode}&InternetTYPE=${InternetTYPE}&Addresss=${Addresss}&value1=${value1}&value2=${value2}`
        });
        //if({"Message": "Request Process Done ", "Status": "Success"})
        if (res.Status === 'Success') {
          startCredoTransaction(id);
        } else {
          Alert.alert('Alert', res.Message, [{ text: "OK" }]);
        }
        // If you want to navigate based on response
        // if (res.status == true) {
        //   navigation.navigate("MAtmStatusCheck");
        // } else {
        //   Alert.alert('Alert', res.msg, [{ text: "OK", onPress: () => navigation.navigate("Home") }]);
        // }
      } catch (error) {
        console.log(error, 'Error in transaction');
      }
    }
  }, [amount, buttonName, post, userId, latitude, longitude]);

  const updateButtonName = useCallback((index) => {
    const selectedRoute = routes[index].key;
    setButtonName(selectedRoute);
  }, [routes]);
  useEffect(() => {
    updateButtonName(index);
  }, [index, updateButtonName]);

  const getOptions = useCallback((id) => {
    let options = {}

    switch (buttonName) {
      case 'BALANCE_ENQUIRY':
        options = {
          amount: 0,
          debugMode: 'true',
          loginId: loginId,
          customerRefNo: id,
          loginPassword: isChangePassword ? "VwiCredo@123" : (isNewLogin ? password : "VwiCredo@123"),
          transactionType: TRANSACTION_TYPE.BALANCE_ENQUIRY,
          production: true,
          mobile: profileData.Mobile,
          optional1: id,
        };
        break;
      case 'PURCHASE':
        options = {
          amount: amount,
          debugMode: 'true',
          loginId: loginId,
          customerRefNo: id,
          loginPassword: isChangePassword ? "VwiCredo@123" : (isNewLogin ? password : "VwiCredo@123"),
          transactionType: TRANSACTION_TYPE.PURCHASE,
          production: true,
          mobile: profileData.Mobile,
          optional1: id,
        };
        break;
      case 'MICROATM':
        options = {
          amount: amount,
          debugMode: 'true',
          loginId: loginId,
          customerRefNo: id,
          loginPassword: isChangePassword ? "VwiCredo@123" : (isNewLogin ? password : "VwiCredo@123"),
          transactionType: TRANSACTION_TYPE.MICROATM,
          production: true,
          mobile: profileData.Mobile,
          optional1: id,
        };
        break;

      case 'UPI':
        options = {
          amount: amount,
          debugMode: 'true',
          loginId: loginId,
          customerRefNo: id,
          loginPassword: isChangePassword ? "VwiCredo@123" : (isNewLogin ? password : "VwiCredo@123"),
          transactionType: TRANSACTION_TYPE.UPI,
          production: true,
          mobile: profileData.Mobile,
          optional1: id,
        };
        break;
    }



    console.log(options);
    return options;
  }, [isChangePassword, isNewLogin, password, uniqueId, setUniqueId, buttonName, amount]);


  const types = (type) => {
    let txn = ''
    switch (type) {

      case 'PURCHASE':
        return txn = TRANSACTION_TYPE.PURCHASE;
      case 'MICROATM':
        return txn = TRANSACTION_TYPE.MICROATM;
      case 'BALANCE ENQ':
        return txn = TRANSACTION_TYPE.BALANCE_ENQUIRY;
      case 'UPI':
        return txn = TRANSACTION_TYPE.UPI;
      default:
        break;

    };
    return txn;
  }
  const startCredoTransaction = useCallback(async (id) => {
    console.log('**CHECK', JSON.stringify(getOptions(id)));

    
    try {
      const res = await startTransaction(JSON.stringify(getOptions(id)));


      console.log(res)
 
      if (res?.message === 'Login Failed!' || res?.message === "Request Change Password by User" || res.status =='FAILED') {
        const mockNotification = {
          notification: {
            title: buttonName,
            body: `${res?.message}` || ''
          },
        };
     Alert.alert(
        "Transaction Result",
        `${res.message || ''} (Status: ${res.status || ''})`, [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
        { cancelable: false }
      );

        onReceiveNotification2(mockNotification);

      }


      if (res.message === "Request Change Password by User" && res.status === 'SUCCESS') {
        setIsChangePassword(true);
        await startCredoTransaction(id + '1');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }, [getOptions]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'PURCHASE':
        return (
          <View style={styles.container}>
            <FlotingInput label={'Enter Amount'}
              onChangeTextCallback={(text) => {
                console.log('**ENCRY', text)
                setAmount(text);
              }}
              value={amount}
              keyboardType="number-pad"
            />
            <Text style={styles.discription}>{translate('1 CASH')}</Text>
            <Text style={styles.discription}>{translate('2 CASH')}</Text>
          </View>
        );
      case 'MICROATM':
        return (
          <View style={styles.container}>
            <FlotingInput label={'Enter Amount'}
              onChangeTextCallback={(text) => {
                setAmount(text);
              }}
              keyboardType="number-pad"
              value={amount}

            />
            <Text style={styles.discription}>{translate('mratm')}</Text>
            <Text style={styles.discription}>{translate('2 CASH')}</Text>
          </View>
        );
      case 'BALANCE_ENQUIRY':

        return (
          <View style={styles.container}>
            <Text style={styles.discription}>{translate('1 CASH')}</Text>
          </View>
        );
      case 'UPI':
        return (
          <View style={styles.container}>
            <FlotingInput
              label={'Enter Amount'}
              onChangeTextCallback={(text) => {
                setAmount(text);
              }}
              keyboardType="number-pad"
              value={amount}
            />
            <Text style={styles.discription}>{translate('1 CASH')}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getSvgimg = (key: string) => {
    switch (key) {
      case 'PURCHASE':
        return <PurchaseSvg />;
      case 'MICROATM':
        return <MicroAtmsvg />;
      case 'BALANCE_ENQUIRY':
        return <BalancEnqurisvg />;
      case 'UPI':
        return <Upisvg size={30} />;
      default:
        return null;
    }
  }

  return (
    <View style={styles.main}>
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(i) => {
          setIndex(i);
          updateButtonName(i);
        }}
        initialLayout={{ width: SCREEN_WIDTH }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={[styles.indicator, { backgroundColor: colorConfig.primaryColor }]}
            style={[styles.tabbar, { backgroundColor: color1 }]}
            renderLabel={({ route, focused }) => (
              <View style={styles.labelview}>
                {getSvgimg(route.key)}
                <Text style={[styles.labelstyle, { color: focused ? colors.dark_black : colors.black75 }]}>
                  {route.title}
                </Text>
              </View>
            )}
          />
        )}
      />

      {isLoading && <ShowLoader />}
      <View style={styles.container}>
        <DynamicButton
          onPress={transaction}
          title={buttonName}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: wScale(15),
    flex: 1,
  },
  tabbar: {
    elevation: 0,
    marginBottom: hScale(0),

  },
  indicator: {},
  labelstyle: {
    fontSize: wScale(12),
    color: colors.black,
    width: '100%',
    textAlign: 'center',
  },
  labelview: {
    alignItems: 'center',
    flex: 1,
  },
  discription: {
    color: colors.black75,
  }
});

export default MicroatmTabScreen;