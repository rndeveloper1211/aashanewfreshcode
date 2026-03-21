import { translate } from "../../../utils/languageUtils/I18n";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import DynamicButton from "../../drawer/button/DynamicButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import LottieView from "lottie-react-native";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePreviewModal from "./ImagePreviewModal";
import { RadiantContext } from "./RadiantContext";
import ShowLoader from "../../../components/ShowLoder";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ReferencesRadiant = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;

  // Reference 1 state
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [designation, setDesignation] = useState('');

  // Reference 2 state
  const [name2, setName2] = useState('');
  const [mobileNo2, setMobileNo2] = useState('');
  const [email2, setEmail2] = useState('');
  const [address2, setAddress2] = useState('');
  const [designation2, setDesignation2] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { post } = useAxiosHook();
  const { currentPage, setCurrentPage } = useContext(RadiantContext);

  const validateAndSubmit = () => {
    if (!name.trim()) return showToast("Please enter your Name");
    if (!mobileNo.trim() || mobileNo.length < 10) return showToast("Please enter a valid Mobile Number");
    if (!email.trim() || !email.includes('@')) return showToast("Please enter a valid Email");
    if (!address.trim()) return showToast("Please enter your Address");
    if (!designation.trim()) return showToast("Please enter your Designation");

    if (!name2.trim()) return showToast("Please enter Reference Name");
    if (!mobileNo2.trim() || mobileNo2.length < 10) return showToast("Please enter a valid Reference Mobile Number");
    if (!email2.trim() || !email2.includes('@')) return showToast("Please enter a valid Reference Email");
    if (!address2.trim()) return showToast("Please enter Reference Address");
    if (!designation2.trim()) return showToast("Please enter Reference Designation");

    return true;  // Return `true` if validation passes
  };

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  }; const CandiantForm = useCallback(async () => {
    if (!validateAndSubmit()) return;
    setIsLoading2(true);

    try {

      const data = {
        ReferenceDetails: [
          {
            RefName: name,
            RefMobile: mobileNo,
            RefEmail: email,
            RefAddress: address,
            RefDesignation: designation,
          },
          {
            RefName: name2,
            RefMobile: mobileNo2,
            RefEmail: email2,
            RefAddress: address2,
            RefDesignation: designation2,
          }
        ]
      };

      const res = await post({ url: APP_URLS.RadiantCandiantForm5, data });
      console.log('Response:', res, 'Data Sent:', data);

      if (res.status === 'Data Insert Successfully') {
        setCurrentPage(currentPage + 1);
        ToastAndroid.show(res.status || '', ToastAndroid.SHORT);
      } else {
        throw new Error(res.status || "Something went wrong!");
      }
      if (res.status === 'Not' || res.Message === 'An error has occurred.' || res.status === 'An error has occurred.') {
        alert('Submission failed. Please contact admin.');
        return;
      }

    } catch (error) {
      console.error("Error in CandiantForm:", error);
      ToastAndroid.show(error.message || "Submission failed!", ToastAndroid.SHORT);
    } finally {
      setIsLoading2(false);
    }
  }, [
    name, mobileNo, email, address, designation,
    name2, mobileNo2, email2, address2, designation2,
    post
  ]);

  // Fetch initial data
  useEffect(() => {
    Formdata();
  }, []);

  const Formdata = async () => {
    try {
      const res = await post({ url: APP_URLS.RadiantForm5Data });
      console.log('API Response:', res);

      const responseArray = res?.data?.responseData;

      if (Array.isArray(responseArray) && responseArray.length > 0) {
        // Reference 1 data
        const ref1 = responseArray[0];
        setName(ref1.Name || '');
        setMobileNo(ref1.Mobile || '');
        setEmail(ref1.Email || '');
        setAddress(ref1.Address || '');
        setDesignation(ref1.Designation || '');

        // Reference 2 data (if available)
        if (responseArray.length > 1) {
          const ref2 = responseArray[1];
          setName2(ref2.Name || '');
          setMobileNo2(ref2.Mobile || '');
          setEmail2(ref2.Email || '');
          setAddress2(ref2.Address || '');
          setDesignation2(ref2.Designation || '');

        }
      } if (res.Message === "An error has occurred.") {
        alert('Data retrieval failed. Please contact the Admin.');

      }
    } catch (error) {
      console.error('Error in Formdata:', error);
      alert('Something went wrong while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleEmailChange = (text) => {
    const cleanedEmail = text.replace(/\s/g, ''); // Remove all spaces
    setEmail(cleanedEmail);

    // Basic real-time validation (optional)
    if (text.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };
  const handleEmailChange2 = (text) => {
    const cleanedEmail = text.replace(/\s/g, ''); // Remove all spaces
    setEmail2(cleanedEmail);

    // Basic real-time validation (optional)
    if (text.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

return (
    <View style={styles.main}>
      {/* ScrollView की जगह KeyboardAwareScrollView का उपयोग कीबोर्ड ओवरलैप से बचने के लिए */}
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* --- Reference 1 Information --- */}
          <Text style={[styles.related, { color: colorConfig.secondaryColor, marginBottom: 10 }]}>{translate("Reference_1_Information")}</Text>

          <FlotingInput
            label={'Name'}
            onChangeTextCallback={(text) => { setName(text.replace(/[^a-zA-Z\s]/g, '')) }}
            value={name}
          />
          
          <FlotingInput
            label={'Mobile No.'}
            onChangeTextCallback={(text) => { setMobileNo(text.replace(/\D/g, "")) }}
            value={mobileNo}
            keyboardType="phone-pad"
            maxLength={10}
          />
          
          <FlotingInput
            label={'Email'}
            onChangeTextCallback={handleEmailChange}
            error={emailError}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <FlotingInput
            label={'Address'}
            onChangeTextCallback={(text) => { setAddress(text) }} // एड्रेस में नंबर और स्पेशल कैरेक्टर्स हो सकते हैं, इसलिए regex हटाया
            value={address}
            multiline={true}
          />
          
          <FlotingInput
            label={'Designation'}
            onChangeTextCallback={(text) => { setDesignation(text.replace(/[^a-zA-Z\s]/g, '')) }}
            value={designation}
          />

          {/* --- Reference 2 Information --- */}
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.related, { color: colorConfig.secondaryColor, marginBottom: 10 }]}>{translate("References_2_Information")}</Text>
          </View>

          <FlotingInput
            label={'Name'}
            onChangeTextCallback={(text) => { setName2(text.replace(/[^a-zA-Z\s]/g, '')) }}
            value={name2}
          />
          
          <FlotingInput
            label={'Mobile No.'}
            onChangeTextCallback={(text) => { setMobileNo2(text.replace(/\D/g, "")) }}
            value={mobileNo2}
            keyboardType="phone-pad"
            maxLength={10}
          />
          
          <FlotingInput
            label={'Email'}
            onChangeTextCallback={handleEmailChange2}
            value={email2}
            error={emailError2} // यहाँ सुनिश्चित करें कि emailError2 स्टेट मौजूद है
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <FlotingInput
            label={'Address'}
            onChangeTextCallback={(text) => { setAddress2(text) }}
            value={address2}
            multiline={true}
          />
          
          <FlotingInput
            label={'Designation'}
            onChangeTextCallback={(text) => { setDesignation2(text.replace(/[^a-zA-Z\s]/g, '')) }}
            value={designation2}
          />

          {/* --- Submit Button Section --- */}
          <View style={{ marginVertical: 30 }}>
            <DynamicButton
              title={isLoading2 ? (
                <ActivityIndicator size={'small'} color={colorConfig.labelColor} />
              ) : (
                'Submit'
              )} 
              onPress={CandiantForm}
            />
          </View>

        </View>
      </KeyboardAwareScrollView>

      {/* Full Screen Loader */}
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
  lotiimg: {
    height: hScale(44),
    width: wScale(44),
  },
});

export default ReferencesRadiant;
