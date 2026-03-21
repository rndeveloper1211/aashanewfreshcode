import { translate } from "../../../utils/languageUtils/I18n";
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator, Linking } from 'react-native';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import useRadiantHook from '../../Financial/hook/useRadiantHook';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import DynamicButton from '../../drawer/button/DynamicButton';
import LocationModal from '../../../components/LocationModal';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { FlashList } from '@shopify/flash-list';
import ShowLoader from '../../../components/ShowLoder';
import NoDatafound from '../../drawer/svgimgcomponents/Nodatafound';
import { ToastAndroid } from 'react-native';
import ClosseModalSvg from '../../drawer/svgimgcomponents/ClosseModal';
import OTPModal from '../../../components/OTPModal';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import BackSvg from '../../drawer/svgimgcomponents/BackSvg';
// import OTPModal from '../../../components/OTPModal';

const CmsNewPin = ({ route }) => {
  const pay = route?.params?.pay ?? null;
  console.log('====================================');
  console.log(route.params, pay);
  console.log('====================================');
  const navigation = useNavigation<any>();

  const { colorConfig, } = useSelector((state: RootState) => state.userInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const { post } = useAxiosHook();
  const [pcode, setPCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [addPin, setAddPin] = useState('');
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [currentPinType, setCurrentPinType] = useState(null);
  const [mobileOtp, setMobileOtp] = useState('');
  const [hasData, setHasData] = useState(false);

  const handleWebsiteLink = () => {

    Linking.openURL('https://www.radiantcashservices.com/');
  };


  const handleGoBack = () => {
    navigation.goBack()
  };
  const Insert = async () => {
    if (!addPin?.trim()) {
      ToastAndroid.show("Please enter a valid pin code", ToastAndroid.SHORT);
      return;
    }

    setisLoading(true);

    try {
      const url = `${APP_URLS.Addpincode}pincode=${addPin}`;
      const res = await post({ url });
      console.log("Insert APP_URLS:", res.message, `${APP_URLS.Addpincode}pincode=${addPin}`);
      ToastAndroid.show(res.message || "", ToastAndroid.BOTTOM);

      setAddPin(''); // ✅ Reset the input field
      setModalVisible(false);

      fetchData();
    } catch (error) {
      console.error("Insert failed:", error);
      ToastAndroid.show("Failed to add pin code", ToastAndroid.SHORT);
    } finally {
      setisLoading(false);
    }
  };




  useEffect(() => {

    fetchData()
  }, [])
  const fetchData = async () => {
    setisLoading(true);

    try {
      const res = await post({ url: APP_URLS.ViewExtrapin });
      console.log(res, '%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      if (res) {
        setPin1(res.pin1);
        setPin2(res.pin2);
        setPin3(res.pin3);
        setPin4(res.pin4);
        setPCode(res.primarypincode);
        setHasData(true);
      }

      setisLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setisLoading(false);
    }
  };


  const handleSendOtp = async (pinType) => {

    const url = `${APP_URLS.Deletepincode}pintype=${pinType}&OtpType=SENDOTP&OTP=''`;
    console.log('Sending OTP to:', url);
    setisLoading(true);

    try {
      const res = await post({ url });
      console.log('OTP Response:', res);

      if (res.resp === true) {
        ToastAndroid.show(res.message || 'OTP sent successfully', ToastAndroid.SHORT);
        setShowModal(true);
        setCurrentPinType(pinType); // Track which pinType is being verified
      } else {
        alert(`⚠ Failed to send OTP. Status: ${res.message}`);
        ToastAndroid.show(`${res.message}`, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      alert('❌ Error sending OTP.');
    } finally {
      setisLoading(false);
    }
  };

  const handleOtpSubmit = async (mobileOtp) => {
    if (!currentPinType) {
      alert('❌ No pinType selected for deletion.');
      return;
    }

    const url = `${APP_URLS.Deletepincode}pintype=${currentPinType}&OtpType=VERIFY&OTP=${mobileOtp}`;
    console.log("DELETE URL:", url);
    setisLoading(true);

    try {
      const res = await post({ url });
      console.log("DELETE response:", res);

      const status = res.resp;

      if (status) {
        ToastAndroid.show(res.message, ToastAndroid.BOTTOM);
        setShowModal(false);
        fetchData(); // Refresh the list
      } else {
        console.warn('❌', res.message);
        ToastAndroid.show(res.message, ToastAndroid.BOTTOM);

      }
    } catch (error) {
      console.error("Delete error:", error);
      ToastAndroid.show('❌ Something went wrong.', ToastAndroid.BOTTOM);
    } finally {
      setisLoading(false);
    }
  };



return (
    <View style={styles.main}>
      <AppBarSecond title={'Work In Other Code Area'} />
      
      <ScrollView 
        keyboardShouldPersistTaps={"handled"}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: hScale(20) }}
      >
        {/* --- Header & Instructions --- */}
        <View style={[styles.infoBox, { backgroundColor: `${colorConfig.secondaryColor}33` }]}>
          <LinearGradient
            colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
            style={styles.infoHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>My Own Pin Code - {pcode}</Text>
              <Text style={styles.disc}>
                Your own Pin Code as per your documents is given above. {"\n"}
                If you can work in other Pin Code areas also, please add up to 4 Pin Codes by clicking on "Add New".
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>{translate("Add_New")}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* --- Additional Pin Codes List --- */}
        {hasData ? (
          <View style={{ marginTop: hScale(10) }}>
            {[pin1, pin2, pin3, pin4].map((pin, index) => {
              if (!pin) return null;
              const pinKey = `PIN${index + 1}`;
              return (
                <View key={pinKey} style={styles.dataView}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <FlotingInput
                        label={`Additional Pin Code ${index + 1}`}
                        value={pin}
                        editable={false}
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.righticon2} 
                      onPress={() => handleSendOtp(pinKey)}
                    >
                      <Icon name="delete" size={28} color="#ff4b5c" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <NoDatafound />
        )}

        {/* --- Add New Pin Modal --- */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={styles.modalTitle}>{translate("Add_Additional_Pin_Code")}</Text>
                <TouchableOpacity 
                  style={{ padding: 5 }}
                  onPress={() => setModalVisible(false)}
                >
                  <ClosseModalSvg />
                </TouchableOpacity>
              </View>
              
              <FlotingInput
                label="Enter 6-Digit Pin Code"
                keyboardType="number-pad"
                value={addPin}
                onChangeTextCallback={(text) => setAddPin(text.replace(/[^0-9]/g, ""))}
                maxLength={6}
              />

              <View style={{ marginTop: 15 }}>
                <DynamicButton title={'Submit'} onPress={() => Insert()} />
              </View>
            </View>
          </View>
        </Modal>

        {isLoading && <ShowLoader />}

        {/* --- OTP Verification --- */}
        <OTPModal
          setShowOtpModal={setShowModal}
          disabled={mobileOtp.length !== 4}
          showOtpModal={showModal}
          setMobileOtp={setMobileOtp}
          verifyOtp={() => {
            console.log('OTP Verification for delete:', mobileOtp);
            handleOtpSubmit(mobileOtp);
          }}
          inputCount={4}
        />

        {/* --- Footer Actions --- */}
        {pay && (
          <View style={{ paddingHorizontal: wScale(10), marginTop: hScale(20) }}>
            <DynamicButton
              title={'Next'}
              onPress={() => navigation.navigate('Checklistcms')}
            />
            
            <View style={styles.linksContainer}>
              <Button
                mode="text"
                onPress={handleGoBack}
                icon={() => <BackSvg size={15} color={colorConfig.primaryColor} />}
              >
                <Text style={[styles.goBackText, { color: colorConfig.primaryColor }]}>{translate("Go_Back")}</Text>
              </Button>

              <Button
                mode="text"
                onPress={handleWebsiteLink}
              >
                <Text style={[styles.websiteLinkText, { color: colorConfig.secondaryColor }]}>{translate("Company_Website")}</Text>
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#dcd6f7',
    padding: wScale(15),
    paddingHorizontal: wScale(10),
    marginBottom: hScale(10)
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3e80ff',
    paddingHorizontal: wScale(8),
    paddingVertical: wScale(10),
    borderRadius: wScale(10),
    marginBottom: hScale(10),
  },
  infoTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wScale(16),
  },
  disc: {
    color: '#fff',
    fontSize: wScale(10),
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: hScale(9),
    paddingHorizontal: wScale(15),
    borderRadius: wScale(20),
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wScale(16),
  },
  label: {
    fontWeight: '600',
    marginTop: hScale(5),
    fontSize: wScale(14),
    color: '#000'
  },
  value: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: wScale(15),
  },
  contactCard: {
    paddingHorizontal: wScale(10),
    marginTop: hScale(20)
  },

  updatedText: {
    marginBottom: hScale(10),
    color: '#000',
    fontSize: wScale(13),
  },
  contactDetail: {
    fontSize: wScale(16),
    marginBottom: hScale(5),
    color: '#666'
  },
  bold: {
    fontWeight: 'bold',
  },
  processButton: {
    marginTop: hScale(15),
    backgroundColor: '#f7f8fa',
    padding: wScale(10),
    borderRadius: wScale(10),
  },
  processButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wScale(14),
  },
  svgStyle: {
    position: 'absolute',
    top: hScale(0),
    right: wScale(0),
    width: wScale(80),
    height: hScale(80),
  },
  icon: {

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: wScale(20),
    padding: wScale(20),
    borderRadius: wScale(10),
  },
  modalTitle: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    marginBottom: hScale(10),
    color: '#000'
  },
  listCard: {
    borderWidth: .4,
    marginBottom: hScale(10),
    borderRadius: 5,


  },

  listContainer: {
    paddingHorizontal: wScale(10),

    paddingVertical: hScale(10)

  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // optional: adds spacing between text and button
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // allows text to take available space
    color: '#000'
  },
  buttonContainer: {
    backgroundColor: '#EDBDB2',
    padding: 2,
    borderRadius: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000055',
  },
  dropdown: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
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
  dataView: {
    paddingHorizontal: wScale(10),
    marginHorizontal: wScale(10),
    marginTop: hScale(10),
    borderRadius: 5,
    paddingTop: hScale(10),
    backgroundColor: '#fff',
    elevation: 5
  },
  linksContainer: {
    marginTop: hScale(5),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goBackText: {
    color: 'blue',
    fontSize: wScale(16),
  },
  websiteLinkText: {
    color: 'blue',
    fontSize: wScale(16),
    textDecorationLine: 'underline',
  },

});


export default CmsNewPin;
