import { translate } from "../../../utils/languageUtils/I18n";
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, TextInput, ToastAndroid, } from 'react-native';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import AlertSvg from '../../drawer/svgimgcomponents/AlertSvg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import AllBalance from '../../../components/AllBalance';
import ShowLoaderBtn from '../../../components/ShowLoaderBtn';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { useDispatch } from 'react-redux';
import { clearEntryScreen, setCmsAddMFrom, setIsPartial, setRcPrePayAnomut } from '../../../reduxUtils/store/userInfoSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { useFocusEffect } from '@react-navigation/native';
import CmsZeroSvg from '../../drawer/svgimgcomponents/CmsZeroSvg';
import CmsSlipDownload from '../../drawer/svgimgcomponents/CmsSlipDownloadSvg';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import { commonStyles } from '../../../utils/styles/commonStyles';
import PartialPayReport from '../CmsReport/PartialPayReport';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CmsPrePay = ({ route }) => {
    const { colorConfig, Loc_Data, cmsVerify, rctype, radiantList, rceIdStatus, rceId, cmsAddMFrom } = useSelector((state: RootState) => state.userInfo);

    const { item } = route.params
    console.log(item, '099090');
    console.log(radiantList, rceIdStatus, rceId, cmsAddMFrom, '-=radiantList');


    const [rceID, setRceID] = useState('');
    const [shopId, setShopID] = useState('')
    const [amount, setAmount] = useState('');
    const [Ramount, setRAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState('');
    const [amountneed, setAmountneed] = useState('');

    const [adminiStatus, setAdminiStatus] = useState({});
    const [supportData, setSuppportData] = useState([]);
    const navigation = useNavigation();
    // const paymentOptions = ['Full & Final Pickup', 'Partial Pickup'];
    const paymentOptions = [
        { label: 'Full & Final Pickup', value: false },
        { label: 'Partial Pickup', value: true }
    ];

    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
    const [paymentType, setPaymentType] = useState('Full & Final Pickup');
    useEffect(() => {
        dispatch(setIsPartial(false)); // default false
        setPaymentType('Full & Final Pickup'); // default selection
    }, []);

    const { post, get } = useAxiosHook();

    useEffect(() => {
        if (radiantList?.ShopId) {
            setShopID(radiantList.ShopId);
        };
        setRceID(rceId)
        if (!amount || !Ramount) {
            setStatus('');
            return;
        }

        if (Number(amount) > 0 && Number(amount) === Number(Ramount)) {
            setStatus('MATCHED');
        } else {
            setStatus('MISMATCH');
        }
    }, [amount, Ramount, radiantList]);

    const showMismatch = Ramount !== '' && amount !== '' && Number(amount) !== Number(Ramount);


    useEffect(() => {
        const amt = Number(amount);
        const rAmt = Number(Ramount);
  if (paymentType === 'Partial Pickup' && amt === 0) {
        ToastAndroid.show(
            'Zero amount is not allowed for Partial Pickup.',
            ToastAndroid.LONG
        );
        return;
    }
        const isValid =
            amount !== "" &&
            Ramount !== "" &&
            !isNaN(amt) &&
            !isNaN(rAmt) &&
            amt >= 0 &&
            rAmt >= 0 &&
            amt === rAmt;

        if (isValid) {
            fatchData();
        }
        if (amount == "") {
            setRAmount('')
            fatchData();
        }
       
    }, [amount, Ramount, adminiStatus?.allowzero]);



 const fatchData = async () => {
    // 1. Loading start karo (UI block karne ke liye)
    setLoading(true);

    try {
        // 2. URL construct karo (Ensure values are defined)
        const url = `${APP_URLS.CashPickupRemainBalNEW}?Amount=${amount || 0}&RCEID=${rceID || ''}&Shopid=${shopId || ''}`;
        
        console.log("🚀 API Requesting:", url);

        // 3. API call (POST request)
        const response = await post({ url });

        // 4. Console log for debugging
        console.log("✅ API Success Response:", response);

        // 5. Agar response null ya undefined hai toh error throw karo
        if (!response) {
            throw new Error("Empty response from server");
        }

        // 6. Response data states mein set karo
        // Use optional chaining (?.) and default values to prevent crashes
        setAmountneed(response.amountneeded ?? 0);
        setAdminiStatus(response); 

        // 7. Success Navigation Logic
        // Check if all necessary flags are TRUE
        const canNavigate = 
            response?.apiremainstatus === true && 
            response?.sts === true && 
            response?.allowzero === true;

        if (canNavigate) {
            console.log("➡️ Navigation Conditions Met. Moving to Customer Info.");
            navigation.navigate('CmsCoustomerInfo', { 
                item, 
                setAmount, 
                setRAmount 
            });
        } else {
            console.log("⚠️ Response received but conditions for navigation failed.");
        }

        return response;

    } catch (error) {
        // 8. Error Handling (Network error, status 500, etc.)
        console.log("❌ API ERROR:", error);
        
        // User ko batane ke liye Toast ya Alert
        ToastAndroid.show(
            error?.message || "Something went wrong. Please try again.", 
            ToastAndroid.SHORT
        );
    } finally {
        // 9. Loading stop karo (Chahe success ho ya error)
        setLoading(false);
    }
};


    useFocusEffect(
        useCallback(() => {
            if (
                // adminiStatus?.allowzero === true &&
                cmsAddMFrom === 'AddMoneyPayResponse' &&
                amount &&
                Number(amount) === Number(Ramount)
            ) {
                fatchData();
                dispatch(clearEntryScreen(null));
            }
        }, [
            cmsAddMFrom,
            amount,
            Ramount,
        ])
    );



    const handleAddMoney = () => {
        if (!amount) {
            alert("Please enter amount");
            return;
        }
        dispatch(setCmsAddMFrom('CmsPrePay'))
        navigation.navigate("AddMoneyOptions", { amount: amountneed, paymentMode: 'UPI', from: 'PrePay' });

    };
    useEffect(() => {
        const getData = async () => {

            try {

                const response = await get({ url: APP_URLS.Support_Information });
                setSuppportData(response)
                console.log(response)
            } catch (error) {

            }
        };

        getData();
    }, []);
    const openPhoneApp = () => {
        Linking.openURL(`tel:${supportData.adminmobile}`);
        console.log(supportData.adminmobile, '=-=-=-==');

    };

    const dispatch = useDispatch()
    if (rctype === 'PrePay') {
        dispatch(setRcPrePayAnomut(amount))
    } else {
        dispatch(setRcPrePayAnomut(null))

    }


    return (
      <View style={styles.main}>
        <AppBarSecond title={'Pickup Amount'} />
        <AllBalance />
        
        <KeyboardAwareScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            extraScrollHeight={100} 
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <View style={[styles.bgColor, { backgroundColor: `${colorConfig.secondaryColor}33` }]}>
                    <View style={styles.notBg}>
                        <Text style={styles.disc}>{translate("key_pleaseent_182")}</Text>
                        <Text style={styles.disc}>{translate("key_pleaseche_183")}</Text>
                        <Text style={styles.disc}>{translate("key_pleaseche_183")}</Text>
                    </View>

                    {/* Payment Dropdown */}
                    <TouchableOpacity onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}>
                        <TextInput 
                            placeholder={translate('Full & Final Pickup')}
                            value={paymentType}
                            editable={false} 
                            style={styles.input} 
                            placeholderTextColor={'#000'}
                        />
                        <View style={commonStyles.righticon2}>
                            <OnelineDropdownSvg />
                        </View>
                    </TouchableOpacity>

                    {showPaymentDropdown && (
                        <View style={styles.dropdown}>
                            {paymentOptions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.option}
                                    onPress={() => {
                                        setPaymentType(item.label);
                                        setShowPaymentDropdown(false);
                                        dispatch(setIsPartial(item.value));
                                    }}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Amount Inputs */}
                    <TextInput 
                        placeholder={translate("Enter Pickup Amount")}
                        keyboardType="number-pad"
                        value={amount}
                        onChangeText={(t) => setAmount(t)}
                        style={styles.input}
                        placeholderTextColor={'#000'}
                    />

                    <View>
                        <TextInput
                            keyboardType="number-pad"
                            placeholder={translate("Enter Re-Amount")}
                            value={Ramount}
                            editable={!!amount}
                            onChangeText={(t) => {
                                if (Number(t) <= Number(amount)) {
                                    setRAmount(t);
                                }
                            }}
                            style={styles.input}
                            placeholderTextColor={'#000'}
                        />

                        {showMismatch && (
                            <View style={styles.righticon2}>
                                <AlertSvg />
                                <Text style={styles.miss}>{translate('Mismatch')}</Text>
                            </View>
                        )}
                    </View>

                    {/* Conditions Logic */}
                    {adminiStatus?.sts === false && (
                        <View style={styles.amountView}>
                            <Text style={styles.discNeedA}>
                                {translate('Your wallet balance is short by')}
                                <Text style={styles.amountN}> ₹ {amountneed} </Text>
                                {translate('to complete the transaction.')}
                            </Text>
                            <TouchableOpacity onPress={handleAddMoney} style={styles.btnstyle}>
                                <Text style={styles.btntxt}>{translate("Click_on_me_to_add_the_remaining_amount")}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {adminiStatus?.apiremainstatus === false && adminiStatus?.sts === true && (
                        <View style={styles.amountView}>
                            <Text style={styles.discNeedA}>{translate("key_administra_184")}</Text>
                            <TouchableOpacity onPress={openPhoneApp} style={styles.btnstyle}>
                                <Text style={styles.btntxt}>{translate('Click Me to Call Administrator Now')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {adminiStatus?.allowzero === false && (
                        <View style={styles.zeroView}>
                            <View style={[styles.svgimg, { backgroundColor: `${colorConfig.secondaryColor}1A` }]}>
                                <CmsZeroSvg />
                            </View>
                            <View style={styles.zeroTextCon}>
                                <Text style={styles.zeroTitle}>{translate("Zero_amount_is_not_allowed")}</Text>
                                <Text style={styles.zeroText}>{translate("key_according_185")}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View>
                    <PartialPayReport Shopid={shopId} currentAmount={amount} />
                </View>
            </View>
        </KeyboardAwareScrollView>
    </View>
    );
};

export default CmsPrePay;



const styles = StyleSheet.create({

    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        paddingHorizontal: wScale(8),
        paddingTop: hScale(10),
    },

    righticon2: {
        position: "absolute",
        right: wScale(0),
        top: hScale(0),
        height: "85%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: wScale(12),
        width: wScale(44),
        marginRight: wScale(-2),
    },
    miss: {
        color: 'red',
        fontSize: wScale(9),
        width: wScale(60),
        textAlign: 'right',
        marginTop: hScale(-4)
    },
    disc: {
        color: 'red',
        fontSize: wScale(13),
        textAlign: 'justify',
        marginBottom: hScale(10)
    },
    discNeedA: {
        color: '#000',
        fontSize: wScale(15),
        textAlign: 'justify',
    },
    amountN: {
        color: '#000',
        fontSize: wScale(16),
        fontWeight: 'bold',

    },
    btntxt: {
        color: "#fff",
        fontWeight: "bold",
        textTransform: 'uppercase',
        fontSize: wScale(16)
    },
    btnstyle: {
        backgroundColor: '#FF3B30',
        borderRadius: wScale(6),
        alignItems: 'center',
        paddingVertical: 3,
        marginLeft: wScale(5),
        marginBottom: hScale(4),
        marginTop: hScale(5)
    },


    amountView: {
        marginBottom: hScale(10),
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'red',
        marginTop: hScale(20),
    },
    svgimg: {
        borderRadius: 10,
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(5),
        marginVertical: hScale(5),

    },
    zeroView: {
        flexDirection: 'row',
        backgroundColor: 'rgba(253, 181, 181, 0.3)', flex: 1,
        // paddingVertical: hScale(8),
        paddingHorizontal: wScale(5)

    },

    zeroTextCon: {
        paddingLeft: wScale(4),
        flex: 1,
    },
    zeroText: {
        fontSize: wScale(13),
        textAlign: 'justify',
        color: '#000',
        marginTop: hScale(5)

    },
    zeroTitle: {
        fontSize: wScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: hScale(18),
        elevation: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
        marginTop: hScale(-10)
    },
    option: {
        paddingVertical: hScale(12),
        paddingHorizontal: wScale(15),
        borderBottomWidth: 0.5,
        borderColor: '#eee'
    },
    optionText: {
        fontSize: wScale(16),
        color: '#000'
    },
    bgColor: {
        paddingHorizontal: wScale(8),
        paddingTop: hScale(10),
        borderRadius: 5
    },
    notBg: {
        backgroundColor: '#fadc7a',
        paddingHorizontal: wScale(4),
        paddingTop: hScale(5),
        borderRadius: 4,
        marginBottom: hScale(8)
    },
    input: {
        borderWidth: wScale(0.5),
        borderColor: '#000',
        borderRadius: wScale(5),
        paddingLeft: wScale(15),
        height: hScale(48),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        fontSize: hScale(18),
        marginBottom: hScale(15),
        backgroundColor: '#fff'

    },
});
