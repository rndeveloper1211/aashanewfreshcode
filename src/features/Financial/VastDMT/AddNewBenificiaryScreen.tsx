
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, ToastAndroid, Alert, Button, Modal } from 'react-native';
import { translate } from '../../../utils/languageUtils/I18n';
import { BottomSheet } from '@rneui/base';
import { FlashList } from '@shopify/flash-list';
import { SCREEN_HEIGHT, SCREEN_WIDTH, hScale, wScale } from '../../../utils/styles/dimensions';
import { colors } from '../../../utils/styles/theme';
import DropdownSvg from '../../../utils/svgUtils/DropdownSvg';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import DynamicButton from '../../drawer/button/DynamicButton';
import ClosseModalSvg2 from '../../drawer/svgimgcomponents/ClosseModal2';
import { useNavigation } from '@react-navigation/native';
import { useDeviceInfoHook } from '../../../utils/hooks/useDeviceInfoHook';
import CloseSvg from '../../drawer/svgimgcomponents/CloseSvg';
import { playSound } from '../../dashboard/components/Sounds';
import ShowLoader from '../../../components/ShowLoder';
//import { useLocationHook } from '../../../utils/hooks/useLocationHook';
import { useLocationHook } from '../../../hooks/useLocationHook';
import { onReceiveNotification2 } from '../../../utils/NotificationService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddNewBenificiaryScreen = ({ no, Name2, Name, remid, onPress, onPress2 }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
const {} = useLocationHook()
  const color1 = `${colorConfig.secondaryColor}20`;

  const { userId } = useSelector((state: RootState) => state.userInfo);

  const [name, setName] = useState(Name2);
  const [senderNo, setsenderNo] = useState('');

  const [accountNumber, setAccountNumber] = useState('');
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState(translate(''));
  const [isLoading, setIsLoading] = useState(false);
  const [validate, setValidate] = useState(false);
  const [bankList, setBanklist] = useState([]);
  const [isBank, setIsBank] = useState(false);
  const [bank, setBank] = useState(translate('Select Your Bank'));
  const [UnqID, setUnqiD] = useState('');
  const [isSkip, setSkip] = useState(false);
  const [GoodMark, setGoodMark] = useState(false);
  const [GoodMark2, setGoodMark2] = useState(false);
  const [isR, setIsR] = useState(false);
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const filteredData = (bankList).filter(item =>

    item["bank_name"].toLowerCase().includes(searchQuery.toLowerCase())
  );
const [isload,setIsload]= useState(false)


  const handlepress = () => {
    onPress()

    console.log('efeeeeeeeeeee')
  }
  const handlepress2 = () => {
    onPress2()
  }
  const Radiant = (res) => {

    console.log(res);
    if (res.RESULT == '1') {
      Alert.alert('Failed', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]);
    } else {
      Alert.alert('Successfully', res['ADDINFO'], [{
        text: 'OK', onPress: () => {
          navigation.goBack();
        }
      }]);

    }

  }
  const vast = (res) => {

    console.log('vast', res)
    if (res['RESULT'] == '1') {
      setGoodMark2(false);
      Alert.alert('Failed', res['ADDINFO'], [{
        text: 'OK', onPress: () => {
          navigation.goBack();
        }
      }]);
    } else if (res['RESULT'] == '0') {

      setGoodMark2(true);
      console.log('ADDINFO', res['ADDINFO']['status'])

      Alert.alert('Success', res['ADDINFO']['status'],
        [{
          text: '', onPress: () => {
            setModalVisible(false);
            handlepress2()

            // navigation. goBack();

          }
        }]);
  const mockNotification = {
            notification: {
              title: `${res['ADDINFO']['status'] ==='Transaction Successful' ?'Bank account is linked':''}`,
              body:`${res['ADDINFO']['status']}- \nDetails\nName :${name}\nAcc No :${accountNumber} \nMo : ${senderNo}`,
            },
          };
          
          // Call the function
          onReceiveNotification2(mockNotification);  
    } else {
      Alert.alert('Error', '', [{ text: 'OK', onPress: () => { } }]);

    }
   // playSound('')
  }
  const removeUnwantedWords = (text) => {
    let cleanedText = text
      .replace(/\bs\/o\b/gi, '')
      .replace(/\bw\/o\b/gi, '');
    console.log(cleanedText.trim())
    return cleanedText.trim();
  };

  useEffect(() => {
    setIsR(Name === 'RADIANT');
    console.log(Name === 'RADIANT');


  }, [])
  const handleSaveAccount = async (bename) => {
    setIsload(true)

    const namee = await removeUnwantedWords(bename)

    console.log(Name);
    if (accountNumber === reEnterAccountNumber) {
      setGoodMark2(true);
      setIsLoading(true);
      setValidate(false);

      const baseUrl = `Money/api/Radiant/AddBeneficiary?sender_number=${no}&Name=${namee}&Accountnumber=${accountNumber}&bankname=${bank}&Ifsccode=${ifscCode}`;
      const url = `${APP_URLS.saveBank}Name=${bename}&AccountNo=${accountNumber}&IFSC=${ifscCode}&Mobile=''&SenderNo=${no}&remitterid=${remid}&ifscoriginal=${ifscCode}`;

      try {
        const res = isR ? await get({ url: baseUrl }) : await post({ url });

        console.log(res);
        console.log(url);

        if (Name === 'RADIANT') {
          Radiant(res);
        } else {
          vast(res);
        }

        console.log(res['ADDINFO']['data']['beneficiary']);
      } catch (error) {
        console.error('Error saving account:', error);
      } finally {
        setIsload(false)

        setIsLoading(false);
      }
    } else {
      setValidate(true);
    }
  };


  const { get, post } = useAxiosHook();
  useEffect(() => {
    setsenderNo(no)
    getBanks();
    getGenUniqueId();
  }, [])
  const getBanks = async () => {
    try {
      const url = `${APP_URLS.MasterIfsc}`
      console.log(url);
      const res = await get({ url: url });
      console.log(res['statuscode']);
      console.log(res['status']);
      setBanklist(res['data']);
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  const getGenUniqueId = async () => {
    try {
      const url = `${APP_URLS.getGenIMPSUniqueId}`
      console.log(url);
      const res = await get({ url: url });
      setUnqiD(res.Message);
      console.log(res)


      if (res['Response'] == 'Failed') {
        ToastAndroid.showWithGravity(
          res['Message'],
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        )
      } else {
        ToastAndroid.showWithGravity(
          res['Response'],
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        )
      }


    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };
  const bankStatus = async (bankname) => {
    console.log(bankname);
    try {

      const url = `${APP_URLS.getBankDown}${bankname}`; console.log(url);
      const res = await get({ url: url });

    } catch (error) {

    }
  }

  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const verifyAcc = async (mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid) => {
    console.log(mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid);
    console.log(sk, 'sk');
    setIsload(true)

    try {
      const Model = await getMobileDeviceId();
      const url = `${APP_URLS.verifybankACC}mb=${mb}&iff=${iff}&cd=${Model}&bno=${bno}&mal=${mal}&sk=${sk}&pi=${Model}&kk=${kk}&bankName=${bankName}&kyc=''&uniqueid=${uniqueid}`
      console.log(url)

      const res = await post({ url: url });
      console.log(res, '1234567890');
      console.log(url);
      setIsLoading(false)
      const addinfo = res.ADDINFO;
      console.log(addinfo);
      const data = addinfo.data;
      console.log(data);

      // {"status": "Balance Fatching Problem.", "statuscode": "LOW"}
      if (res.RESULT === '1') {
        setGoodMark(false);
        Alert.alert('Message',

          res['ADDINFO'] || res['ADDINFO'].statuscode === 'LOW' ? res['ADDINFO'].status : 'try after sometime !!!',

          [{
            text: 'OK', onPress: () => { },
          }]);

        setIsLoading(false);
      } else if (res.RESULT === '0') {
        const bename = addinfo["data"]["benename"];
        const verify = addinfo["data"]["verification_status"];
        const charged_amt = addinfo["data"]["charged_amt"];
        const bankrefno = addinfo["data"]["bankrefno"];
        const local = addinfo["Local"];
        setName(bename);

          const mockNotification = {
            notification: {
              title: verify,
              body: `A/C verified for money transfer status is ${verify}, name : ${bename} `,
            },
          };
          
          // Call the function
          onReceiveNotification2(mockNotification);  
        setVerificationDetails({
          name: bename,
          status: verify,
          bankRefNo: bankrefno,
          //chargedAmt: charged_amt,
        });
        setModalVisible(true);
       

        if (verify === "VERIFIED") {
          setGoodMark(true);
        } else {
          setGoodMark(false);
        }

   
      } else {

        setIsLoading(false);
        Alert.alert('Failed', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]);
      }
      setIsload(false)

    } catch (error) {
      console.error(error);
    }
  }

  const ReverifyAcc = async (mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid) => {
    console.log(mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid);
    try {
      const res = await post({ url: `${APP_URLS.reVerifybankACC}mb=${mb}&iff=${iff}&cd=${cd}&bno=${bno}&mal=${mal}&sk=${sk}&pi=${pi}&kk=${kk}&bankName=${bankName}&kyc=${kyc}&uniqueid=${uniqueid}` })
      console.log(res);
      if (res['RESULT'] === '1') {
        setGoodMark(false);
        setIsLoading(false);
        Alert.alert('', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]);
      } else if (res['RESULT'] === '0') {

        var bename = res["ADDINFO"]["data"]["benename"];
        var verify = res["ADDINFO"]["data"]["verification_status"];
        var local = res["ADDINFO"]["Local"];

        if (verify == "VERIFIED") {
          setGoodMark(true);
        } else {
          setGoodMark(false);
          Alert.alert(
            '',
            res['ADDINFO'],
            [
              { text: 'OK', onPress: () => { } },
              {
                text: 'Re-verify', onPress: () => {
                  ReverifyAcc(senderNo, ifscCode, '', accountNumber, userId, UnqID, '57bea5094fd9082d', 'RJUPM12131', bank, 'kyc', userId)
                }
              }
            ]
          );
          // setState(() {
          //   verfybtnnn = false;
          // });
        }
        if (local == "Local") {
          Alert.alert(
            '',
            res['ADDINFO'],
            [
              { text: 'OK', onPress: () => { } },
              {
                text: 'Re-verify', onPress: () => {
                  ReverifyAcc(senderNo, ifscCode, '', accountNumber, userId, UnqID, '57bea5094fd9082d', 'RJUPM12131', bank, 'kyc', UnqID)
                }
              }
            ]
          );
        } else {
        }
      } else {
        setIsLoading(false);
        Alert.alert('Failed', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]);
      }
    } catch (error) {
    }
  }

  const Banks = () => {
    return <FlashList keyboardShouldPersistTaps="handled"
      style={{ marginBottom: wScale(50), marginHorizontal: wScale(24) }}
      data={filteredData}
      renderItem={({ item }) => {
        return (
          <View
            style={{ marginVertical: wScale(8), marginHorizontal: wScale(24) }}>
            <TouchableOpacity
              style={[styles.operatorview]}

              onPress={async () => {
                setIfscCode(item['branch_ifsc']);
                setBank(item['bank_name']);
                console.log(item['bank_name']);
                console.log(item['branch_ifsc']);
                console.log(item);
                setIsBank(false);
                bankStatus(item['bank_name']);
                setSearchQuery('')
              }}>
              <Text style={[styles.operatornametext]}>

                {item['bank_name']}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
      estimatedItemSize={30}
    />
  }
  return (
  <View style={[styles.main, { borderColor: colorConfig.secondaryColor, flex: 1 }]}>
    {/* Loader */}
    {isload && <ShowLoader />}

    {/* Header Section (Fixed) */}
    <View
      style={[
        styles.texttitalView,
        { backgroundColor: colorConfig.secondaryColor },
      ]}>
      <View
        style={[
          styles.cutout,
          { borderTopColor: colorConfig.secondaryColor },
        ]}
      />
      <Text style={styles.texttital}>{translate("Add_Beneficiary")}</Text>
      <Text style={{ color: "#fff" }}>{no}</Text>
    </View>

    {/* Close Button (Fixed) */}
    <TouchableOpacity
      onPress={() => handlepress()}
      activeOpacity={0.7}
      style={[
        styles.closebuttoX, 
        { backgroundColor: colorConfig.secondaryColor },
      ]}>
      <CloseSvg />
    </TouchableOpacity>

    {/* Keyboard Aware Scroll Content */}
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Name Input */}
        <FlotingInput 
          label={'Name'} 
          value={name} 
          onChangeTextCallback={text => setName(text)} 
        />

        {/* Account Number Input */}
        <FlotingInput 
          label={'Account Number'} 
          keyboardType="number-pad" 
          value={accountNumber} 
          onChangeTextCallback={text => setAccountNumber(text)} 
        />

        {/* Re-Enter Account Number */}
        <FlotingInput 
          label={translate("Re-Enter Account Number")} 
          keyboardType="number-pad"
          value={reEnterAccountNumber} 
          onChangeTextCallback={text => setReEnterAccountNumber(text)} 
        />

        {/* Bank Selection */}
        <TouchableOpacity
          onPress={() => {
            if (accountNumber === reEnterAccountNumber && accountNumber.length >= 4) {
              setIsBank(true);
            } else {
              setValidate(true);
            }
          }}>
          <View pointerEvents="none">
            <FlotingInput label={bank || 'Select Bank'} editable={false} />
          </View>
          <View style={[styles.righticon2]}>
            <OnelineDropdownSvg />
          </View>
        </TouchableOpacity>

        {/* IFSC Code */}
        <FlotingInput 
          label={'IFSC Code'} 
          editable={false} 
          value={ifscCode} 
          onChangeTextCallback={text => setIfscCode(text.toUpperCase())}
        />

        {/* Validation Error Message */}
        {validate && (
          <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{translate("Account_numbers_do_not_match")}</Text>
        )}

        {/* Action Buttons Section */}
        <View style={{ marginTop: hScale(20) }}>
          {isR ? (
            <DynamicButton
              title={'RADIANT'}
              styleoveride={{ marginBottom: hScale(20) }}
              onPress={() => handleSaveAccount(name)}
            />
          ) : (
            <View>
              {isSkip ? (
                <DynamicButton 
                  onPress={() => handleSaveAccount(name)}
                  title={isLoading ? (
                    <ActivityIndicator color={colorConfig.labelColor} size={'small'} />
                  ) : (
                    <Text>{GoodMark2 ? '✓' : translate('Save Account')}</Text>
                  )}
                  disabled={!accountNumber || !reEnterAccountNumber || !ifscCode || isLoading}
                />
              ) : (
                <DynamicButton 
                  disabled={!accountNumber || !reEnterAccountNumber || !ifscCode || isLoading}
                  onPress={() => {
                    if (accountNumber === reEnterAccountNumber) {
                      verifyAcc(no, ifscCode, '57bea5094fd9082d', accountNumber, userId, UnqID, '57bea5094fd9082d', 'RJUPM12131', bank, 'kyc', UnqID);
                      setIsLoading(true);
                      setValidate(false);
                      setGoodMark(true);
                    } else {
                      setValidate(true);
                    }
                  }} 
                  title={isLoading ? (
                    <ActivityIndicator color={colorConfig.labelColor} />
                  ) : (
                    <Text>{GoodMark ? '✓' : translate('Verify Account')}</Text>
                  )} 
                />
              )}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: hScale(30) }} />
      </View>
    </KeyboardAwareScrollView>

    {/* Bank Selection Bottom Sheet */}
    <BottomSheet 
      animationType="none"  
      isVisible={isBank}
      onBackdropPress={() => setIsBank(false)}
    >
      <View style={styles.bottomsheetview}>
        <View style={[styles.StateTitle, { backgroundColor: colorConfig.secondaryColor }]}>
          <Text style={styles.stateTitletext}>{translate("Select_Your_Bank")}</Text>
          <TouchableOpacity onPress={() => setIsBank(false)}>
            <ClosseModalSvg2 />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchBar}
          placeholderTextColor={'gray'}
        />
        {Banks()}
      </View>
    </BottomSheet>

    {/* Verification Details Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{translate("Verification_Details")}</Text>
        {verificationDetails && (
          <>
            <Text style={styles.textLabel}>Name: <Text style={styles.textValue}>{verificationDetails.name}</Text></Text>
            <Text style={styles.textLabel}>Status: <Text style={styles.textValue}>{verificationDetails.status}</Text></Text>
            <Text style={styles.textLabel}>Bank Reference No: <Text style={styles.textValue}>{verificationDetails.bankRefNo}</Text></Text>
          </>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={() => handleSaveAccount(name)} />
          <View style={{ width: 20 }} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  </View>
);
};
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFFFFF',
    elevation: 5,
    borderWidth: 1,
    marginTop: hScale(20),
    borderRadius: 5,
    marginHorizontal: wScale(13)
  },
  closebuttoX: {
    borderRadius: wScale(24),
    alignItems: 'center',
    height: wScale(42),
    width: wScale(42),
    justifyContent: 'center',
    elevation: 5,
    position: 'absolute',
    right: wScale(-11),
    top: hScale(-11),
  },
  container: {
    top: hScale(8),
    paddingHorizontal: wScale(20),
    paddingVertical: wScale(15),
    marginTop: hScale(20)
  },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: wScale(12),
  },
  operatorview: {
    alignItems: "center",
    paddingHorizontal: wScale(10),
  },
  searchBar: {
    borderColor: 'gray',
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    marginHorizontal: wScale(10),
    marginBottom: hScale(10),
    borderRadius: 5,
    color: colors.black75,
    fontSize: wScale(16),
  },
  operatornametext: {
    textTransform: "capitalize",
    fontSize: wScale(20),
    color: "#000",
    // flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: wScale(0.5),
    alignSelf: "center",
    paddingVertical: hScale(30),
    width: '100%'
  },
  bottomsheetview: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  StateTitle: {
    paddingVertical: hScale(10),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wScale(10),
    // marginBottom: hScale(10),
  },
  stateTitletext: {
    fontSize: wScale(22),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  texttital: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    color: '#fff',
    width: 240,
    paddingLeft: wScale(10)
  },
  texttitalView: {
    width: wScale(200),
    height: hScale(40),
    borderTopLeftRadius: wScale(5),
    position: 'absolute',
    top: hScale(-1),
    left: wScale(-1),
    justifyContent: 'center',
    paddingBottom: hScale(3),
    borderBottomRightRadius: 0,
  },
  cutout: {
    borderTopWidth: hScale(40), // Height of the triangle
    borderRightWidth: wScale(33), // Width of the triangle
    borderBottomWidth: wScale(0), // Set to 0 to hide the bottom edge
    borderLeftWidth: wScale(3), // Width of the triangle
    width: '100%',
    height: hScale(40),
    borderRightColor: 'transparent', // Hide the right edge
    borderBottomColor: 'transparent', // Hide the bottom edge
    borderLeftColor: 'transparent', // Hide the left edge
    position: 'absolute',
    right: wScale(-50),
    zIndex: wScale(0),
    top: wScale(0),
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.black75
  },
  buttonContainer: {
    alignContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  textValue: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold'
  },
})
export default AddNewBenificiaryScreen;


