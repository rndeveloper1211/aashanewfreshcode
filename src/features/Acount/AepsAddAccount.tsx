import { translate } from "../../utils/languageUtils/I18n";
import React, { useEffect, useState, useCallback } from "react"
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Alert, Image, PermissionsAndroid, Keyboard, ToastAndroid, KeyboardAvoidingView, Platform } from "react-native"
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { hScale, SCREEN_HEIGHT, SCREEN_WIDTH, wScale } from "../../utils/styles/dimensions";
import FlotingInput from "../drawer/securityPages/FlotingInput";
import BankBottomSite from "../../components/BankBottomSite";
import OnelineDropdownSvg from "../drawer/svgimgcomponents/simpledropdown";
import { useDeviceInfoHook } from "../../utils/hooks/useDeviceInfoHook";
import { useSelector } from "react-redux";
import DynamicButton from "../drawer/button/DynamicButton";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { check, openSettings } from "react-native-permissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ShowLoader from "../../components/ShowLoder";
import { RootState } from "../../reduxUtils/store";
import { DotLoader } from "../../components/DotLoader ";
import CheckSvg from "../drawer/svgimgcomponents/CheckSvg";
import CloseSvg from "../drawer/svgimgcomponents/CloseSvg";
import { BottomSheet } from "@rneui/themed";
import ClosseModalSvg2 from "../drawer/svgimgcomponents/ClosseModal2";
import OTPModal from "../../components/OTPModal";
import { useLocationHook } from "../../hooks/useLocationHook";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AepsAddAccount = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`;
    const { get, post } = useAxiosHook()
    const [banklist, setBanklist] = useState([]);
    const [bank, setBank] = useState('');
    const [bankid, setBankid] = useState('');
    const [isBank, setIsBank] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ifsccode, setIfsccode] = useState('')
    const [acnNumber, setAcnNumber] = useState('')
    const [name, setName] = useState('')
    const [branch, setBranch] = useState('')
    const [Addresss, setAddresss] = useState('')
    const [bankAcclist, setBankAcclist] = useState({});
    const [Pincod, setPincode] = useState('');
    const [city, setCity] = useState('');
    const [add, setAdd] = useState(false);
    const [idno, setidno] = useState('')
    const [base64Img, setbase64Img] = useState<any>(null);
    const [isLoading, setisLoading] = useState(false);
    const [isotp, setIsOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const { latitude, longitude } = useLocationHook()
    const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
        useDeviceInfoHook();
    const { userId } = useSelector((state: RootState) => state.userInfo);

    // const UpdateRetailerBank = async (id) => {
    //     setisLoading(true);

    //     const loc = await readLatLongFromStorage();
    //     const ip = await getMobileIp();
    //     const Model = await getMobileDeviceId();
    //     const net = await getNetworkCarrier();

    //     const data = JSON.stringify({
    //         txtid3: id,
    //         txtaccholder: name,
    //         txtbankaccountno: acnNumber,
    //         txtifsc: ifsccode,
    //         txtbankname: bank,
    //         txtbranchaddress: branch,
    //         IP: ip,
    //         Latitude: loc?.latitude,
    //         Longitude: loc?.longitude,
    //         ModelNo: Model,
    //         City: city,
    //         PostalCode: Pincod,
    //         InternetTYPE: net,
    //         Address: Addresss,
    //     });

    //     console.log("Request Data Being Sent:", data);

    //     try {
    //         const url = `${APP_URLS.UpdateRetailerBank}`;
    //         const response = await post({
    //             url: url,
    //             data: {
    //                 txtid3: id,
    //                 txtaccholder: name,
    //                 txtbankaccountno: acnNumber,
    //                 txtifsc: ifsccode,
    //                 txtbankname: bank,
    //                 txtbranchaddress: branch,
    //                 IP: ip,
    //                 Latitude: loc?.latitude,
    //                 Longitude: loc?.longitude,
    //                 ModelNo: Model,
    //                 City: city,
    //                 PostalCode: Pincod,
    //                 InternetTYPE: net,
    //                 Address: Addresss,
    //             },
    //         });

    //         console.log("Response Received:", response);


    //         const sts = response.Response;
    //         setidno(idno);
    //         setisLoading(false);
    //         setLoading(false);
    //         if (sts === 'Success') {
    //             const idno = response.idno.toString();
    //             setidno(idno);
    //             Alert.alert(
    //                 '',
    //                 `${response.Message} \n Select the option for Upload Cancel Check Photo`,
    //                 [
    //                     {
    //                         text: 'Camera',
    //                         onPress: async () => {
    //                             await launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, (response) => {
    //                                 ; setbase64Img(response?.assets?.[0]?.base64);
    //                                 // uploadDoCx(response?.assets?.[0]?.base64,response.idno);
    //                                 //setisLoading(true)
    //                             });

    //                         },
    //                         style: 'default',
    //                     },
    //                     {
    //                         text: 'Gallery',
    //                         onPress: async () => {
    //                             await launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', includeBase64: true }, (response) => {

    //                                 setbase64Img(response?.assets?.[0]?.base64);
    //                                 // uploadDoCx(response?.assets?.[0]?.base64,response.idno);
    //                             });

    //                         },
    //                     },
    //                     {
    //                         text: "Cancel",
    //                         onPress: () => {
    //                             console.log("Cancel button clicked");
    //                         },
    //                         style: "cancel"
    //                     }
    //                 ]
    //             );
    //         } else {
    //             Alert.alert(`${response.Message}`);
    //         }
    //     } catch (error) {
    //         console.error("Error during UpdateRetailerBank request:", error);

    //         // Enhanced error handling for user notification
    //         const errorMessage = error?.response?.data?.message || "An error occurred while updating the retailer's bank details.";

    //         // Show a user-friendly error message along with error details for debugging
    //         Alert.alert("Error", `${errorMessage}\n\nDetails: ${error?.message || error?.toString()}`);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const uploadDoCx = async (bs64, idno) => {
        setisLoading(true);

        const data = {
            cancelledcheque: bs64,
            cancellchecque_idno: idno,
            currentrole: 'Retailer',
        };

        const body = JSON.stringify(data);

        console.log('Request Body:', body);

        try {
            const response = await fetch(`http://${APP_URLS.baseWebUrl}/api/user/Uploadcancelledcheque`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with actual token
                },
                body: body,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response Data:', responseData);

            // Check if responseData has the expected structure
            const { Message: status, data: responseDataContent } = responseData || {};

            // Set loading state to false after processing
            setisLoading(false);

            // Handle success or error based on status message
            if (status === 'Image Updated Successfully.') {
                Alert.alert(
                    'Success',
                    'Image Updated Successfully.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Error',
                    status || 'An error occurred while uploading the image.',
                    [{ text: 'OK' }]
                );
            }

        } catch (error) {
            console.error('Error during request:', error);
            setisLoading(false);

            Alert.alert(
                'Error',
                `Failed to upload the image: ${error.message}`,
                [{ text: 'OK' }]
            );
        }
    };


    useEffect(() => {

        //test()
        fetchBanks();
        const fetchBankAccounts = async () => {
            setLoading(true);
            try {
                const response = await get({ url: `${APP_URLS.AepsBankInfo}` });
                console.log(response, '+*#############')

                if (response) {
                    setBankAcclist(response);
                    console.log(response, '+*#############')
                } else {
                    Alert.alert("Error", "Failed to load bank accounts");
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while fetching bank accounts");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBankAccounts();
        //requestCameraPermission();
    }, []);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const response = await post({ url: `${APP_URLS.aepsBanklist}` });
            console.log(response, '+*+*+');
            if (response.RESULT === '0') {
                setBanklist(response['ADDINFO']['data']);
            } else {
                Alert.alert('Error', 'Failed to load bank list');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching banks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const requestCameraPermission = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message:
                        "key_thisappn_102",
                    buttonPositive: "OK",
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {


            } else {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Permission Required",
                    textBody: "key_pleasegra_85",
                    button: "OK",
                    onPressButton: () => {
                        Dialog.hide();
                        openSettings().catch(() => console.warn("cannot open settings"));
                    },
                });
            }
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const sendotp = async () => {
        Keyboard.dismiss();
        setisLoading(true)
        if (Addresss == '') {
            return;
        }
        try {
            const url = `AEPS/api/data/SendAepsAccountOtp`
            console.log(url, 'rul+++++');
            const res = await post({ url });
            console.log(res, 'res+++++');
            if (res.Status) {
                setIsOtp(true)
                setisLoading(false)
            } else {
                alert(res.Message)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const submitOtp = async (otp) => {
        setisLoading(true)
        try {
            const data = {
                "BankName": bank,
                "AccountNO": acnNumber,
                "IFSC_CODE": ifsccode,
                "AccountHolder": name,
                "Otp": otp,
                "BankAddress": Addresss
            }
            const url = `AEPS/api/data/AddBankAccount`
            console.log(url, 'otpurl')
            const res = await post({ url, data });
            console.log(res, 'otpres');
            // {"Message": "Otp Miss Match!.", "Status": false}


            if (res) {
                if (res && res.Message === "Otp Miss Match!." && res.Status === false) {
                    ToastAndroid.show('OTP Miss Match!', ToastAndroid.LONG);

                } else {
                    setIsOtp(false)
                    setAdd(false)
                    //  Alert.alert(
                    //                     '',
                    //                     `${res.Message} \n Select the option for Upload Cancel Check Photo`,
                    //                     [
                    //                         {
                    //                             text: 'Camera',
                    //                             onPress: async () => {
                    //                                 await launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, (response) => {
                    //                                     ; setbase64Img(response?.assets?.[0]?.base64);
                    //                                      uploadDoCx(response?.assets?.[0]?.base64,res.idno);
                    //                                     //setisLoading(true)
                    //                                 });

                    //                             },
                    //                             style: 'default',
                    //                         },
                    //                         {
                    //                             text: 'Gallery',
                    //                             onPress: async () => {
                    //                                 await launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', includeBase64: true }, (response) => {

                    //                                     setbase64Img(response?.assets?.[0]?.base64);
                    //                                      uploadDoCx(response?.assets?.[0]?.base64,res.idno);
                    //                                 });

                    //                             },
                    //                         },
                    //                         {
                    //                             text: "Cancel",
                    //                             onPress: () => {
                    //                                 console.log("Cancel button clicked");
                    //                             },
                    //                             style: "cancel"
                    //                         }
                    //                     ]
                    //                 );


                    ToastAndroid.show(res.Message, ToastAndroid.LONG);

                }
            }
            setisLoading(false)
        }
        catch {
            console.error();
        }
    }

    return (
        <View style={styles.main}>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <BottomSheet animationType="none" isVisible={add}
                    containerStyle={styles.bottomSheetstyle}
                    onBackdropPress={() => setAdd(false)}
                    
                    modalProps={{
        animationType: 'fade',
        hardwareAccelerated: true,
        onRequestClose: () => setAdd(false),
    }}
                    
                    >

                  <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 50 : 100} // कीबोर्ड से ऊपर का गैप
        keyboardShouldPersistTaps="handled"
        style={{ width: '100%' }}
    >
        <View style={styles.bottomSheetview}>
            <View style={[styles.closeButtonContainer, { backgroundColor: color1 }]}>
                <Text style={styles.checktext}>{translate("Add_For_Aeps_Ac")}</Text>
                <TouchableOpacity onPress={() => setAdd(false)} style={styles.closeButton}>
                    <ClosseModalSvg2 />
                </TouchableOpacity>
            </View>

            {isLoading && <ShowLoader />}

            <View style={{ paddingHorizontal: wScale(10), paddingBottom: 40 }}>
                {/* Bank Selection */}
                <TouchableOpacity onPress={() => setIsBank(true)}>
                    <FlotingInput label={'Select Bank'} value={bank} editable={false} />
                    {bank.length === 0 && (
                        <View style={styles.righticon}>
                            <OnelineDropdownSvg />
                        </View>
                    )}
                </TouchableOpacity>

                <FlotingInput
                    label={'IFSC Code'}
                    value={ifsccode}
                    editable={bank !== ''}
                    onChangeTextCallback={(text) => setIfsccode(text)}
                />

                <FlotingInput
                    label={'Account Holder Name'}
                    value={name}
                    editable={ifsccode !== ''}
                    onChangeTextCallback={(text) => setName(text)}
                />

                <FlotingInput
                    label={'Account Number'}
                    value={acnNumber}
                    editable={name !== ''}
                    keyboardType="numeric"
                    onChangeTextCallback={(text) => setAcnNumber(text)}
                />

                <FlotingInput
                    label={'Address'}
                    value={Addresss}
                    onChangeTextCallback={(text) => setAddresss(text)}
                    editable={acnNumber !== ''}
                />

        <BankBottomSite
                                setBankId={setBankid}
                                isbank={isBank}
                                setisbank={setIsBank}
                                setBankName={setBank}
                                bankdata={banklist} 
                                
                                onPress1={(onPress1)=>{

                                }} setisFacialTan={(setisFacialTan)=>{

                                }}                            />


                <DynamicButton 
                    title={'Submit Detail'} 
                    styleoveride={{ marginTop: 20 }}
                    onPress={() => sendotp()} 
                />
            </View>
        </View>
    </KeyboardAwareScrollView>
                </BottomSheet>

                <View style={[styles.container, { backgroundColor: color1 }]} >
                    <DynamicButton title={'Add For Aeps A/c'}
                        onPress={() => setAdd(!add)}
                        styleoveride={{ marginBottom: hScale(10) }}
                    />
                    <View style={styles.card}>
                        <View style={styles.cardContainer}>
                            <View style={styles.cardView}>
                                <Text style={styles.label}>{translate("Bank_Name")}</Text>
                                <Text style={styles.value}>
                                    {bankAcclist.BankName === '' || !bankAcclist.BankName ? <DotLoader /> : bankAcclist.BankName}
                                </Text>
                            </View>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.label, styles.rightAligned]}>{translate("IFSC_Code")}</Text>
                                <Text style={[styles.value, styles.rightAligned]}>
                                    {bankAcclist.IFSC_CODE === '' || !bankAcclist.IFSC_CODE ? <DotLoader /> : bankAcclist.IFSC_CODE}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.cardView}>
                                <Text style={styles.label}>{translate("Account_Holder_Name")}</Text>
                                <Text style={styles.value}>
                                    {bankAcclist.AccountHolder === '' || !bankAcclist.AccountHolder ? <DotLoader /> : bankAcclist.AccountHolder}
                                </Text>
                            </View>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.label, styles.rightAligned]}>{translate("Account_NO")}</Text>
                                <Text style={[styles.value, styles.rightAligned]}>
                                    {bankAcclist.AccountNO === '' || !bankAcclist.AccountNO ? <DotLoader /> : bankAcclist.AccountNO}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.cardView}>
                                <Text style={styles.label}>{translate("Branch")}</Text>
                                <Text style={styles.value}>
                                    {bankAcclist.BankAddress === '' || !bankAcclist.BankAddress ? <DotLoader /> : bankAcclist.BankAddress}
                                </Text>
                            </View>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.label, styles.rightAligned]}>{translate("Account_Status")}</Text>
                                <View style={[styles.statusContainer, { backgroundColor: color1 }]}>
                                    <View style={[styles.statusCard, { borderColor: colorConfig.primaryColor, borderWidth: 1 }]}>
                                        <View style={styles.content}>
                                            <View style={styles.row}>
                                                <View style={[
                                                    styles.circle,
                                                    {
                                                        backgroundColor: bankAcclist.Status ? 'green' :
                                                            'red'
                                                    }
                                                ]}>
                                                    {bankAcclist.Status ?
                                                        <CheckSvg size={15} />
                                                        :
                                                        <CloseSvg size={15} />
                                                    }
                                                </View>
                                                <View style={styles.buttonContainer}>
                                                    <Text style={[styles.buttonText, { fontSize: 10 }]}>
                                                        {bankAcclist.Status ? 'Verify' : 'UnVerified'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <OTPModal
                    inputCount={4}
                    setMobileOtp={setOtp}
                    setShowOtpModal={setIsOtp}
                    showOtpModal={isotp}
                    verifyOtp={() => {
                        submitOtp(otp)
                    }}
                    disabled={otp.length !== 4}
                />
            </ScrollView>

        </View>
    );
};
const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        marginHorizontal: wScale(10),
        paddingHorizontal: wScale(10),
        paddingTop: hScale(10),
    },
    righticon: {
        position: "absolute",
        left: "auto",
        right: wScale(0),
        top: hScale(0),
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: wScale(12),
    },
    image: {
        width: wScale(200),
        height: hScale(250),
    },
    card: {
        backgroundColor: '#fff',
        padding: wScale(10),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        marginBottom: hScale(10)
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardView: {
    },
    label: {
        fontSize: wScale(15),
        color: '#333',
    },
    value: {
        fontSize: wScale(16),
        fontWeight: 'bold',
        color: '#000',
    },
    cardHeader: {
        marginBottom: hScale(10),
    },
    rightAligned: {
        textAlign: 'right',
    },
    statusContainer: {
        alignItems: 'flex-end',
        width: wScale(90),
        borderRadius: 5,

    },
    statusCard: {
        borderRadius: 5,
        width: '100%',
        padding: wScale(2)
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    buttonContainer: {
        marginLeft: wScale(3),
    },
    button: {
        height: hScale(20),
        width: wScale(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    buttonText: {
        textAlign: 'center',
    },
    circle: {
        width: wScale(25),
        height: wScale(25),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomSheetstyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1
    },
    bottomSheetview: {
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    closeButtonContainer: {
        paddingVertical: hScale(10),
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: wScale(10),
        marginBottom: hScale(10),
    },
    closeButton: {
        width: wScale(30),
        height: hScale(30),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checktext: {
        fontSize: wScale(22),
        color: "#000",
        fontWeight: "bold",
        textTransform: "capitalize",
        textAlign: 'center',
        flex: 1
    }
});

export default AepsAddAccount;
