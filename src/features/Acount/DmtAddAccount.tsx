import { translate } from "../../utils/languageUtils/I18n";
import React, { useEffect, useState, useCallback } from "react"
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Alert, Image, PermissionsAndroid, Platform } from "react-native"
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { hScale, SCREEN_HEIGHT, wScale } from "../../utils/styles/dimensions";
import FlotingInput from "../drawer/securityPages/FlotingInput";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import BankBottomSite from "../../components/BankBottomSite";
import OnelineDropdownSvg from "../drawer/svgimgcomponents/simpledropdown";
import { FlashList } from "@shopify/flash-list";
import { useDeviceInfoHook } from "../../utils/hooks/useDeviceInfoHook";
import { useSelector } from "react-redux";
import { colors, FontSize } from "../../utils/styles/theme";
import NoDatafound from "../drawer/svgimgcomponents/Nodatafound";
import DynamicButton from "../drawer/button/DynamicButton";
import { encrypt } from "../../utils/encryptionUtils";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { openSettings } from "react-native-permissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ShowLoader from "../../components/ShowLoder";
import { DotLoader } from "../../components/DotLoader ";
import { RootState } from "../../reduxUtils/store";
import CheckSvg from "../drawer/svgimgcomponents/CheckSvg";
import CloseSvg from "../drawer/svgimgcomponents/CloseSvg";
import { BottomSheet } from "@rneui/themed";
import ClosseModalSvg2 from "../drawer/svgimgcomponents/ClosseModal2";
import { useLocationHook } from "../../hooks/useLocationHook";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DmtAddAccount = () => {
    const { colorConfig, Loc_Data } = useSelector((state: RootState) => state.userInfo);
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
    const [bankAcclist, setBankAcclist] = useState([]);
    const [Pincod, setPincode] = useState('');
    const [city, setCity] = useState('');
    const [add, setAdd] = useState(false);
    const [idno, setidno] = useState('')
    const [base64Img, setbase64Img] = useState<any>(null);
    const [isLoading, setisLoading] = useState(false);
    const [imgshow, setImgshow] = useState(false);
    const [imgurl, setImgurl] = useState('')
    const { latitude, longitude } = useLocationHook();
    const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
        useDeviceInfoHook();
    const { userId } = useSelector((state: RootState) => state.userInfo);
    console.log(Loc_Data['latitude'], longitude, '@@@@@@@@@@@@@@@')
    const UpdateRetailerBank = useCallback(async (id) => {
        setisLoading(true);
        try {
            const ip = await getMobileIp();
            const Model = await getMobileDeviceId();
            const net = await getNetworkCarrier();

            const data = {
                txtid3: id,
                txtaccholder: name, // Ensure name is defined
                txtbankaccountno: acnNumber, // Ensure acnNumber is defined
                txtifsc: ifsccode, // Ensure ifsccode is defined
                txtbankname: bank, // Ensure bank is defined
                txtbranchaddress: branch, // Ensure branch is defined
                IP: ip,
                Latitude: Loc_Data['latitude'], // Ensure latitude is defined
                Longitude: Loc_Data['longitude'], // Ensure longitude is defined
                ModelNo: Model,
                City: city, // Ensure city is defined
                PostalCode: Pincod, // Ensure Pincod is defined
                InternetTYPE: net,
                Address: Addresss, // Ensure Addresss is defined
            };

            console.log("Request Data Being Sent:", JSON.stringify(data));

            const url = `${APP_URLS.UpdateRetailerBank}`;
            const response = await post({
                url: url,
                data: data,
            });

            console.log("Response Received:", response);

            const sts = response.Response;
            setIdno(id); // Ensure id is defined

            if (sts === 'Success') {
                const newIdno = response.idno.toString();
                setIdno(newIdno);
                Alert.alert(
                    '',
                    `${response.Message} \n Select the option for Upload Cancel Check Photo`,
                    [
                        {
                            text: 'Camera',
                            onPress: async () => {
                                await requestCameraPermission();
                            },
                            style: 'default',
                        },
                        {
                            text: 'Gallery',
                            onPress: async () => {
                                await launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', includeBase64: true }, (response) => {
                                    setBase64Img(response?.assets?.[0]?.base64);
                                    // Optionally call uploadDoCx here if needed
                                });
                            },
                        },
                        {
                            text: "Cancel",
                            onPress: () => {
                                console.log("Cancel button clicked");
                            },
                            style: "cancel"
                        }
                    ]
                );
            } else {
                Alert.alert(`${response.Message}`);
            }
        } catch (error) {
            console.error("Error during UpdateRetailerBank request:", error);
            const errorMessage = error?.response?.data?.message || "An error occurred while updating the retailer's bank details.";
            Alert.alert("Error", `${errorMessage}\n\nDetails: ${error?.message || error?.toString()}`);
        } finally {
            setIsLoading(false);
        }
    }, [name, acnNumber, ifsccode, bank, branch, Loc_Data, latitude, longitude, city, Pincod, Addresss]);


    const test = async () => {
        await launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', includeBase64: true }, (response) => {

            setbase64Img(response?.assets?.[0]?.base64);
            uploadDoCx(response?.assets?.[0]?.base64, '')

        });

    }

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
            const response = await fetch(`https://${APP_URLS.baseWebUrl}/api/user/Uploadcancelledcheque`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ',
                },
                body: body,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response Data:', responseData);

            const { Message: status, data: responseDataContent } = responseData;

            setisLoading(false);

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
            setAdd(false)

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
                const response = await get({ url: `${APP_URLS.SavedAccounts}` });
                console.log(response, '######################')

                if (response.Response === "Success") {
                    setBankAcclist(response.Message);
                    console.log(response)
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
        // requestCameraPermission();
    }, []);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const response = await post({ url: `${APP_URLS.aepsBanklist}` });
            console.log(response, '+*+*+**++*+**++*+*');
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

                await launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, (response) => {
                    ; setbase64Img(response?.assets?.[0]?.base64);
                    // uploadDoCx(response?.assets?.[0]?.base64,response.idno);
                    //setisLoading(true)
                });

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

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContainer}>
                <View style={styles.cardView}>
                    <Text style={styles.label}>{translate("Bank_Name")}</Text>
                    <Text style={styles.value}>
                        {item.Bank_Name === '' || !item.Bank_Name ? <DotLoader /> : item.Bank_Name}
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={[styles.label, styles.rightAligned]}>{translate("IFSC_Code")}</Text>
                    <Text style={[styles.value, styles.rightAligned]}>
                        {item.IFSC_CODE === '' || !item.IFSC_CODE ? <DotLoader /> : item.IFSC_CODE}
                    </Text>
                </View>
            </View>
            <View style={styles.cardContainer}>
                <View style={styles.cardView}>
                    <Text style={styles.label}>{translate("Account_Holder_Name")}</Text>
                    <Text style={styles.value}>
                        {item.AcconutHolderName === '' || !item.AcconutHolderName ? <DotLoader /> : item.AcconutHolderName}
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={[styles.label, styles.rightAligned]}>{translate("Account_NO")}</Text>
                    <Text style={[styles.value, styles.rightAligned]}>
                        {item.BankAccountNo === '' || !item.BankAccountNo ? <DotLoader /> : item.BankAccountNo}
                    </Text>
                </View>
            </View>
            <View style={styles.cardContainer}>
                <View style={styles.cardView}>
                    <Text style={styles.label}>{translate("Branch")}</Text>
                    <Text style={styles.value}>
                        {item.Bank_Address === '' || !item.Bank_Address ? <DotLoader /> : item.Bank_Address}
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={[styles.label, styles.rightAligned]}>{translate("Account_Status")}</Text>
                    <View style={[styles.statusContainer, { backgroundColor: color1 }]}>
                        <View style={[styles.statusCard, { borderColor: colorConfig.primaryColor, borderWidth: 1 }]}>
                            <View style={styles.content}>
                                <Text style={[styles.statuslabel, { fontSize: 8 }]}>{translate("Cancel_Cheque")}</Text>
                                <View style={styles.row}>
                                    <View style={[
                                        styles.circle,
                                        {
                                            backgroundColor: item.Status === "Approved" ? 'green' :
                                                item.Status === "Pending" ? '#B8AD12' : 'red'
                                        }
                                    ]}>
                                        {item.Status === "Approved" ? (
                                            <CheckSvg size={15} />
                                        ) : item.Status === "Pending" ? (
                                            <CloseSvg size={15} />
                                        ) : (
                                            <CloseSvg size={15} />
                                        )}
                                    </View>

                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={[styles.button, { backgroundColor: color1 }]}
                                            onPress={() => {
                                                if (item.CancelCheckFile === null) {
                                                    setImgurl('');
                                                    setImgshow(true)

                                                    return;
                                                }
                                                const url = `https://${APP_URLS.baseWebUrl}${item.CancelCheckFile}`;
                                                const newUrl = url.replace(/^https?:\/\/www\./, 'https://');
                                                console.log(newUrl);
                                                setImgurl(newUrl);
                                                setImgshow(true)
                                            }}
                                        >
                                            <Text style={[styles.buttonText, { fontSize: 10 }]}>{translate("View")}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </View>
    );


    return (
        <View style={styles.main}>

            <ScrollView>

                <BottomSheet animationType="none" isVisible={imgshow}
                    containerStyle={styles.bottomSheetstyle}
                    onBackdropPress={() => setImgshow(false)} >
                    <View style={styles.bottomSheetview}>
                        <View style={[styles.closeButtonContainer, { backgroundColor: color1 }]}>
                            <Text style={styles.checktext}>{translate("view_Cancel_Cheque")}</Text>
                            <TouchableOpacity
                                onPress={() => { setImgshow(false); setImgurl('') }}
                                style={[styles.closeButton, {}]}>
                                <ClosseModalSvg2 />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageContainer}>
                            {imgurl ?
                                <Image
                                    source={{ uri: imgurl }}
                                    style={styles.checkImage}
                                    resizeMode="contain"
                                /> :
                                <NoDatafound />}
                        </View>
                    </View>
                </BottomSheet>

                <BottomSheet animationType="none" isVisible={add}
                    containerStyle={styles.bottomSheetstyle}
                    onBackdropPress={() => setAdd(false)} >

                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                        extraScrollHeight={Platform.OS === 'ios' ? hScale(50) : hScale(100)} // कीबोर्ड से ऊपर का गैप
                        keyboardShouldPersistTaps="handled"
                        style={{ width: '100%', backgroundColor: '#ffff', paddingBottom: hScale(100) }}

                    >

                        <View style={[styles.bottomSheetview,]}>
                            <View style={[styles.closeButtonContainer, { backgroundColor: color1 }]}>
                                <Text style={styles.checktext}>{translate("Wallet_Unload_Ac")}</Text>
                                <TouchableOpacity
                                    onPress={() => { setAdd(false); }}
                                    style={[styles.closeButton, {}]}>
                                    <ClosseModalSvg2 />
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingHorizontal: wScale(10) }}>

                                <TouchableOpacity onPress={() => setIsBank(true)}>
                                    <FlotingInput
                                        label={'Select Bank'}
                                        value={bank}
                                        keyboardType="numeric"
                                        editable={false}
                                        inputstyle={styles.inputstyle} labelinputstyle={undefined} onChangeTextCallback={undefined} />
                                    {bank.length === 0 ?
                                        <View style={styles.righticon}>
                                            <OnelineDropdownSvg />
                                        </View> : null}
                                </TouchableOpacity>
                                <FlotingInput
                                    label={'IFSC Code'}
                                    value={ifsccode}
                                    editable={bank === '' ? false : true}
                                    onChangeTextCallback={(text) => setIfsccode(text)} inputstyle={undefined} labelinputstyle={undefined} />
                                <FlotingInput
                                    label={'Account Holder Name'}
                                    value={name}
                                    editable={ifsccode === '' ? false : true}

                                    onChangeTextCallback={(text) => setName(text)} inputstyle={undefined} labelinputstyle={undefined} />
                                <FlotingInput
                                    label={'Account Number'}
                                    value={acnNumber}
                                    editable={name === '' ? false : true}

                                    keyboardType="numeric"
                                    onChangeTextCallback={(text) => setAcnNumber(text)} inputstyle={undefined} labelinputstyle={undefined} />
                                <FlotingInput
                                    label={'Branch'}
                                    value={branch}
                                    onChangeTextCallback={(text) => setBranch(text)}
                                    editable={acnNumber === '' ? false : true} inputstyle={undefined} labelinputstyle={undefined}
                                />
                                <FlotingInput
                                    label={'City'}
                                    value={city}
                                    onChangeTextCallback={(text) => setCity(text)}
                                    editable={branch === '' ? false : true} inputstyle={undefined} labelinputstyle={undefined}
                                />
                                <FlotingInput
                                    label={'Address'}
                                    value={Addresss}
                                    onChangeTextCallback={(text) => setAddresss(text)}
                                    editable={city === '' ? false : true} inputstyle={undefined} labelinputstyle={undefined}
                                />
                                <FlotingInput
                                    label={'PinCode'}
                                    value={Pincod}
                                    onChangeTextCallback={(text) => setPincode(text)}
                                    keyboardType={'numeric'}
                                    editable={Addresss === '' ? false : true} inputstyle={undefined} labelinputstyle={undefined}
                                />
                                <BankBottomSite
                                    setBankId={setBankid}
                                    isbank={isBank}
                                    setisbank={setIsBank}
                                    setBankName={setBank}
                                    bankdata={banklist}
                                    onPress1={(onPress1) => { }}
                                    setisFacialTan={(setisFacialTan) => {

                                    }} />
                                {base64Img && <Image
                                    source={{ uri: "data:image/png;base64," + base64Img }}
                                    style={styles.image}
                                />}
                                <DynamicButton

                                    title={isLoading ? 'Processing...' : (base64Img ? 'Upload Photo' : 'Submit Detail')} onPress={() => {
                                        if (Pincod) {
                                            if (base64Img) {
                                                uploadDoCx(base64Img, idno);
                                            } else {
                                                UpdateRetailerBank('');
                                            }
                                        }
                                    }} styleoveride={undefined} />
                            </View>
                        </View></KeyboardAwareScrollView>

                </BottomSheet>

                <View style={[styles.container, { backgroundColor: color1 }]}>
                    <DynamicButton title={'Add For Dmt A/c'}
                        onPress={() => setAdd(!add)}
                        styleoveride={{ marginBottom: hScale(10) }}
                    />
                    <FlashList
                        data={bankAcclist}
                        renderItem={renderItem}
                        estimatedItemSize={200}

                        keyExtractor={(item) => item.Idno.toString()}
                        ListEmptyComponent={() => (

                            !loading &&
                            <View>
                                <NoDatafound />
                            </View>
                        )}
                    />
                </View>


                {isLoading && <ShowLoader />}
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
    flashliststyle: {
        marginTop: hScale(10),
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
    statuslabel: {
        textAlign: 'left',
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
    closeButtonText: {
        fontSize: wScale(20),
        color: '#000',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10,
        padding: wScale(10),
    },
    checkImage: {
        width: '100%',
        height: hScale(300),
        borderRadius: 10,
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


export default DmtAddAccount;
