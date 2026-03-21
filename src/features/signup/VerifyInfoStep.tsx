/* eslint-disable react-native/no-inline-styles */
import StepIndicator from 'react-native-step-indicator';
import { Button } from '@rneui/themed';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { encrypt } from '../../utils/encryptionUtils';
import { useNavigation } from '@react-navigation/native';
import { StepIndicatorStyle } from './stepIndicatorStyle';
import LottieView from 'lottie-react-native';
import { colors } from '../../utils/styles/theme';
import { hScale, SCREEN_HEIGHT, wScale } from '../../utils/styles/dimensions';
import BackArrow from '../../utils/svgUtils/BackArrow';
import { SignUpContext } from './SignUpContext';
import { SvgUri, SvgXml } from 'react-native-svg';
import DropdownSvg from '../../utils/svgUtils/DropdownSvg';
import { FlashList } from '@shopify/flash-list';
import { stateData } from '../../utils/stateData';
import { BottomSheet } from '@rneui/themed';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import OTPTextView from 'react-native-otp-textinput';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import DynamicButton from '../drawer/button/DynamicButton';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const VerifyInfoStep = () => {
  const { get } = useAxiosHook();
  const {
    dateOfBirth,
    referralCode,
    addressState,
    password,
    verifyPassword,
    district,
    email,
    mobileNumber,
    username,
    businessName,
    businessType,
    city,
    gender,
    gst,
    personalAadhar,
    personalPAN,
    pincode,
    videoKyc,
    aadharFront,
    aadharBack,
    panImg,
    gstImg,
    currentPage,
    stateId,
    svg,
    Radius2
  } = useContext(SignUpContext);


  const { post } = useAxiosHook();



  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const validateFields = () => {
    const fields = {
      dateOfBirth,
      referralCode,
      stateId,
      password,
      district,
      email,
      mobileNumber,
      username,
      businessName,
      businessType,
      city,
      gst,
      personalAadhar,
      personalPAN,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        Alert.alert('Validation Error', `Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return false;
      }
    }
    return true;
  };

  const navigation = useNavigation<any>();

  const JoinUs = useCallback(async () => {
    console.log(stateId)
    try {
      const url =   `${APP_URLS.baseapiurl}`;
      const Pin = '1234';

      const encryption = await encrypt([
        username,
        dateOfBirth,
        stateId.toString(),
        district,
        pincode,
        businessName,
        mobileNumber,
        email,
        referralCode,
        password,
        businessType,
        personalAadhar,
        personalPAN,
        gst,
        Pin,

      ]);

      const jsonString = {
        Name: encodeURIComponent(encryption.encryptedData[0]),
        Dob: encodeURIComponent(encryption.encryptedData[1]),
        state: encodeURIComponent(encryption.encryptedData[2]),
        distict: encodeURIComponent(encryption.encryptedData[3]),
        Address: encodeURIComponent(encryption.encryptedData[4]),
        PinCode: encodeURIComponent(encryption.encryptedData[5]),
        Businessname: encodeURIComponent(encryption.encryptedData[6]),
        phone: encodeURIComponent(encryption.encryptedData[7]),
        Email: encodeURIComponent(encryption.encryptedData[8]),
        ReferralCode: referralCode,
        Password: encodeURIComponent(encryption.encryptedData[10]),
        businesstype: encodeURIComponent(encryption.encryptedData[11]),
        aadharcard: encodeURIComponent(encryption.encryptedData[12]),
        pancard: encodeURIComponent(encryption.encryptedData[13]),
        Gst: encodeURIComponent(encryption.encryptedData[14]),
        PIN: "1234",
        valuess1: encodeURIComponent(encryption.keyEncode),
        valuesss2: encodeURIComponent(encryption.ivEncode),

      };

      console.log(encodeURIComponent(encryption.encryptedData[15]),)
      const data1 = Object.fromEntries(
        Object.entries(jsonString).map(([key, value]) => [key, decodeURIComponent(value)])
      );

      const data = await JSON.stringify(data1);
      console.log(data);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data
      };
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        Alert.alert(
          "Alert",
          `Response: ${responseData.Response}\nMessage: ${responseData.Message}\n`,
          [
            {
              text: responseData.Response === "Success" ? "Go to Login Screen" : "OK",
              onPress: () => {
                if (responseData.Response === "Success") {
                  navigation.navigate('LoginScreen');
                }
              }
            }
          ]
        );



      } catch (error) {
        console.error('Error in fetch request:', error);
      }
    } catch (error) {
      console.error('Error in JoinUs function:', error);
    }
  }, [username, dateOfBirth, addressState, district, pincode, businessName, mobileNumber, email, referralCode, password, businessType, personalAadhar, personalPAN, gst, aadharFront, aadharBack, panImg, gstImg]);

  return (
<KeyboardAwareScrollView
    // यह स्क्रीन को पूरी जगह लेने में मदद करता है
    style={{ flex: 1, backgroundColor: 'white' }} 
    // यह टाइपिंग के दौरान स्क्रॉलिंग को चालू रखता है
    contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }} 
    // Android के लिए ज़रूरी सेटिंग्स
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    // इनपुट और कीबोर्ड के बीच की दूरी
    extraScrollHeight={120} 
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >

      <View style={styles.container}>
        <View style={styles.inputview}>

          <FlotingInput label={'Mobile Number'}
            value={mobileNumber}
            editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.MobileNumber}
            />

          </View>
        </View>
        <View style={styles.inputview}>

          <FlotingInput label={'User Name'}
            value={username} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.personUser}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'Email Id'}
            value={email} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.Email}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'Personal Aadhar'}
            value={personalAadhar} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.AadharCard}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'Personal PAN'}
            value={personalPAN} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.PanCard}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'Referral Code'}
            value={referralCode} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.ReferralCode}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'Date Of Birth (dd/mm/yyyy)'}
            value={dateOfBirth} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.Calendar}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'State'}
            value={addressState} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.State}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'Pin Code'}
            value={pincode} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.PinCodeLocation}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput label={'District'}
            value={district} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.District}
            />

          </View>
        </View>

        <View style={styles.inputview}>
          <FlotingInput label={'Business Name'}
            value={businessType} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.BussinessName}
            />

          </View>
        </View>

        <View style={styles.inputview}>
          <FlotingInput label={'Business Type'}
            value={businessType} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.BusinessType}
            />

          </View>
        </View>

        <View style={styles.inputview}>

          <FlotingInput label={'GST (optional)'}
            value={gst} editable={false}
            labelinputstyle={styles.labelinputstyle}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]}
          />

          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.GST}
            />

          </View>
        </View>
        <DynamicButton title={'Join Now'} onPress={() => {
          JoinUs();

        }} styleoveride={{ marginTop: 10 }} />
      </View></KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wScale(15),
    paddingVertical: hScale(20),
    paddingBottom: hScale(20),
    backgroundColor: '#fff'
  },
  inputstyle: {
    marginBottom: 0,
    paddingLeft: wScale(68)
  },
  inputview: {
    marginBottom: hScale(18),
  },
  IconStyle: {
    width: hScale(48),
    justifyContent: 'center',
    position: "absolute",
    height: "100%",
    top:hScale(4)

  },
  labelinputstyle: { left: wScale(63) },

});

export default VerifyInfoStep;
