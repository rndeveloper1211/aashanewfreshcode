import { translate } from "../../../utils/languageUtils/I18n";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, Alert, Platform, PermissionsAndroid, ActivityIndicator, Text, RefreshControl } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import DynamicButton from "../../drawer/button/DynamicButton";
import LottieView from "lottie-react-native";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePreviewModal from "./ImagePreviewModal";
import ShowLoader from "../../../components/ShowLoder";
import { RadiantContext } from "./RadiantContext";
import { useNavigation } from "@react-navigation/native";
import RNFS from 'react-native-fs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const UploadDocRadiant = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [isLoading, setIsloading] = useState(true);
  const [isLoading2, setIsloading2] = useState(false);

  const [panVerify, setPanVerify] = useState(false);
  const [pan, setPan] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [aadharVerify, setAadharVerify] = useState(false);
  const [drivingLicence, setDrivingLicence] = useState('');
  const [voterID, setVoterID] = useState('');
  const [rationCard, setRationCard] = useState('');
  const [passport, setPassport] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [policeVerification, setPoliceVerification] = useState('Optional');

  const [panImage, setPanImage] = useState('');
  const [aadharFrontImage, setAadharFrontImage] = useState('');
  const [aadharBackImage, setAadharBackImage] = useState('');
  const [securityChequeImage, setSecurityChequeImage] = useState('');
  const [creditScoreImage, setCreditScoreImage] = useState('');
  const [policeVerificationImage, setPoliceVerificationImage] = useState('');
  const [signatureImage, setSignatureImage] = useState('');
  const [passportPhotoImage, setPassportPhotoImage] = useState('');
  const [drivingLicenceImage, setDrivingLicenceImage] = useState('');
  const [voterIDImage, setVoterIDImage] = useState('');
  const [rationCardImage, setRationCardImage] = useState('');
  const [passportImage, setPassportImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState('');
  const [currentDocumentType, setCurrentDocumentType] = useState('');
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [checkInfo, setCheckInfo] = useState('');

  const { post } = useAxiosHook();
  // console.warn(passportPhotoImage, '===');

  const handleCheck = (item) => {
    if (item !== 'drivingLicence') {
      setDrivingLicence('');
      setDrivingLicenceImage('');
    }
    if (item !== 'voterID') {
      setVoterID('');
      setVoterIDImage('');
    }
    if (item !== 'rationCard') {
      setRationCard('');
      setRationCardImage('');
    }
    if (item !== 'passport') {
      setPassport('');
      setPassportImage('');
    }

    setSelectedCheck(item);
  };
  useEffect(() => {
    Formdata()
  }, []);
  const { currentPage, setCurrentPage } = useContext(RadiantContext);

  const navigation = useNavigation<any>();
  console.log('====================================');
  console.log(aadharVerify, panVerify);
  console.log('====================================');







const Formdata = async () => {
  try {
    const res = await post({ url: APP_URLS.RadiantForm6Data });
    console.log(res, 'API Response');

    // Basic details
    setPan(res?.Pancardnumber ?? '');
    setPanImage(res?.Pancardimage ?? '');
    setAadhar(res?.aadharcardnumber ?? '');
    setAadharFrontImage(res?.aadharcardfront ?? '');
    setAadharBackImage(res?.aadharcardback ?? '');
    setAadharVerify(res?.VerifyAadharCard ?? false);
    setPanVerify(res?.VerifyPancard ?? false);

    // Other document type
    const otherType = res?.OtherName ?? null;
    setSelectedCheck(otherType);

    const otherNumber = res?.OtherNumber ?? '';
    const otherImage = res?.OtherImage ?? '';

    switch (otherType) {
      case 'drivingLicence':
        setDrivingLicence(otherNumber);
        setDrivingLicenceImage(otherImage);
        break;
      case 'voterID':
        setVoterID(otherNumber);
        setVoterIDImage(otherImage);
        break;
      case 'rationCard':
        setRationCard(otherNumber);
        setRationCardImage(otherImage);
        break;
      case 'passport':
        setPassport(otherNumber);
        setPassportImage(otherImage);
        break;
    }

    // Additional documents
    setSecurityChequeImage(res?.Securitycheck ?? '');
    setCreditScore(res?.CreditcardScore ?? '');
    setCreditScoreImage(res?.CreditCardscoreimage ?? '');
    setPoliceVerificationImage(res?.Policeverificationimage ?? '');
    setSignatureImage(res?.signature ?? '');
    setPassportPhotoImage(res?.passpostsizephoto ?? '');

    // Error message check
    if (res?.Message === "An error has occurred.") {
      alert('Data retrieval failed. Please contact the Admin.');
    }
  } catch (error) {
    console.error("Error in form1Data:", error);
  } finally {
    setIsloading(false);
  }
};

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };
  const validateAndSubmit = () => {
    const validations = [
      // PAN Validation
      {
        condition: !pan,
        message: "PAN card number is required"
      },
      {
        condition: pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan),
        message: "Invalid PAN format (e.g., ABCDE1234F)"
      },
      {
        condition: !panImage,
        message: "PAN card image is required"
      },

      // Aadhar Validation
      {
        condition: !aadhar,
        message: "Aadhar number is required"
      },
      {
        condition: aadhar && !/^\d{12}$/.test(aadhar),
        message: "Invalid Aadhar number (12 digits required)"
      },
      {
        condition: !aadharVerify,
        message: "Please verified your Aadhar number"
      },

      {
        condition: !panVerify,
        message: "Please verified your Pan number"
      },

      {
        condition: !aadharFrontImage,
        message: "Aadhar front image is required"
      },
      {
        condition: !aadharBackImage,
        message: "Aadhar back image is required"
      },

      // Document Type Validation
      {
        condition: !selectedCheck,
        message: "Please select one document type"
      },

      // Conditional Validations
      ...(selectedCheck === 'drivingLicence' ? [
        {
          condition: !drivingLicence,
          message: "Driving licence number is required"
        },
        // {
        //   condition: drivingLicence && !/^[A-Z]{2}-\d{13}$/.test(drivingLicence),
        //   message: "Invalid Driving licence format (e.g., DL-0123456789012)"
        // },
        {
          condition: !drivingLicenceImage,
          message: "Driving licence image is required"
        }
      ] : []),

      ...(selectedCheck === 'voterID' ? [
        {
          condition: !voterID,
          message: "Voter ID number is required"
        },
        {
          condition: voterID && !/^[A-Z]{3}[0-9]{7}$/.test(voterID),
          message: "Invalid Voter ID format (e.g., ABC1234567)"
        },
        {
          condition: !voterIDImage,
          message: "Voter ID image is required"
        }
      ] : []),

      ...(selectedCheck === 'rationCard' ? [
        {
          condition: !rationCard,
          message: "Ration card number is required"
        },
        {
          condition: !rationCardImage,
          message: "Ration card image is required"
        }
      ] : []),

      ...(selectedCheck === 'passport' ? [
        {
          condition: !passport,
          message: "Passport number is required"
        },
        {
          condition: passport && !/^[A-Z]{1}[0-9]{7}$/.test(passport),
          message: "Invalid Passport format (e.g., A1234567)"
        },
        {
          condition: !passportImage,
          message: "Passport image is required"
        }
      ] : []),

      // Common Validations
      {
        condition: !securityChequeImage,
        message: "Security cheque image is required"
      },
      {
        condition: !creditScore,
        message: "Credit score is required"
      },
      {
        condition: creditScore && isNaN(creditScore),
        message: "Credit score must be a number"
      },
      {
        condition: creditScore && (creditScore < 300 || creditScore > 900),
        message: "Credit score must be between 300-900"
      },
      {
        condition: !creditScoreImage,
        message: "Credit score proof is required"
      },
     
      {
        condition: !signatureImage,
        message: "Signature is required"
      },
      {
        condition: !passportPhotoImage,
        message: "Passport photo is required"
      }
    ];

    // Find first failed validation
    const failedValidation = validations.find(v => v.condition);

    if (failedValidation) {
      showToast(failedValidation.message);
      return false;
    }

    return true; // All validations passed
  };
  const CandiantForm = useCallback(async () => {
    if (!validateAndSubmit()) return;

    try {
      setIsloading2(true);

      const otherDocs = {
        drivingLicence,
        voterID,
        rationCard,
        passport
      };

      const otherImages = {
        drivingLicence: drivingLicenceImage,
        voterID: voterIDImage,
        rationCard: rationCardImage,
        passport: passportImage
      };

      const data = {
        PancardNumber: pan,
        Pancardcopy: panImage,
        AadharcardNumber: aadhar,
        AadharcardFrontcopy: aadharFrontImage,
        AadharcardBackcopy: aadharBackImage,
        OtherName: selectedCheck,
        OtherNumber: otherDocs[selectedCheck] || '',
        OtherCopy: otherImages[selectedCheck] || '',
        CheckCopy: securityChequeImage,
        CreditCardScore: creditScore,
        CreditCardScoreCopy: creditScoreImage,
        PoliceVerification: policeVerification,
        PoliceVerificationCopy: policeVerificationImage,
        Signature: signatureImage,
        Passportsizephoto: passportPhotoImage,
        VerifyAadharCard: aadharVerify,
        VerifyPancard: panVerify,
      };

      const res = await post({ url: APP_URLS.RadiantCandiantForm6, data });
      console.log('Response:', res, 'Data Sent:', data
      );

      if (res?.status === 'Data Insert Successfully') {
        const res3 = await post({ url: APP_URLS.CheckPendingForm });
        console.warn('Third API Response:', res3);

        const status = (res3?.status || '').trim();
        setCheckInfo(status);

        if (status === 'Approved') {
          navigation.navigate('DownloadDocRadiant');
        } else if (status === 'Pending') {
          navigation.navigate('CheckPendingForm');
        } else {
          console.warn('Unknown status:', status);
          navigation.navigate('RadiantStep');
        }
        ToastAndroid.show(res.status || '', ToastAndroid.SHORT);
      } else {
        alert('Submission failed. Please contact admin.');
      }

    } catch (error) {
      console.error("Error in CandidateForm:", error);
      ToastAndroid.show(error.message || "Submission failed!", ToastAndroid.SHORT);
    } finally {
      setIsloading2(false);
    }
  }, [
    pan, panImage, aadhar, aadharFrontImage, aadharBackImage,
    securityChequeImage, creditScore, creditScoreImage,
    policeVerification, policeVerificationImage, signatureImage,
    passportPhotoImage, selectedCheck, drivingLicence, voterID,
    rationCard, passport, drivingLicenceImage, voterIDImage,
    rationCardImage, passportImage
  ]);


  const handleImageSelection = (documentType: string) => {
    const imageUri = getImageForDocument(documentType);
    if (imageUri && imageUri !== '') {
      setCurrentPreviewImage(imageUri);
      setCurrentDocumentType(documentType);
      setPreviewVisible(true);
    } else {
      Alert.alert(
        `Upload ${getDocumentName(documentType)}`,
        'Choose an option (Max 500KB)',
        [
          {
            text: 'Camera',
            onPress: () => {
              openImagePicker('camera', documentType);
              setPreviewVisible(false);
            }
          },
          {
            text: 'Gallery',
            onPress: () => {
              openImagePicker('gallery', documentType);
              setPreviewVisible(false);
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }


  };

  const openImagePicker = async (type: 'camera' | 'gallery', documentType: string) => {
    try {
      if (Platform.OS === 'android') {
        const cameraPerm = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const denied = Object.values(cameraPerm).includes(
          PermissionsAndroid.RESULTS.DENIED
        );
        if (denied) {
          ToastAndroid.show('Permissions denied', ToastAndroid.SHORT);
          return;
        }
      }

      const options = {
        mediaType: 'photo' as const,
        quality: 0.5,
        maxWidth: 1000,
        maxHeight: 1000,
        includeBase64: true, // Changed to true to get base64 directly
      };

      const callback = (response: any) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        } else if (response.errorCode) {
          console.log('Image Picker Error: ', response.errorCode);
          ToastAndroid.show('Error selecting image', ToastAndroid.SHORT);
          return;
        }

        const asset = response?.assets?.[0];
        if (!asset) return;

        const base64String = `data:${asset.type};base64,${asset.base64}`;
        const fileSize = Math.round((base64String.length * 3) / 4);
        const maxSize = 500 * 1024; // 500KB

        if (fileSize > maxSize) {
          ToastAndroid.show(
            `Image size ${(fileSize / 1024).toFixed(2)}KB exceeds 500KB limit`,
            ToastAndroid.LONG
          );
          return;
        }

        // Update the document image and show preview
        updateDocumentImage(documentType, base64String, asset.base64);
        ToastAndroid.show(
          `${getDocumentName(documentType)} uploaded successfully!`,
          ToastAndroid.SHORT
        );
      };

      type === 'camera'
        ? launchCamera(options, callback)
        : launchImageLibrary(options, callback);
    } catch (error) {
      console.error('Picker error:', error);
      ToastAndroid.show('Failed to open picker', ToastAndroid.SHORT);
    }
  };


  const handleReUpload = () => {
    updateDocumentImage(currentDocumentType, '', '');
    setCurrentPreviewImage('');
    setPreviewVisible(false);

    setTimeout(() => {

      Alert.alert(
        `Upload ${getDocumentName(currentDocumentType)}`,
        'Choose an option (Max 500KB)',
        [
          {
            text: 'Camera',
            onPress: () => {
              openImagePicker('camera', currentDocumentType);
            }
          },
          {
            text: 'Gallery',
            onPress: () => {
              openImagePicker('gallery', currentDocumentType);
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }, 200);
  };

  const updateDocumentImage = (type: string, source: string, base64: string) => {
    switch (type) {
      case 'pan':
        setPanImage(source);
        break;
      case 'aadharFront':
        setAadharFrontImage(source);
        break;
      case 'aadharBack':
        setAadharBackImage(source);
        break;
      case 'drivingPhoto':
        setDrivingLicenceImage(source);
        break;
      case 'voteridPhoto':
        setVoterIDImage(source);
        break;
      case 'rationPhoto':
        setRationCardImage(source);
        break;
      case 'passportImage':
        setPassportImage(source);
        break;
      case 'securityCheque':
        setSecurityChequeImage(source);
        break;
      case 'creditScore':
        setCreditScoreImage(source);
        break;
      case 'policeVerification':
        setPoliceVerificationImage(source);
        break;
      case 'signature':
        setSignatureImage(source);
        break;
      case 'passportPhoto':
        setPassportPhotoImage(source);
        break;
      default:
        console.warn('Unknown documentType:', type);
    }
    setCurrentPreviewImage(source);
    setCurrentDocumentType(type);

  };


  const getImageForDocument = (documentType: string) => {
    switch (documentType) {
      case 'pan': return panImage || null;
      case 'aadharFront': return aadharFrontImage || null;
      case 'aadharBack': return aadharBackImage || null;
      case 'securityCheque': return securityChequeImage || null;
      case 'creditScore': return creditScoreImage || null;
      case 'policeVerification': return policeVerificationImage || null;
      case 'signature': return signatureImage || null;
      case 'passportPhoto': return passportPhotoImage || null;
      case 'passportImage': return passportImage || null;
      case 'drivingPhoto': return drivingLicenceImage || null;
      case 'voteridPhoto': return voterIDImage || null;
      case 'rationPhoto': return rationCardImage || null;
      default: return null;
    }
  };

  const getDocumentName = (documentType: string) => {
    switch (documentType) {
      case 'pan': return 'Pan Card';
      case 'aadharFront': return 'Aadhar Front';
      case 'aadharBack': return 'Aadhar Back';
      case 'securityCheque': return 'Security Cheque';
      case 'creditScore': return 'Credit Score';
      case 'policeVerification': return 'Police Verification';
      case 'signature': return 'Signature';
      case 'passportPhoto': return 'Passport Size Photo';
      case 'passportImage': return 'Passport No.';
      case 'drivingLicence': return 'Driving Licence';
      case 'rationPhoto': return 'Ration Card';
      case 'voteridPhoto': return 'Voter ID';
      default: return 'Document';
    }
  };
  const handleCheckVerify = async () => {
    setIsloading(true);

    try {
      const url = `${APP_URLS.Checkaadharverify}Aadharcardnumber=${aadhar}`;
      const res = await post({ url });

      console.log('Request URL:', url);
      console.log('Response:', res);

      // ✅ Extract message and show alert


      // ✅ Update verification status
      if (res?.Content?.ADDINFO?.stsverify) {
        setAadharVerify(true);
      } else {
        setAadharVerify(false);
        const message = res?.Content?.ADDINFO?.Message || 'No message received';
        Alert.alert('Aadhar Verification', message);
      }

    } catch (error) {
      console.error('Verification Error:', error);
      Alert.alert('Error', 'Something went wrong during verification.');
    } finally {
      setIsloading(false);
    }
  };

  const handlePanVerify = async () => {
    setIsloading(true);

    try {
      const url = `${APP_URLS.Checkpancardverify}Pancardnumber=${pan}`;
      const res = await post({ url });

      console.log('Request URL:', url);
      console.log('Response:', res);

      const message = res?.Content?.ADDINFO?.Message || 'No message received';

      if (res?.Content?.ADDINFO?.stsverify) {
        setPanVerify(true);
      } else {
        setPanVerify(false);
        Alert.alert('PAN Verification', message);
      }

    } catch (error) {
      console.error('PAN Verification Error:', error);
      Alert.alert('Error', 'Something went wrong during PAN verification.');
    } finally {
      setIsloading(false);
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);
 const onRefresh = async () => {
  setRefreshing(true);
  try {
    const res = await post({ url: APP_URLS.RadiantCandiantForm6 });
    console.log('Response:', res);

    const res3 = await post({ url: APP_URLS.CheckPendingForm });
    console.warn('Third API Response:', res3);

    const status = (res3?.status || '').trim();
    setCheckInfo(status);

    if (status === 'Approved') {
      console.log('Navigating to DownloadDocRadiant');
      navigation.navigate('DownloadDocRadiant');
    } else if (status === 'Pending') {
      console.log('Navigating to CheckPendingForm');
      navigation.navigate('CheckPendingForm');
    } else {
      console.log('Navigating to RadiantStep');
      navigation.navigate('RadiantStep');
    }

  } catch (error) {
    console.error('Refresh error:', error);
  } finally {
    setRefreshing(false);
  }
};

return (
    <View style={styles.main}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          
          {/* --- PAN CARD SECTION --- */}
          <View>
            <FlotingInput
              label={'PAN Card'}
              onChangeTextCallback={(text) => {
                setPan(text.replace(/[^A-Z0-9]/gi, '').toUpperCase());
              }}
              value={pan}
              maxLength={10}
            />

            {pan && pan.length === 10 ? (
              <View style={styles.righticon2}>
                {panVerify ? (
                  <View style={[styles.languageEmojiContainer, { backgroundColor: colorConfig.secondaryColor }]}>
                    <CheckSvg />
                  </View>
                ) : (
                  <TouchableOpacity onPress={handlePanVerify}>
                    <Text style={styles.VerifiedNo}>{translate("Verify_Now")}</Text>
                  </TouchableOpacity>
                )}

                {panVerify && (
                  <TouchableOpacity style={styles.imgbtn} onPress={() => handleImageSelection('pan')}>
                    <LottieView
                      autoPlay loop
                      style={styles.lotiimg}
                      source={panImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>

          {/* --- AADHAR SECTION --- */}
          <View>
            <FlotingInput
              label={'Aadhar No & Front Image'}
              onChangeTextCallback={(text) => { setAadhar(text.replace(/\D/g, "")) }}
              value={aadhar}
              keyboardType="number-pad"
              maxLength={12}
            />

            {aadhar && aadhar.length === 12 ? (
              <View style={styles.righticon2}>
                {aadharVerify ? (
                  <View style={[styles.languageEmojiContainer, { backgroundColor: colorConfig.secondaryColor }]}>
                    <CheckSvg />
                  </View>
                ) : (
                  <TouchableOpacity onPress={handleCheckVerify}>
                    <Text style={styles.VerifiedNo}>{translate("Verify_Now")}</Text>
                  </TouchableOpacity>
                )}

                {aadharVerify && (
                  <TouchableOpacity style={styles.imgbtn} onPress={() => handleImageSelection('aadharFront')}>
                    <LottieView
                      autoPlay loop
                      style={styles.lotiimg}
                      source={aadharFrontImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>

          <TouchableOpacity onPress={() => handleImageSelection('aadharBack')}>
            <View pointerEvents="none">
              <FlotingInput label={'Aadhar Back Image'} editable={false} />
            </View>
            <View style={styles.righticon2}>
              <LottieView
                autoPlay loop
                style={styles.lotiimg}
                source={aadharBackImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')}
              />
            </View>
          </TouchableOpacity>

          {/* --- OPTIONAL DOCUMENTS SECTION --- */}
          <View style={{ marginTop: 10 }}>
            {/* Driving Licence */}
            <View>
              <FlotingInput
                label={'Driving Licence'}
                onChangeTextCallback={(text) => setDrivingLicence(text.replace(/[^a-zA-Z0-9\/\-]/g, "").toUpperCase())}
                value={drivingLicence}
                editable={selectedCheck === 'drivingLicence'}
                maxLength={20}
              />
              <View style={styles.righticon2}>
                <TouchableOpacity onPress={() => handleCheck('drivingLicence')} style={styles.deviceItem}>
                  <View style={[styles.languageEmojiContainer, selectedCheck === 'drivingLicence' && { backgroundColor: colorConfig.secondaryColor }]}>
                    {selectedCheck === 'drivingLicence' && <CheckSvg />}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.imgbtn, selectedCheck !== 'drivingLicence' && { opacity: 0.5 }]} 
                  onPress={() => handleImageSelection('drivingPhoto')}
                  disabled={selectedCheck !== 'drivingLicence'}
                >
                  <LottieView autoPlay loop style={styles.lotiimg} source={drivingLicenceImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Voter ID */}
            <View>
              <FlotingInput
                label={'Voter ID'}
                onChangeTextCallback={(text) => setVoterID(text.replace(/[^a-zA-Z0-9\/\-]/g, "").toUpperCase().slice(0, 10))}
                value={voterID}
                editable={selectedCheck === 'voterID'}
                maxLength={10}
              />
              <View style={styles.righticon2}>
                <TouchableOpacity onPress={() => handleCheck('voterID')} style={styles.deviceItem}>
                  <View style={[styles.languageEmojiContainer, selectedCheck === 'voterID' && { backgroundColor: colorConfig.secondaryColor }]}>
                    {selectedCheck === 'voterID' && <CheckSvg />}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.imgbtn, selectedCheck !== 'voterID' && { opacity: 0.5 }]} 
                  onPress={() => handleImageSelection('voteridPhoto')}
                  disabled={selectedCheck !== 'voterID'}
                >
                  <LottieView autoPlay loop style={styles.lotiimg} source={voterIDImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* --- OTHER UPLOADS --- */}
          <TouchableOpacity onPress={() => handleImageSelection('securityCheque')}>
            <View pointerEvents="none">
              <FlotingInput label={'Security Cheque'} editable={false} />
            </View>
            <View style={styles.righticon2}>
              <LottieView autoPlay loop style={styles.lotiimg} source={securityChequeImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
            </View>
          </TouchableOpacity>

          <View>
            <FlotingInput
              label={'Credit Score'}
              onChangeTextCallback={setCreditScore}
              value={creditScore}
              maxLength={3}
              keyboardType='numeric'
            />
            <View style={styles.righticon2}>
              <TouchableOpacity style={styles.imgbtn} onPress={() => handleImageSelection('creditScore')}>
                <LottieView autoPlay loop style={styles.lotiimg} source={creditScoreImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => handleImageSelection('policeVerification')}>
            <View pointerEvents="none">
              <FlotingInput label={'Police Verification'} value={policeVerification} editable={false} />
            </View>
            <View style={styles.righticon2}>
              <LottieView autoPlay loop style={styles.lotiimg} source={policeVerificationImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleImageSelection('signature')}>
            <View pointerEvents="none">
              <FlotingInput label={'Signature'} editable={false} />
            </View>
            <View style={styles.righticon2}>
              <LottieView autoPlay loop style={styles.lotiimg} source={signatureImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleImageSelection('passportPhoto')}>
            <View pointerEvents="none">
              <FlotingInput label={'Passport Size Photo'} editable={false} />
            </View>
            <View style={styles.righticon2}>
              <LottieView autoPlay loop style={styles.lotiimg} source={passportPhotoImage ? require('../../../utils/lottieIcons/View-Docs.json') : require('../../../utils/lottieIcons/upload-file.json')} />
            </View>
          </TouchableOpacity>

          {/* --- SUBMIT --- */}
          <View style={{ marginVertical: 30 }}>
            <DynamicButton 
              title={isLoading2 ? <ActivityIndicator size={'small'} color={colorConfig.labelColor} /> : 'Submit'} 
              onPress={CandiantForm} 
            />
          </View>

          <ImagePreviewModal
            visible={previewVisible}
            imageUri={currentPreviewImage}
            onClose={() => setPreviewVisible(false)}
            reUpload={handleReUpload}
          />
        </View>
      </KeyboardAwareScrollView>
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
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: wScale(12),
    flexDirection: 'row',
  },
  lotiimg: {
    height: hScale(44),
    width: wScale(44),
  },
  imgbtn: {
    marginLeft: wScale(30)
  },
  deviceItem: {
    paddingVertical: hScale(12),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
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

export default UploadDocRadiant;
