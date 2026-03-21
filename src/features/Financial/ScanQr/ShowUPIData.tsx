import { translate } from "../../../utils/languageUtils/I18n";
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ToastAndroid,
    ScrollView,
    Animated,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import DynamicButton from "../../drawer/button/DynamicButton";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { encrypt } from "../../../utils/encryptionUtils";
import { useDeviceInfoHook } from "../../../utils/hooks/useDeviceInfoHook";
import ShowLoader from "../../../components/ShowLoder";
import { useNavigation } from "../../../utils/navigation/NavigationService";
import LottieView from "lottie-react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import PinInput from "../../../components/PinInput";

const ShowUPIData = ({ route }) => {
    const { userId, Loc_Data } = useSelector((state: RootState) => state.userInfo);
    const [transpin, setTranspin] = useState("");
    const { upi } = route.params;
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { post } = useAxiosHook();
    const { getNetworkCarrier, getMobileDeviceId, getMobileIp } = useDeviceInfoHook();
    const { latitude, longitude } = Loc_Data;
    const navigation = useNavigation();

    /* --- Smooth Card Animation --- */
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 6,
            tension: 50,
        }).start();
    }, []);

    const ONpay = useCallback(async () => {
        setIsLoading(true);

        if (!amount || Number(amount) <= 0) {
            ToastAndroid.show("Enter valid amount", ToastAndroid.SHORT);
            setIsLoading(false);
            return;
        }

        if (Number(amount) < 100) {
            ToastAndroid.show("Amount must be at least ₹100", ToastAndroid.SHORT);
            setIsLoading(false);
            return;
        }

        if (!transpin || !(transpin.length === 4 || transpin.length === 6)) {
            ToastAndroid.show("PIN must be 4 or 6 digits", ToastAndroid.LONG);
            setIsLoading(false);
            return;
        }

        try {
            const mobileNetwork = await getNetworkCarrier();
            const ip = await getMobileIp();
            const Model = await getMobileDeviceId();

            const encryption = await encrypt([
                userId,
                upi.pn,
                "",
                "",
                "",
                transpin,
                upi.pa,
                "UPI",
                "",
                "",
                "",
                "devicetoken",
                latitude,
                longitude,
                Model,
                "",
                "",
                "",
                mobileNetwork,
                "UPI-" + Date.now(),
            ]);

            const data = {
                umm: encryption.encryptedData[0],
                name: encryption.encryptedData[1],
                snn: encryption.encryptedData[2],
                fggg: encryption.encryptedData[3],
                eee: encryption.encryptedData[4],
                ttt: amount,
                nnn: encryption.encryptedData[5],
                nttt: encryption.encryptedData[6],
                peee: encryption.encryptedData[7],
                nbb: encryption.encryptedData[8],
                bnm: encryption.encryptedData[9],
                kyc: "true",
                ip: encryption.encryptedData[10],
                mac: "",
                ottp: "",
                Devicetoken: encryption.encryptedData[11],
                Latitude: encryption.encryptedData[12],
                Longitude: encryption.encryptedData[13],
                ModelNo: encryption.encryptedData[14],
                Address: encryption.encryptedData[15],
                City: encryption.encryptedData[16],
                PostalCode: encryption.encryptedData[17],
                InternetTYPE: encryption.encryptedData[18],
                value1: encryption.keyEncode,
                value2: encryption.ivEncode,
                uniqueid: encryption.encryptedData[19],
            };

            const response = await post({
                url: APP_URLS.dmtapi,
                data: data,
            });

            const txn = response?.data?.[0] || {};

            if (txn?.bankrefid === "Wrong Pin!!! Please Enter Correct Pin!!!") {
                ToastAndroid.show("Wrong PIN!!! Please Enter Correct PIN!!!", ToastAndroid.LONG);
                setIsLoading(false);
                return;
            }

            setAmount("");
            setTranspin("");
            navigation.navigate("UpiPayResult", { upi, txn, amount });

        } catch (error) {
            console.log("ERROR:", error);
            Alert.alert("Error", "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, [amount, transpin, upi, latitude, longitude]);
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.main}>
                    <AppBarSecond title={"Review & Pay"} onPressBack={() => navigation.goBack()} />

                    {/* Floating Smooth Card */}
                    <Animated.View
                        style={[
                            styles.cardContainer,
                            {
                                opacity: cardAnim,
                                transform: [
                                    {
                                        translateY: cardAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [40, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.avatarBox}>
                            <LottieView
                                autoPlay
                                loop
                                style={styles.lottieAvatar}
                                source={require("../../../utils/lottieIcons/profile2.json")}
                            />
                        </View>

                        <Text style={[styles.title, { color: colorConfig.secondaryColor }]}>{translate("Secure_UPI_Transfer")}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{translate("Name")}</Text>
                            <Text style={styles.infoValue}>{upi.pn}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{translate("UPI_ID")}</Text>
                            <Text style={styles.infoValue}>{upi.pa}</Text>
                        </View>

                        <FlotingInput
                            style={styles.input}
                            label="Enter Amount"
                            keyboardType="number-pad"
                            value={amount}
                            onChangeTextCallback={setAmount}
                        />

                        <PinInput value={transpin} onChangeText={setTranspin} />
                        <View style={{ paddingVertical: hScale(5) }} />
                        <DynamicButton
                            title="Pay Securely"
                            onPress={ONpay}
                            buttonStyle={styles.payButton}
                            textStyle={styles.payButtonText}
                        />

                        {isLoading && <ShowLoader />}
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#EAF1FF",
        paddingBottom: hScale(30),
    },

    cardContainer: {
        marginTop: hScale(25),
        marginHorizontal: wScale(15),
        backgroundColor: "#FFFFFF",
        padding: hScale(20),
        borderRadius: wScale(20),
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },

    avatarBox: {
        alignSelf: "center",
        backgroundColor: "#DDE8FF",
        borderRadius: hScale(60),
        alignItems: 'center',
        height: wScale(110),
        width: wScale(110),
    },

    lottieAvatar: {
        width: '100%',
        borderRadius: hScale(60),
        height: '100%'
    },

    title: {
        fontSize: hScale(22),
        fontWeight: "700",
        textAlign: "center",
        marginTop: hScale(10),
        color: "#0A57D0",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: hScale(12),
        borderBottomWidth: 1,
        borderBottomColor: "#E4E4E4",
    },

    infoLabel: {
        fontSize: hScale(16),
        color: "#666",
    },

    infoValue: {
        fontSize: hScale(16),
        color: "#111",
        fontWeight: "600",
    },

    input: {
    },

    payButton: {
        marginTop: hScale(30),
        backgroundColor: "#0A57D0",
        borderRadius: 14,
        paddingVertical: hScale(14),
    },

    payButtonText: {
        fontSize: hScale(18),
        fontWeight: "700",
        color: "#FFF",
    },
});

export default ShowUPIData;
