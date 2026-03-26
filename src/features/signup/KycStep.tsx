import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { colors } from '../../utils/styles/theme';
import { SignUpContext } from './SignUpContext';
import { launchImageLibrary } from 'react-native-image-picker';
import DynamicButton from '../drawer/button/DynamicButton';
import ImageBottomSheet from '../../components/ImageBottomSheet';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import { SvgUri } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignUpKyc = () => {
  const {
    businessName,
    setBusinessName,
    businessType,
    setBusinessType,
    personalAadhar,
    setPersonalAadhar,
    personalPAN,
    setPersonalPAN,
    gst,
    setGST,
    videoKyc,
    setVideoKyc,
    currentPage,
    setCurrentPage,
    aadharFront,
    setAadharFront,
    aadharBack,
    setAadharBack,
    panImg,
    setPanImg,
    gstImg, setGstImg,
    svg,
    Radius2
  } = useContext(SignUpContext);
  const KycStep = () => {
    if (
      !businessName ||
      !businessType ||
      !personalAadhar ||
      !personalPAN ||
      !gst
    ) {
      ToastAndroid.showWithGravity(
        'All fields must be filled',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

    if (personalAadhar.length < 12) {
      ToastAndroid.showWithGravity(
        'Aadhar number must be at least 12 characters',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

    if (personalPAN.length < 12) {
      ToastAndroid.showWithGravity(
        'PAN number must be at least 12 characters',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return setCurrentPage(currentPage + 1);
      ;
    }
    if (gst.length < 15) {
      ToastAndroid.showWithGravity(
        'GST number must be at least 15 characters',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

  };

  const [imagePath, setImagePath] = useState<any>('');
  const [isImageModalVisible, setImageModalVisible] = useState(true);
  const [modalTitle, setModalTitle] = useState('');
  const [aadharf, setAdharf] = useState<any>(null);
  const [aadharb, setAdharb] = useState<any>(null);
  const [PanImage, setPanImage] = useState<any>(null);
  const [gstImage, setgstImage] = useState<any>(null);
  // const uploadImage = async (setImage, image) => {
  //   const result = await launchImageLibrary({
  //     selectionLimit: 1,
  //     mediaType: 'photo',
  //     includeBase64: true,
  //   });
  //   console.log(result)
  //   if (result?.assets && result?.assets.length > 0) {
  //     const base64Image = result?.assets[0]?.base64;
  //     switch (image) {
  //       case 'Aadhar Front':
  //         setAadharFront(base64Image);
  //         setAdharf(base64Image);
  //         break;
  //       case 'Aadhar Back':
  //         setAadharBack(base64Image);
  //         setAdharb(base64Image);
  //         break;
  //       case 'GST Image':
  //         setGstImg(base64Image);
  //         setgstImage(base64Image);
  //         break;
  //       case 'PAN Card':
  //         setPanImg(base64Image);
  //         setPanImage(base64Image);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };

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

          <FlotingInput
            label="Business Name"
            placeholderTextColor="#000"

            value={businessName}
            onChangeTextCallback={setBusinessName}
            labelinputstyle={{ left: wScale(68) }}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]} />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.BussinessName}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput
            label="Business Type"
            placeholderTextColor="#000"

            value={businessType}
            onChangeTextCallback={setBusinessType}
            labelinputstyle={{ left: wScale(68) }}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]} />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.BusinessType}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput
            label="Personal Aadhar"
            placeholderTextColor="#000"
            keyboardType="number-pad"
            value={personalAadhar}
            maxLength={12}
            onChangeTextCallback={setPersonalAadhar}
            labelinputstyle={{ left: wScale(68) }}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]} />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.AadharCard}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput
            label="Personal PAN"
            placeholderTextColor="#000"
            keyboardType="ascii-capable"
            value={personalPAN}
            maxLength={12}
            onChangeTextCallback={setPersonalPAN}
            labelinputstyle={{ left: wScale(68) }}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]} />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.PanCard}
            />

          </View>
        </View>
        <View style={styles.inputview}>
          <FlotingInput
            label="GST (optional)"
            placeholderTextColor="#000"

            value={gst}
            maxLength={15}
            onChangeTextCallback={setGST}
            labelinputstyle={{ left: wScale(68) }}
            inputstyle={[styles.inputstyle, { borderRadius: Radius2 }]} />
          <View style={[styles.IconStyle, {}]}>
            <SvgUri
              height={hScale(48)}
              width={hScale(48)}

              uri={svg.GST}
            />

          </View>
        </View>

        <DynamicButton title={'Next'} onPress={KycStep}
          styleoveride={{ marginTop: 10 }} />
      </View></KeyboardAwareScrollView>

  );
};

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: wScale(15),
    paddingVertical: hScale(20),
    backgroundColor: '#fff'
  },

  inputstyle: {
    marginBottom: 0,
    paddingLeft: wScale(63)
  },
  inputview: {
    marginBottom: hScale(18),
  },
  IconStyle: {
    width: hScale(48),
    justifyContent: 'center',
    position: "absolute",
    height: "100%",
    top:hScale(4.3)
  },
  labelinputstyle: { left: wScale(63) },
});

export default SignUpKyc;
