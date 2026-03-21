import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WalletSvg from "../features/drawer/svgimgcomponents/Walletsvg";
import { hScale, wScale } from "../utils/styles/dimensions";
import { colors } from "../utils/styles/theme";
import { RootState } from "../reduxUtils/store";
import { useSelector } from "react-redux";
import OnelineDropdownSvg from "../features/drawer/svgimgcomponents/simpledropdown";
import { APP_URLS } from "../utils/network/urls";
import { decryptData } from "../utils/encryptionUtils";
import useAxiosHook from "../utils/network/AxiosClient";
import ShowLoaderBtn from './ShowLoaderBtn';
import { useFocusEffect } from '@react-navigation/native';
import { translate } from '../utils/languageUtils/I18n';


const AllBalance = () => {

    const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}33`;

    const [openDropdown, setOpenDropdown] = useState(false);
    const [balanceInfo, setBalanceInfo] = useState<any>(null);

    const { get } = useAxiosHook();

    const toggleDropdown = () => setOpenDropdown(!openDropdown);

    const getData = useCallback(async () => {
        console.log("======================================");
        console.log("📌 getData() CALLED");
        console.log("📡 API CALL → GET USER INFO:", APP_URLS.getUserInfo);
        console.log("======================================");

        try {
            // FIRST API
            const userInfoRes = await get({ url: APP_URLS.getUserInfo });

            console.log("📥 API RESPONSE (getUserInfo) ==> ", userInfoRes);

            const userData = userInfoRes.data;

            // KEYS
            const key = userData.kkkk;
            const iv = userData.vvvv;

            console.log("🔑 KEY:", key);
            console.log("🧊 IV:", iv);

            if (!IsDealer) {
                console.log("➡ USER TYPE: Normal User");
                console.log("📡 API CALL → balanceInfo:", APP_URLS.balanceInfo);

                const response = await get({ url: APP_URLS.balanceInfo });

                console.log("📥 API RESPONSE (balanceInfo) ==> ", response);

                setBalanceInfo(response.data?.[0] ?? {});
            } else {
                console.log("➡ USER TYPE: Dealer");
                console.log("🔐 STARTING DECRYPTION...");

                const decrypted = {
                    adminfarmname: decryptData(key, iv, userData.adminfarmname),
                    posremain: decryptData(key, iv, userData.posremain),
                    remainbal: decryptData(key, iv, userData.remainbal),
                    frmanems: decryptData(key, iv, userData.frmanems),
                };

                console.log("📤 DECRYPTED DATA ==> ", decrypted);

                setBalanceInfo(decrypted);
            }

        } catch (error: any) {
            console.log("❌ ERROR OCCURRED:", error);

            if (error?.message === "Network Error") {
                Alert.alert("Network Error", "Please check your internet connection.");
                return;
            }

            Alert.alert("Error", "Something went wrong. Try again later.");
        }

        console.log("======================================");
        console.log("📌 getData() END");
        console.log("======================================");

    }, [get, IsDealer]);



    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    const totalBalance =
        (Number(balanceInfo?.posremain) || 0) +
        (Number(balanceInfo?.remainbal) || 0);

    return (
        <ImageBackground source={require('../../assets/images/WalletBalBg.jpeg')}
            imageStyle={styles.borderRadius}
        >
            <View style={[styles.headerview, styles.borderRadius, { backgroundColor: color1 }]}>

                <TouchableOpacity style={styles.headertop} onPress={toggleDropdown}>

                    <View style={styles.imgview}>
                        <WalletSvg size={wScale(30)} />
                    </View>


                    <View style={{ flex: 1 }}>

                        <View style={styles.headertop}>
                            <Text style={styles.balanceTitle}>{translate("Wallet Balance")}</Text>

                            <TouchableOpacity
                                style={[
                                    styles.dropbtn,
                                    openDropdown ? { transform: [{ rotate: "180deg" }] } : null
                                ]}
                                onPress={toggleDropdown}
                            >
                                <OnelineDropdownSvg />
                            </TouchableOpacity>

                            {balanceInfo ? <Text style={styles.total}>₹{totalBalance}</Text>
                                :
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <ShowLoaderBtn color={colorConfig.secondaryColor} size={30} />

                                </View>
                            }
                        </View>

                        {openDropdown ? (
                            <View>

                                <View style={styles.balanceCard}>
                                    <Text style={styles.balanceTitle}>{translate("Main Wallet")}</Text>
                                    <Text style={styles.balanceValue}>₹{balanceInfo?.remainbal || 0}</Text>
                                </View>
                                <View style={styles.balanceCard}>
                                    <Text style={styles.balanceTitle}>{translate("POS Balance")}</Text>
                                    <Text style={styles.balanceValue}>₹{balanceInfo?.posremain || 0}</Text>
                                </View>

                            </View>
                        ) : null}

                    </View>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};

export default AllBalance;

const styles = StyleSheet.create({

    headerview: {
        paddingTop: hScale(20),
        paddingHorizontal: wScale(15),
        paddingBottom: hScale(20),
    },

    headertop: {
        flexDirection: "row",
        alignItems: 'center'
    },

    imgview: {
        borderWidth: wScale(1),
        borderRadius: 30,
        marginRight: wScale(15),
        borderColor: colors.black75,
        height: wScale(45),
        width: wScale(45),
        alignItems: "center",
        justifyContent: "center",
    },

    dropbtn: {
        marginLeft: wScale(5),
        paddingHorizontal: 10,


    },

    balanceCard: {
        alignItems: "center",
        marginTop: hScale(5),
        flexDirection: "row",
        justifyContent: "space-between",
    },

    balanceTitle: {
        fontSize: wScale(16),
        color: colors.black,
    },

    balanceValue: {
        fontSize: wScale(20),
        fontWeight: "bold",
        color: colors.black,
    },

    total: {
        fontSize: wScale(22),
        fontWeight: "bold",
        color: colors.black,
        flex: 1,
        textAlign: "right",
    },
    borderRadius: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    }
});
