import { translate } from "../../../utils/languageUtils/I18n";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ToastAndroid, ActivityIndicator } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import FlotingInput from "../../drawer/securityPages/FlotingInput"; // Assuming this is the correct path
import DynamicButton from "../../drawer/button/DynamicButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import { RadiantContext } from "./RadiantContext";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import ShowLoader from "../../../components/ShowLoder";
import OTPModal from "../../../components/OTPModal";
import { log } from "console";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DrawingLaises = () => {

  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [isLoading, setIsloading] = useState(true);
  const [isLoading2, setIsloading2] = useState(false);
  const [iswheeler, setIswheeler] = useState(false);
  const [twoWheelerNo1, setTwoWheelerNo1] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [emname, setEmName] = useState('');
  const [emmobileNo, setEmMobileNo] = useState('');
  const [emrelation, setEmaRelation] = useState('');
  const [closeName, setCloseName] = useState('');
  const [closeMobileNo, setCloseMobileNo] = useState('');
  const [closeAddress, setCloseAddress] = useState('');
  const [closePin, setClosePin] = useState('');
  const [neighbourVerifyMobile, setNeighbourVerifyMobile] = useState(false);
  const [closeVerifymobile, setCloseVerifymobile] = useState(false);
  const [emergencyVerifyMobilenumber, setEmergencyVerifyMobilenumber] = useState(false);
  const [sendid, setSendID] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [otpType, setOtpType] = useState('');

  const { post } = useAxiosHook();
  const handlewheel = () => {
    setIswheeler((prev) => {
      const newValue = !prev;
      if (!newValue) {
        setTwoWheelerNo1('');
      }
      return newValue;
    });
  };


  const {
    currentPage,
    setCurrentPage,
  } = useContext(RadiantContext)

  useEffect(() => {
    formData()

  }, [])
  const formData = async () => {
    try {
      const res = await post({ url: APP_URLS.RadiantForm4Data });
      if (res.datastatus) {
        setOrgName(res.Name);

        console.warn(res);
        setIswheeler(res.iswheeler);
        setTwoWheelerNo1(res.twowheelerNUmber);
        setName(res.NeighbourName);
        setMobileNo(res.NeighbourMobile);
        setCloseName(res.closename);
        setCloseMobileNo(res.closemobile);
        setCloseAddress(res.closeaddress);
        setClosePin(res.closepincode);
        setEmMobileNo(res.EmergencyMobilenumber);
        setEmName(res.EmergencyName);
        setEmaRelation(res.EmergencyRelationship);
        setNeighbourVerifyMobile(res.NeighbourVerifyMobile);
        setCloseVerifymobile(res.closeVerifymobile);
        setEmergencyVerifyMobilenumber(res.EmergencyVerifyMobilenumber);
        setIsloading(false);
        console.log('====================================');
        console.log(res.closepincode);
        console.log('====================================');
      }

      if (res.Message === "An error has occurred.") {
        alert('Data retrieval failed. Please contact the Admin.');

      }
      setIsloading(false);

    } catch (error) {
      console.error("Error in form1Data:", error);
      setIsloading(false);

    }
  }
  const validateForm = () => {
    // Neighbor validation
    const vehicleNumberRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i; // Case-insensitive

    if (iswheeler) {
      if (!twoWheelerNo1 || twoWheelerNo1.trim() === "") {
        showToast("Please enter two wheeler number");
        return false;
      } else if (!vehicleNumberRegex.test(twoWheelerNo1)) {
        showToast("Please enter a valid vehicle number (e.g., RJ14AB1234)");
        return false;
      }
    }


    if (!name) {
      showToast("Please enter neighbor name");
      return false;
    }

    if (!mobileNo) {
      showToast("Please enter neighbor mobile number");
      return false;
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      showToast("Please enter a valid 10-digit mobile number");
      return false;
    }

    // Close relative validation
    if (!closeName) {
      showToast("Please enter close relative name");
      return false;
    }

    if (!closeMobileNo) {
      showToast("Please enter close relative mobile number");
      return false;
    }

    if (!/^\d{10}$/.test(closeMobileNo)) {
      showToast("Please enter a valid 10-digit mobile number for close relative");
      return false;
    }

    if (!closeAddress) {
      showToast("Please enter close relative address");
      return false;
    }

    if (!closePin) {
      showToast("Please enter pincode");
      return false;
    }

    if (!/^\d{6}$/.test(closePin)) {
      showToast("Please enter a valid 6-digit pincode");
      return false;
    }

    if (!neighbourVerifyMobile) {
      ToastAndroid.show("Please verified Neighbor Mobile No.", ToastAndroid.SHORT);
      return false;
    }

    if (!closeVerifymobile) {
      ToastAndroid.show("Please verified CloseRelative Mobile No.", ToastAndroid.SHORT);
      return false;
    }

    if (!emergencyVerifyMobilenumber) {
      ToastAndroid.show("Please verified Emergency Mobile No.", ToastAndroid.SHORT);
      return false;
    }

    return true;
  };

  const showToast = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const CandiantForm = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    console.log('====================================');
    console.log(iswheeler, emergencyVerifyMobilenumber);
    console.log('====================================');
    try {
      setIsloading2(true);

      const data = {
        twowheeler: iswheeler,
        NeighbourName: name,
        NeighbourMobile: mobileNo,
        closename: closeName,
        closemobile: closeMobileNo,
        closeaddress: closeAddress,
        closepincode: closePin,
        twowheelerNUmber: twoWheelerNo1,
        EmergencyName: emname,
        EmergencyRelationship: emrelation,
        EmergencyMobilenumber: emmobileNo,
        VerifyNeighbourMobile: neighbourVerifyMobile,
        Verifyclosemobile: closeVerifymobile,
        VerifyEmergencyMobilenumber: emergencyVerifyMobilenumber,

      };

      const res = await post({ url: APP_URLS.RadiantCandiantForm4, data });
      console.log('Response:', res, 'Data Sent:', data);

      if (res.Message === 'An error has occurred.') {
        alert('Internal server error. Please try again later.');
        return;
      }

      if (res.status === 'Not') {
        alert('Submission failed. Please contact admin.');
        return;
      }
      if (res.status === 'Data Insert Successfully') {
        ToastAndroid.show(res.status || '', ToastAndroid.SHORT);

        setCurrentPage(currentPage + 1);

      }

    } catch (error) {
      console.error("Error in CandiantForm1:", error);
      alert('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsloading2(false);
    }
  }, [
    iswheeler,
    name,
    mobileNo,
    closeName,
    closeMobileNo,
    closeAddress,
    closePin,
    twoWheelerNo1,
    emmobileNo,
    emname,
    emrelation,
    emergencyVerifyMobilenumber,
    closeVerifymobile,
    neighbourVerifyMobile
  ]);
  const handleSendOtp = async (type) => {
    setIsloading(true);
    setOtpType(type); // ✅ Store the type for verification

    const targetMobile =
      type === 'Neighbor' ? mobileNo :
        type === 'CloseRelative' ? closeMobileNo :
          type === 'Emergency' ? emmobileNo : '';

    const targetName =
      type === 'Neighbor' ? name :
        type === 'CloseRelative' ? closeName :
          type === 'Emergency' ? emname : '';

    const targetRelation = type;

    setSendID(targetMobile);

    try {
      const url = `${APP_URLS.SendOTPMobileOther}Mobile=${targetMobile}&Name=${orgName}&refName=${targetName}&Relation=${targetRelation}&Type=${type}`;
      const res = await post({ url });

      console.log('Request URL:', url);
      console.log('Response:', res);

      if (res.Content?.ADDINFO === 'Send OTP') {
        ToastAndroid.show(`📩 OTP Sent to ${type} Number`, ToastAndroid.SHORT);
        setOtpModalVisible(true);
      } else {
        alert(`⚠ Failed to send OTP. Message: ${res.Content?.ADDINFO}`);
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      alert('❌ Error sending OTP.');
    } finally {
      setIsloading(false);
    }
  };



  const handleVerifyOtp = async (type) => {
    if (mobileOtp.length !== 4) {
      ToastAndroid.show('Please enter 4-digit OTP', ToastAndroid.BOTTOM);
      return;
    }

    setIsloading(true);

    const targetMobile =
      type === 'Neighbor' ? mobileNo :
        type === 'CloseRelative' ? closeMobileNo :
          type === 'Emergency' ? emmobileNo : '';

    const targetName =
      type === 'Neighbor' ? name :
        type === 'CloseRelative' ? closeName :
          type === 'Emergency' ? emname : '';

    const targetRelation = type;

    try {
      const url = `${APP_URLS.VerifyOTPMobileOther}Mobile=${targetMobile}&Name=${orgName}&Type=${type}&OTP=${mobileOtp}&refName=${targetName}&Relation=${targetRelation}`;
      const res = await post({ url });

      console.log('Verify URL:', url);
      console.log('Verify Response:', res);

      if (res.Content?.ADDINFO === 'DONE') {
        ToastAndroid.show('✅ OTP Verified Successfully.', ToastAndroid.BOTTOM);
        setOtpModalVisible(false);

        if (type === 'Neighbor') {
          setNeighbourVerifyMobile(true);
        } else if (type === 'CloseRelative') {
          setCloseVerifymobile(true);
        } else if (type === 'Emergency') {
          setEmergencyVerifyMobilenumber(true);
          console.log('====================================');
          console.log(emergencyVerifyMobilenumber,);
          console.log('====================================');
        }
      } else {
        alert(`⚠ OTP verification failed. Status: ${res.Content?.ADDINFO}`);
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      alert('❌ Error verifying OTP.');
    } finally {
      setIsloading(false);
    }
  };


return (
    <View style={styles.main}>
      {/* KeyboardAwareScrollView: यह सुनिश्चित करता है कि कीबोर्ड इनपुट फील्ड्स को न छुपाए */}
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          
          {/* --- TWO WHEELER SECTION --- */}
          <TouchableOpacity onPress={handlewheel}>
            <View pointerEvents="none">
              <FlotingInput
                label={'Have Two Wheeler'}
                value={iswheeler ? 'Yes' : 'No'}
                editable={false}
              />
            </View>
            <View style={styles.righticon2}>
              <View style={styles.deviceItem}>
                <View
                  style={[
                    styles.languageEmojiContainer,
                    { backgroundColor: iswheeler ? colorConfig.secondaryColor : color1 }
                  ]}
                >
                  {iswheeler && <CheckSvg />}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {iswheeler && (
            <FlotingInput
              label={'Two Wheeler No.'}
              onChangeTextCallback={(text) => setTwoWheelerNo1(text)}
              value={twoWheelerNo1}
              maxLength={10}
              autoCapitalize="characters"
            />
          )}

          {/* --- NEIGHBOUR INFORMATION --- */}
          <FlotingInput
            label={'Neighbour Name'}
            value={name}
            onChangeTextCallback={(text) => setName(text.replace(/[^a-zA-Z\s]/g, ''))}
          />

          <View>
            <FlotingInput
              label={'Mobile No.'}
              onChangeTextCallback={(text) => setMobileNo(text.replace(/\D/g, ""))}
              value={mobileNo}
              keyboardType='numeric'
              maxLength={10}
            />
            {mobileNo && mobileNo.length === 10 && (
              <TouchableOpacity
                style={styles.righticon2}
                onPress={() => !neighbourVerifyMobile && handleSendOtp('Neighbor')}
              >
                {neighbourVerifyMobile ? (
                  <View style={[styles.languageEmojiContainer, { backgroundColor: colorConfig.secondaryColor }]}>
                    <CheckSvg />
                  </View>
                ) : (
                  <Text style={styles.VerifiedNo}>{translate("Verify_Now")}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* --- CLOSE RELATIVE INFORMATION --- */}
          <Text style={[styles.related, { color: colorConfig.secondaryColor, marginTop: 20 }]}>{translate("Close_Relative_Information")}</Text>

          <FlotingInput
            label={'Name'}
            onChangeTextCallback={(text) => setCloseName(text.replace(/[^a-zA-Z\s]/g, ''))}
            value={closeName}
          />

          <View>
            <FlotingInput
              label={'Mobile No.'}
              onChangeTextCallback={(text) => setCloseMobileNo(text.replace(/\D/g, ""))}
              value={closeMobileNo}
              keyboardType='numeric'
              maxLength={10}
            />
            {closeMobileNo && closeMobileNo.length === 10 && (
              <TouchableOpacity
                style={styles.righticon2}
                onPress={() => !closeVerifymobile && handleSendOtp('CloseRelative')}
              >
                {closeVerifymobile ? (
                  <View style={[styles.languageEmojiContainer, { backgroundColor: colorConfig.secondaryColor }]}>
                    <CheckSvg />
                  </View>
                ) : (
                  <Text style={styles.VerifiedNo}>{translate("Verify_Now")}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <FlotingInput
            label={'Address'}
            onChangeTextCallback={setCloseAddress}
            value={closeAddress}
          />
          
          <FlotingInput
            label={'Pin Code'}
            onChangeTextCallback={(text) => setClosePin(text.replace(/\D/g, ""))}
            value={closePin}
            keyboardType='numeric'
            maxLength={6}
          />

          {/* --- EMERGENCY CONTACT INFORMATION --- */}
          <Text style={[styles.related, { color: colorConfig.secondaryColor, marginTop: 20 }]}>{translate("Emergency_Contact_Information")}</Text>

          <FlotingInput
            label={'Name'}
            onChangeTextCallback={(text) => setEmName(text.replace(/[^a-zA-Z\s]/g, ''))}
            value={emname}
          />
          
          <FlotingInput
            label={'Relationship'}
            onChangeTextCallback={(text) => setEmaRelation(text.replace(/[^a-zA-Z\s]/g, ''))}
            value={emrelation}
          />

          <View>
            <FlotingInput
              label={'Mobile No'}
              onChangeTextCallback={(text) => setEmMobileNo(text.replace(/\D/g, ""))}
              value={emmobileNo}
              keyboardType='phone-pad'
              maxLength={10}
            />
            {emmobileNo && emmobileNo.length === 10 && (
              <TouchableOpacity
                style={styles.righticon2}
                onPress={() => !emergencyVerifyMobilenumber && handleSendOtp('Emergency')}
              >
                {emergencyVerifyMobilenumber ? (
                  <View style={[styles.languageEmojiContainer, { backgroundColor: colorConfig.secondaryColor }]}>
                    <CheckSvg />
                  </View>
                ) : (
                  <Text style={styles.VerifiedNo}>{translate("Verify_Now")}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* SUBMIT BUTTON */}
          <View style={{ marginVertical: 30 }}>
            <DynamicButton 
              title={isLoading2 ? <ActivityIndicator size={'small'} color={colorConfig.labelColor} /> : 'Submit'}
              onPress={() => CandiantForm()} 
            />
          </View>
        </View>

        {/* OTP MODAL */}
        <OTPModal
          inputCount={4}
          setShowOtpModal={setOtpModalVisible}
          disabled={mobileOtp.length !== 4}
          showOtpModal={otpModalVisible}
          setMobileOtp={setMobileOtp}
          verifyOtp={() => handleVerifyOtp(otpType)}
          sendID={sendid}
        />
      </KeyboardAwareScrollView>

      {/* FULL SCREEN LOADER */}
      {isLoading && <ShowLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    marginTop: hScale(10),
    marginBottom: hScale(10),
    paddingHorizontal: wScale(10)
  },
  related: {
    fontSize: wScale(20),
    fontWeight: 'bold',
    paddingBottom: hScale(5)
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
  deviceItem: {
    paddingVertical: hScale(12),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceItemText: {
    color: '#000',
    fontSize: wScale(16),
    textAlign: 'center',
    textTransform: 'capitalize',
    paddingLeft: wScale(10)
  },
  languageEmojiContainer: {
    borderWidth: wScale(.5),
    borderRadius: 25,
    height: wScale(30),
    width: wScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  VerifiedNo: {
    borderWidth: wScale(.4),
    borderColor: '#000',
    borderRadius: wScale(5),
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: wScale(5),
    paddingVertical: hScale(7),
    backgroundColor: '#ffcfd7',
    elevation: 3
  },

});

export default DrawingLaises;
