import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Linking,
  ToastAndroid,
  Image,
  AppState,
} from "react-native";
import { hScale, wScale } from "../../utils/styles/dimensions";
import { useNavigation } from "../../utils/navigation/NavigationService";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { useDeviceInfoHook } from "../../utils/hooks/useDeviceInfoHook";
import { RootState } from "../../reduxUtils/store";
import { useSelector } from "react-redux";
import { encrypt } from "../../utils/encryptionUtils";
import DynamicButton from "../drawer/button/DynamicButton";
import { colors, FontSize } from "../../utils/styles/theme";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import NetBanksvg from "../drawer/svgimgcomponents/NetBanksvg";
import DebitCardsvg from "../drawer/svgimgcomponents/DebitCardsvg";
import Distributorsvg from "../drawer/svgimgcomponents/Distributorsvg";
import Adminsvg from "../drawer/svgimgcomponents/Adminsvg";
import WalletSvg from "../drawer/svgimgcomponents/Walletsvg";
import Upisvg from "../drawer/svgimgcomponents/Upisvg";
import Upipaymentoptionssvg from "../drawer/svgimgcomponents/Upipaymentoptionssvg";
import Internationalcardsvg from "../drawer/svgimgcomponents/Internationalcardsvg";
import QrcodSvg from "../drawer/svgimgcomponents/QrcodSvg";
import QrcodAddmoneysvg from "../drawer/svgimgcomponents/QrcodAddmoneysvg";
import CreditCardsvg from "../drawer/svgimgcomponents/CreditCardsvg";
import uuid from "react-native-uuid";
import CheckSvg from "../drawer/svgimgcomponents/CheckSvg";
import { useLocationHook } from "../../hooks/useLocationHook";
import ShowLoader from "../../components/ShowLoder";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AllBalance from "../../components/AllBalance";
import ShowLoaderBtn from "../../components/ShowLoaderBtn";
import { NativeModules } from "react-native";
import { translate } from "../../utils/languageUtils/I18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { UpiNative } = NativeModules;
const AddMoneyOptions = ({ route }) => {
  const { colorConfig, IsDealer, Loc_Data } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const color1 = `${colorConfig.secondaryColor}20`;
  const { amount, jsonData, paymentMode, chargeType, from } = route.params;
  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const { userId } = useSelector((state: RootState) => state.userInfo);
  const { get, post } = useAxiosHook();
  const navigation = useNavigation<any>();
  const [upich, setupichs] = useState("");
  const [charges, setCharges] = useState([]);
  const [chgs, setChgs] = useState("");
  const [Merchantkey, setMerchantkey] = useState("");
  const [Merchantid, setMerchantid] = useState("");
  const [marsalt, setMarsalt] = useState("");
  const [USERID, setUSERID] = useState("");
  const [Privatekey, setPrivatekey] = useState("");
  const [txnsuccessUrl, setTxnsuccessUrl] = useState("");
  const [txnfailureUrl, setTxnfailureUrl] = useState("");
  const [merchemail, setMerchemail] = useState("");
  const [merchmobile, setMerchmobile] = useState("");
  const [mrchname, setMrchname] = useState("");
  const [buttontxt, setButtontxt] = useState(translate("Upi"));

  const [phonepeMin, setPhonepeMin] = useState("");
  const [phonepeMax, setPhonepeMax] = useState("");
  const [checkFun, setCheckFun] = useState(translate("UPI"));
  const [intentLoad, setIntentLoad] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [upiid, setUpiid] = useState("");
  const [minamnt, setMinamnt] = useState("");
  const [maxamnt, setMaxamnt] = useState("");
  const [perdaylimit, setPerdaylimit] = useState("");
  const [uselimit, setUselimit] = useState("");
  const [limitmessage, setLimitmessage] = useState("");
  const [dealerUpiStatus, setDealerUpiStatus] = useState("");
  const [dealerUpiid, setDealerUpiid] = useState("");
  const [dealerCapping, setDealerCapping] = useState("");
  const [selectedOption, setSelectedOption] = useState(translate("UPI"));
  const [charge, setCharge] = useState(null);
  const [totalCharge, setTotalCharge] = useState(null);

  const { latitude, longitude } = Loc_Data;
  useEffect(() => {
    upiCharges();
    getCharges();
    console.warn(latitude, longitude, "@@@@@@@@@");
  }, []);
  const getCharges = useCallback(async () => {
    console.log("Clicked:", amount);

    try {
      const userInfo = await get({ url: `${APP_URLS.addmoneyChg}${amount}` });

      setCharges(userInfo);
      // setCharges(Object.entries(userInfo.WalletChargesenc));
      console.log(userInfo);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching charges:", error);
    }
  }, []);
  const handleOptionClick = (optionName) => {
    console.log("optionName", optionName);
    setSelectedOption(optionName);
    if (optionName == "QR Code") {
      setButtontxt("QR Code");
      setCheckFun("QR Code");
    } else if (optionName == "Creditcard") {
      setButtontxt("Credit card");
      setCheckFun("Creditcard");
      const creditCardValues = getPaymentMethodValues("Creditcard", charges);
      console.log(creditCardValues);
      setChgs(creditCardValues);
    } else if (optionName == "Wallet") {
      setButtontxt("Wallet");

      const creditCardValues = getPaymentMethodValues("Wallet", charges);
      console.log(creditCardValues);
      setChgs(creditCardValues);
      setCheckFun("Wallet");
    } else if (optionName == "debitCardcharges") {
      setButtontxt("Debit Card");

      const creditCardValues = getPaymentMethodValues(
        "debitCardcharges",
        charges,
      );
      console.log(creditCardValues);
      setChgs(creditCardValues);
      setCheckFun("debitCardcharges");
    } else if (optionName == "Netbanking") {
      setButtontxt("Net Banking");

      const creditCardValues = getPaymentMethodValues("Netbanking", charges);
      console.log(creditCardValues);
      setChgs(creditCardValues);
      setCheckFun("Netbanking");
    } else if (optionName == "UPI") {
      setButtontxt("UPI");
      setCheckFun("UPI");
    } else if (optionName == "Self UPI") {
      setButtontxt("Self UPI");

      setCheckFun("Self UPI");
    } else if (optionName == "Request to Admin") {
      setButtontxt("Request to Admin");

      setCheckFun("Request to Admin");
    } else {
      setButtontxt("Request to Distributor");

      setCheckFun("Request to Distributor");
    }
  };

  const handleOptionClick2 = (optionName) => {
    console.log("optionName", optionName);
    if (optionName === "QR Code") {
      upiqr();
    } else if (optionName === "Creditcard") {
      gatewaytype("CC");
    } else if (optionName === "Wallet") {
      gatewaytype("WA");
    } else if (optionName === "debitCardcharges") {
      gatewaytype("DC");
    } else if (optionName === "Netbanking") {
      gatewaytype("NB");
    } else if (optionName === "UPI") {
      setButtontxt("UPI");
      upists();
      gatewaytype("UP");
    } else if (optionName === "Self UPI") {
      upists2();
      console.log("Self UPI:", optionName);
    } else if (optionName === "Request to Admin") {
      setButtontxt(IsDealer ? "Request to Admin" : "Request to Admin");

      navigation.navigate("ReqToAdmin", { amount, type: "Admin" });
    }
    if (
      optionName === "Request to Distributor" ||
      optionName === "Request to Master"
    ) {
      setButtontxt(IsDealer ? "Request to Master" : "Request to Distributor");

      navigation.navigate("ReqToAdmin", { amount, type: "Distributor" });
    }
  };
  const upiCharges = useCallback(async () => {
    try {
      const userInfo = await get({ url: `${APP_URLS.upicharges}` });
      setupichs(userInfo);
      console.log("upicharges", userInfo);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching charges:", error);
    }
  }, [get]);
  const phonepestatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await get({ url: `${APP_URLS.phonepestatus}` });
      const resp = data["Status"];
      const msz = data["Message"];
      const phonepeMinValue = data["minmium"].toString();
      const phonepeMaxValue = data["maximium"].toString();

      setPhonepeMin(phonepeMinValue);
      setPhonepeMax(phonepeMaxValue);

      const phonepeam = parseFloat(amount);
      const phonepeMin1 = parseFloat(phonepeMinValue);
      const phonepemaxx1 = parseFloat(phonepeMaxValue);

      if (phonepeam >= phonepeMin1 && phonepeam <= phonepemaxx1) {
        if (resp === "Success") {
          phonepe();
        } else {
          showAlert(msz);
        }
      } else {
        showAmountRangeSnackBar(phonepeMin1, phonepemaxx1);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  console.log(from);
  const phonepe = useCallback(async () => {
    setIsLoading(false);

    try {
      const data = await post({
        url: `${APP_URLS.phonepeurl}Amount=${amount}`,
      });
      const Status = data["Status"];
      const url = data["RESULT"];
      const supported = await Linking.canOpenURL(url);

      if (Status) {
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: ", url);
        }
      } else {
        showAlert(url);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);
  const upiqr = useCallback(async () => {
    console.log(from, "=-=-=-=-=-*/*/*/*/");

    if (from === "" || from === null || from === undefined || from !== "abc") {
      const response = {
        QR: "",
        msg: "OKss",
        name: "VASTBAZAAR",
        qrstatus: "OK",
        status: true,
      };

      navigation.navigate("UpiQrCodes", { response, amnt: amount });
      return;
    }

    setIsLoading(true);

    try {
      const data = await get({ url: `${APP_URLS.upitxChk}` });
      console.log("upiqr", data, "@@@@@@@@@@@@@@@@@@@@@@@@");

      const statuss = data["ShowQR"];
      const msz = data["msg"];

      if (
        statuss === "PRICEBASE" ||
        statuss === "VAR_QR" ||
        statuss === "UPIQR"
      ) {
        const min = msz?.minmium || upich.Minqr;
        const max = msz?.maximium || upich.Maxqr;

        const amountNum = parseFloat(amount);
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);

        if (amountNum >= minNum && amountNum <= maxNum) {
          Qrcodestatus(amount);
        } else {
          Alert.alert(
            translate("Invalid Amount"),
            translate(`key_forupiam_43`),
            [{ text: translate("OK") }],
          );
        }
      } else {
        Qrcodestatus(amount);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching charges:", error);
    }
  }, [from, amount, navigation, upich, Qrcodestatus]);

  const Qrcodestatus = useCallback(async (amnt) => {
    setIsLoading(true);

    try {
      const response = await post({ url: `${APP_URLS.UPIQR}?amount=${amnt}` });
      console.log(
        "=============================================================================",
      );
      console.log(response);
      //Linking.openURL("upi://pay?tr=202101345671229366&tid=121313202101345671229366&pa=juspay@axisbank&mc=1234&pn= Merchant%20Inc&am=1.00&cu=INR&tn=Pay%20for%20merchant");

      if (response.name === "ICICI") {
        const status = response["qrstatus"];
        const msz = response["msg"];
        const qrtsresponse = response["qrstatus"];
        const generatedidresponse = response["GeneratedUniqueid"];
        const qrcode1response = response["QR"];

        if (response.status === true) {
          navigation.navigate("QRCodePage", {
            qrcode1response,
            generatedidresponse,
            amnt,
          });
        } else {
          showAlert(msz);
        }
      } else if (response && response.status && response.qrstatus === "OK") {
        console.log(response, amnt);

        navigation.navigate("UpiQrCodes", { response, amnt });
        console.log("QR is valid, proceed with payment.");
      } else {
        ToastAndroid.showWithGravity(
          response?.msg || "QR status is not OK, try again.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        console.log("QR status is not OK, try again.");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching QR status:", error);
    }
  }, []);
  /*  try {

         const data = await get({ url: `${APP_URLS.genQr}amountqr=${amnt}` });

         const status = data["Status"];
         const msz = data["Message"];
         const qrtsData = data["Success"];
         const generatedidData = data["GeneratedUniqueid"];
         const qrcode1Data = data["QRCODE"];
         navigation.navigate("QRCodePage", { qrcode1Data, generatedidData, qrtsData, amnt, msz });

         setQrts(qrtsData);
         setGeneratedid(generatedidData);
         setQrcode1(qrcode1Data);

         if (status === "Success" || msz === "Create") {
          // navigation.navigate("QRCodePage",{qrcode1Data,generatedidData,qrtsData,amnt});




         } else {
             showAlert(msz);
         }

     } catch (error) {

     } */

  const showAlert = (message) => {
    Alert.alert(
      translate("Error"),
      message,
      [{ text: translate("OK"), onPress: () => console.log("OK Pressed") }],
      { cancelable: false },
    );
  };
  const showAmountRangeSnackBar = (min, max) => {
    Alert.alert(
      translate("Invalid Amount"),
      translate(`For UPI Amount Should be between ₹${min} To ₹${max}`),
      [{ text: translate("OK"), onPress: () => console.log("OK Pressed") }],
      { cancelable: false },
    );
  };
  const upists = useCallback(async () => {
    const Model = await getMobileDeviceId();
    setIsLoading(true);

    try {
      const response = await get({ url: `${APP_URLS.upistatus}` });

      const ActiveApi = response["ActiveApi"];
      if (ActiveApi === ActiveApi) {
        const payuamount = parseFloat(route.params["amount"]);
        const paymin = parseFloat(response["Minqr"]);
        const paymaxx = parseFloat(response["Maxqr"]);
        if (payuamount >= paymin && payuamount <= paymaxx) {
          console.log("is ok");
          gatewaytype("UPI");
        } else {
          Alert.alert(
            translate("Warning"),
            translate(
              `For UPI Amount should be between ₹ ${paymin} To ₹ ${paymaxx}`,
            ),
            [
              {
                text: translate("OK"),
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false },
          );
        }
      } else if (ActiveApi === "PHONEPE") {
        phonepestatus();
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);
  const upists2 = useCallback(async () => {
    const Model = await getMobileDeviceId();
    setIsLoading(true);

    try {
      const response = await get({ url: `${APP_URLS.upistatus}` });
      console.log(response);
      const ActiveApi = response["ActiveApi"];
      const y = response["Status"];
      if (y === "Y") {
        upiuserDet();
        const payuamount = parseFloat(route.params["amount"]);
        const paymin = parseFloat(response["Minqr"]);
        const paymaxx = parseFloat(response["Maxqr"]);
        if (payuamount >= paymin && payuamount <= paymaxx) {
          console.log("is ok");
        } else {
          Alert.alert(
            translate("Warning"),
            translate(
              `For UPI Amount should be between ₹ ${paymin} To ₹ ${paymaxx}`,
            ),
            [
              {
                text: translate("OK"),
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false },
          );
        }
      } else {
        Alert.alert(
          translate("Warning"),
          translate(`${y}`),
          [{ text: translate("OK"), onPress: () => console.log("OK Pressed") }],
          { cancelable: false },
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  const upiuserDet = async () => {
    try {
      const data = await get({ url: `${APP_URLS.upiUserDetails}` });

      const status = data["Status"].toString();
      const msz = data["Message"];

      setIsLoading(false);

      if (status === "true") {
        const upiId = data["VPAID"].toString();
        const minAmount = data["Minamount"].toString();
        const maxAmount = data["Maxamount"].toString();
        const perDayLimit = data["PerdayLimit"].toString();
        const useLimit = data["UpiUseLimit"].toString();
        const limitMessage = data["PerdayLimitmsg"].toString();
        const dealerUpiStatus = data["Dealer status"].toString();
        const dealerUpiid = data["Dealer_VPAID"].toString();
        const dealerCapping = data["Dealer_caption"].toString();

        setUpiid(upiId);
        setMinamnt(minAmount);
        setMaxamnt(maxAmount);
        setPerdaylimit(perDayLimit);
        setUselimit(useLimit);
        setLimitmessage(limitMessage);
        setDealerUpiStatus(dealerUpiStatus);
        setDealerUpiid(dealerUpiid);
        setDealerCapping(dealerCapping);

        const perday = parseFloat(perDayLimit);
        const useday = parseFloat(useLimit);
        const amountt = parseFloat(amount);
        const min = parseFloat(minAmount);
        const maxx = parseFloat(maxAmount);
        const cappAmount = parseFloat(dealerCapping);

        if (dealerUpiStatus === "true") {
          const dealerBal = parseFloat(data["Dealer Balance"].toString());
          const payAmmot = dealerBal - amountt;

          if (amountt <= dealerBal) {
            if (payAmmot > cappAmount) {
              if (amountt >= min && amountt <= maxx) {
                // Navigate to UpipageDealerUpiId
                console.log("Navigate to UpipageDealerUpiId");
              } else {
                Alert.alert(
                  translate("Invalid Amount"),
                  translate(
                    `For UPI Amount Should be between ₹${min} to ₹${maxx}`,
                  ),
                  [
                    {
                      text: translate("OK"),
                      onPress: () => console.log("OK Pressed"),
                    },
                  ],
                  { cancelable: false },
                );
              }
            } else {
              Alert.alert(
                translate("Error"),
                translate("key_dealercap_26"),
                [
                  {
                    text: translate("OK"),
                    onPress: () => console.log("OK Pressed"),
                  },
                ],
                { cancelable: false },
              );
            }
          } else {
            Alert.alert(
              translate("Error"),
              translate("Dealer Amount Is Low Please Contact To Dealer"),
              [
                {
                  text: translate("OK"),
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false },
            );
          }
        } else {
          if (useday <= perday) {
            if (amountt >= min && amountt <= maxx) {
              console.log("Navigate to Upimainpage");
            } else {
              Alert.alert(
                translate("Invalid Amount"),
                translate(
                  `For UPI Amount Should be between ₹${min} to ₹${maxx}`,
                ),
                [
                  {
                    text: translate("OK"),
                    onPress: () => console.log("OK Pressed"),
                  },
                ],
                { cancelable: false },
              );
            }
          } else {
            Alert.alert(
              translate("Error"),
              translate(limitMessage),
              [
                {
                  text: translate("OK"),
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false },
            );
          }
        }
      } else {
        Alert.alert(
          translate("Error"),
          translate(`${msz} !!`),
          [{ text: translate("OK"), onPress: () => console.log("OK Pressed") }],
          { cancelable: false },
        );
      }
      console.log(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const [payUParams, setPayUParams] = useState({});
  const gatewaytype = useCallback(
    async (type) => {
      console.log("type", type);
      setIsLoading(true);

      try {
        const data = await post({ url: `${APP_URLS.Chkpayu}type=${type}` });
        setPayUParams(data);
        console.log(data);

        var resp = data["Response"];
        var msz = data["Message"];
        if (resp == "Success") {
          setMerchantkey(data["Merchantkey"]);
          setMerchantid(data["Merchantid"]);
          setMarsalt(data["MerchantSalt"]);
          setUSERID(data["USERID"]);
          setPrivatekey(data["Privatekey"]);
          setTxnsuccessUrl(data["txnsuccessUrl"]);
          setTxnfailureUrl(data["txnfailureUrl"]);
          setMerchemail(data["email"]);
          setMerchmobile(data["mobile"]);
          setMrchname(data["name"]);

          if (type == "CC") {
            Apitransitionsencrypt("CC", data);
          } else if (type == "DC") {
            Apitransitionsencrypt("DC", data);
          } else if (type == "WA") {
            Apitransitionsencrypt("WA", data);
          } else if (type == "NB") {
            Apitransitionsencrypt("NB", data);
          } else if (type == "UPI") {
            Apitransitionsencrypt("UP", data);
          }
        } else {
          Alert.alert(
            translate("Warning"),
            translate(` ${msz} +!!!`),
            [
              {
                text: translate("OK"),
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false },
          );
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
    [post],
  );

  const Apitransitionsencrypt = useCallback(
    async (type, data1) => {
      try {
        const id = uuid.v4().toString().substring(0, 16);
        setIsLoading(true);

        // Fetch Network and Device Data
        const mobileNetwork = await getNetworkCarrier();
        const ip = await getMobileIp();
        const model = await getMobileDeviceId();

        // Perform Encryption
        const encryption = await encrypt([
          type, // Payment Type
          model, // Device Model
          latitude || 0, // Latitude
          longitude || 0, // Longitude
          model, // Device Model (again)
          "city", // City (example, should be dynamic if needed)
          "postcode", // Postal Code (example, should be dynamic if needed)
          mobileNetwork, // Mobile Network Carrier
          ip, // IP Address
          "Address", //
        ]);

        const [
          typee,
          Modell,
          lat,
          long,
          Model2,
          city,
          postcode,
          mobileNetwork2,
          ip2,
          address,
        ] = encryption.encryptedData;

        const key = encryption.keyEncode;
        const vv = encryption.ivEncode;

        const url = `${APP_URLS.sendgatewayReq}txtamt=${encodeURIComponent(amount)}&txnid=${encodeURIComponent(id)}&ddltypes=${encodeURIComponent(typee)}&Devicetoken=${encodeURIComponent(ip2)}&Latitude=${encodeURIComponent(lat)}&Longitude=${encodeURIComponent(long)}&ModelNo=${encodeURIComponent(Model2)}&City=${encodeURIComponent(city)}&PostalCode=${encodeURIComponent(postcode)}&InternetTYPE=${encodeURIComponent(mobileNetwork2)}&IP=${encodeURIComponent(ip2)}&Addresss=${encodeURIComponent(address)}&value1=${encodeURIComponent(key)}&value2=${encodeURIComponent(vv)}`;

        console.log("Request URL:", url);

        // API Call to Fetch Data
        const data = await post({ url });

        console.log("API Response:", data);

        const resp = data["Status"];

        const payUParam = await Object.assign({}, data, data1, { amount });
        savePayUParam(payUParam);
        if (resp === translate("Success")) {
          console.log("Navigating with payUParam:", payUParam);
          navigation.navigate("SeamlessScreen", { payUParam });
        } else {
          const errorMsg = data["message"] || data["txnid"];
          Alert.alert(
            translate("Payment Failed"),
            translate(`Transaction failed. Reason: ${errorMsg}`),
            [
              {
                text: translate("OK"),
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false },
          );
        }
        setIsLoading(false);
      } catch (error) {
        // Global error handling
        console.error("Error in Apitransitionsencrypt:", error.message);
        Alert.alert(
          translate("Error"),
          translate(`Something went wrong: ${error.message}`),
          [{ text: translate("OK"), onPress: () => console.log("OK Pressed") }],
          { cancelable: false },
        );
      }
      setIsLoading(false);
    },
    [amount, payUParams, navigation, latitude, longitude],
  );
  const savePayUParam = async (payUParam) => {
    console.error("Error saving payUParam", payUParam);

    try {
      await AsyncStorage.setItem("payUParam", JSON.stringify(payUParam));
    } catch (e) {
      console.error("Error saving payUParam", e);
    }
  };
  const gatwaypay = async (type) => {
    try {
      const result = await NativeModules.paygatway({
        type: type,
        pyamount: amount,
        pysurl: txnsuccessUrl,
        pyfurl: txnfailureUrl,
        pykey: Merchantkey,
        pysalt: marsalt,
        pyname: mrchname,
        pyemail: merchemail,
        pymobile: merchmobile,
        txnid: userId,
      });
      console.log(result);

      if (result != null) {
        sendpgresponse(result);
      }
    } catch (error) {
      console.error("Can't do native stuff", error);
    }
  };
  const sendpgresponse = async (sendresp) => {
    try {
      const url =
        "https://native.vastwebindia.com/PaymentGateway/api/data/Gatewayresponse";
      const body = JSON.stringify({ Response: sendresp });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer DzgtGegwhg-T0A4KXwyBBkY09RohXL6_BlDrJXoZ0skrp8bDr36t57JwlmTHDI8GOMslQleie5UFCPT2S_QF3Zp6_eIdtymPpAV2cQryZMq_BQ91JP3NkhrPYvYCjkukBZ_RhG61060TuK8sCJs_eJ_dzP_LIVNHVwK01My4Wfiao7d0OJxDDOzx1KFvzug2ePLxJ83dSEmESJp1tDoNcziHmK5JuOhxhlrbtLTQd6uYP0p97MNVokp3C_dkI1peuXRwY_VyOnttjkXkHp7m2Wt4PAhfkSHERyujf4M6I3Ta7xcYqr-zl34qQlBbz4XDsSrbeJxEarsCMJizgp-Fys0u3ycYFK8lpvzZa61yR5rA77yozE1-GJoHeehY7kgmAmGQ8WMSsMbZM8-OqUVq_io5Ym5IeBe62stRLlDjNcpa07YqjbU6l8-CsjKO4azoS4Sbu9r7ANFjJFkARAiO068L12CNOKrfmuSRp7lyuWhZyv6gVHrUDqGh2F8LZPufLtwTCQe9NiMV9KafQ6uqa0Fmv00iDioGo57mpN0lQaw`,
        },
        body: body,
      });

      console.log(response.status);

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const Model = getMobileDeviceId();
    console.log(Model);
  }, []);
  const getPaymentMethodValues = (method, charges) => {
    setIsLoading(true);

    const paymentMethod = charges["WalletChargesenc"][method];
    if (paymentMethod) {
      const { cardcharge, netrecived, total } = paymentMethod;
      setIsLoading(false);

      return translate(
        `Charge: ${cardcharge}\nNet translate('Received'): ${netrecived}\nTotal: ${total}`,
      );
    } else {
      setIsLoading(false);

      return translate("Payment method not found!");
    }
  };
  const appState = useRef(AppState.currentState);
  const [paymentStarted, setPaymentStarted] = useState(false);

  const [intentparams, setIntentParams] = useState([]);

  const extractParams = (url) => {
    try {
      // 1) Agar "upi://pay" missing ho ya URL खराब ho
      if (!url.startsWith("http") && !url.startsWith("upi")) {
        url = "upi://pay/?" + url.replace(/^.*?\?/, "");
      }

      // 2) URL को safe तरीके से parse करो
      const safeUrl = new URL(url);

      // 3) Params को object में convert करो
      const params = {};
      for (let [key, value] of safeUrl.searchParams.entries()) {
        params[key] = decodeURIComponent(value);
      }

      return params;
    } catch (err) {
      // Worst-case fallback → manually split
      const fallbackParams = {};
      try {
        const query = url.split("?")[1];
        const pairs = query.split("&");

        pairs.forEach((pair) => {
          const [key, value] = pair.split("=");
          fallbackParams[key] = decodeURIComponent(value || "");
        });

        return fallbackParams;
      } catch (e) {
        return {};
      }
    }
  };
  const parseUpiResponse = (responseString) => {
    if (!responseString || typeof responseString !== "string") return {};

    return responseString.split("&").reduce((acc, pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return acc;

      const key = pair.substring(0, idx);
      const value = pair.substring(idx + 1);

      acc[key] = value ? decodeURIComponent(value) : "";
      return acc;
    }, {});
  };

  const startPayment = async (upiUrl) => {
    if (!upiUrl) {
      Alert.alert(translate("UPI URL missing"));
      return;
    }

    setIntentLoad(true); // 🔄 START LOADING

    try {
      const result = await UpiNative.pay(upiUrl);
      console.log("RAW RESULT:", result);

      // 🔴 USER CANCELLED / NO RESPONSE
      if (result === "CANCELLED" || result === "NO_RESPONSE") {
        ToastAndroid.show(translate("Payment Cancelled"), ToastAndroid.SHORT);
        return;
      }

      // ✅ PARSE RESPONSE
      const parsed = parseUpiResponse(result);
      console.log("PARSED JSON:", parsed);

      const status = (parsed.status || parsed.Status || "").toUpperCase();

      // ✅ STATUS HANDLING
      if (status === "SUCCESS") {
        ToastAndroid.show(translate("Payment Successful"), ToastAndroid.SHORT);
        navigation.navigate("AddMoneyPayResponse");
      } else if (status === "FAILURE") {
        ToastAndroid.show(translate("Payment Failed"), ToastAndroid.SHORT);
        navigation.navigate("AddMoneyPayResponse");
      } else if (status === "SUBMITTED") {
        ToastAndroid.show(translate("Payment Pending"), ToastAndroid.SHORT);

        navigation.navigate("AddMoneyPayResponse");
      } else {
        ToastAndroid.show(
          translate("Unknown Payment Response"),
          ToastAndroid.SHORT,
        );
      }
    } catch (e) {
      console.log("UPI ERROR:", e);
      ToastAndroid.show(translate("UPI Failed"), ToastAndroid.SHORT);
    } finally {
      setIntentLoad(false); // ✅ STOP LOADING (ALWAYS)
    }
  };

  const Vastbazzarqr = async (amnt) => {
    setIntentLoad(true); // start loading

    try {

      const selfURL = `${APP_URLS.selfupiintent}`;

      const self = await post({ url: selfURL })

      console.log(self)
      if (!self.status) {
        ToastAndroid.show(self.msg || '', ToastAndroid.BOTTOM)
        return
      }

      const response = await post({
        url: `${APP_URLS.VastbazzarUPIQRGenerate}${amnt}`,
      });

      const generatedidresponse = response["txnid"];
      const qrcode1response = response["Intenturl"];

      const result = extractParams(qrcode1response);
      await AsyncStorage.setItem(
        "upi_intent_params",
        JSON.stringify({ result }),
      );

      setPaymentStarted(true);

      if (qrcode1response) {
        setIntentParams(result);

        try {
          startPayment(qrcode1response);
          // await Linking.openURL(qrcode1response);
          console.log("UPI App Opened");
        } catch (err) {
          console.log("Error opening UPI:", err);
        }
      } else {
        Alert.alert(translate("Something went wrong!"));
      }
    } catch (error) {
      console.error("Error fetching QR status:", error);
      Alert.alert(translate("Something went wrong!"));
    } finally {
      setIntentLoad(false); // stop loading ALWAYS
    }
  };

  const callSelfUPIIntent = async (amt) => {
    try {
      const url = `${APP_URLS.UPISUMSlab}?Amount=${amount}&Type=${chargeType}`;
      console.log("URL:", url);

      const response = await post({ url });
      console.log("API Response:", response);
      setCharge(response.Charge);
      setTotalCharge(response.TotalCharge);
      return response;
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      return null;
    }
  };

  useEffect(() => {
    callSelfUPIIntent(amount);
  }, []);

  return (
    <View style={styles.main}>
      <AppBarSecond
        title={translate("Payment Options")}
        actionButton={undefined}
        onActionPress={undefined}
        onPressBack={undefined}
        titlestyle={undefined}
      />
      <AllBalance />

      <View style={styles.container}>
        <View style={[styles.chargesContainer]}>
          <View
            style={[
              styles.chargeview,
              { backgroundColor: `${colorConfig.secondaryColor}80` },
            ]}
          >
            <View style={styles.chargeinfo}>
              <Text style={styles.chargesTitle}>{translate("Charges")}</Text>
              <Text style={styles.chargesvalue}>{"₹ " + charge}</Text>
            </View>
            <View style={[styles.bordercontainer]} />

            <View style={styles.chargeinfo}>
              <Text style={[styles.chargesTitle]}>
                {translate("Net Amount")}
              </Text>
              <Text style={[styles.chargesvalue]}>
                {"₹ " + totalCharge}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.rowview}>
                    <View style={styles.btnview}>

                        <TouchableOpacity
                            style={[styles.option, { borderColor: colors.green01D }]}
                            onPress={() => handleOptionClick('UPI')}>
                            <Upipaymentoptionssvg />

                            {selectedOption === 'UPI' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={[styles.optionText,]}>{translate("Gateway")}</Text>
                    </View>

                    <View style={styles.btnview}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('Self UPI')}>
                            <Upipaymentoptionssvg />
                            {selectedOption === 'Self UPI' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("Self_UPI")}</Text>
                    </View>
                    <View style={styles.btnview}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('QR Code')} >
                            <QrcodAddmoneysvg />
                            {selectedOption === 'QR Code' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("Paytm")}</Text>

                    </View>

                </View> */}

        {/* <View style={styles.rowview}>
                    <View style={styles.btnview}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('Creditcard')}
                        >
                            <CreditCardsvg />
                            {selectedOption === 'Creditcard' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("Credit_Card")}</Text>

                    </View>
                    <View style={styles.btnview}>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('debitCardcharges')}
                        >
                            <DebitCardsvg />
                            {selectedOption === 'debitCardcharges' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("Debit_Card")}</Text>

                    </View>
                    <View style={styles.btnview}>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('Netbanking')}
                        >
                            <NetBanksvg />
                            {selectedOption === 'Netbanking' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("Net_Banking")}</Text>
                    </View>

                </View>

                <View style={styles.rowview}>
                    <View style={styles.btnview}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick(IsDealer ? 'Request to Master' : 'Request to Distributor')}
                        >
                            <Distributorsvg />
                            {selectedOption === (IsDealer ? 'Request to Master' : 'Request to Distributor') && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}> {IsDealer ? 'Request to Master' : 'Request to Distributor'}</Text>

                    </View>
                    <View style={styles.btnview}>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('Request to Admin')}
                        >
                            <Adminsvg />
                            {selectedOption === 'Request to Admin' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("Request_to_Admin")}</Text>

                    </View>
                    <View style={styles.btnview}>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleOptionClick('International Card')}
                        >
                            <Internationalcardsvg />
                            {selectedOption === 'International Card' && <View style={[styles.selected,]}>
                                <CheckSvg size={12} />
                            </View>}
                        </TouchableOpacity>
                        <Text style={styles.optionText}>{translate("International_Card")}</Text>
                    </View>
                </View>
                <View style={styles.btnview}>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => handleOptionClick('Wallet')}
                    >
                        <WalletSvg color={colorConfig.secondaryColor} size={40} />
                        {selectedOption === 'Wallet' && <View style={[styles.selected,]}>
                            <CheckSvg size={12} />
                        </View>}
                    </TouchableOpacity>
                    <Text style={styles.optionText}>{translate("Wallet")}</Text>

                </View> */}
        <View style={styles.btncard}>
          <View
            style={[
              styles.row,
              {
                borderWidth: 0,
                backgroundColor: "transparent",
              },
            ]}
          >
            <View>
              <Text style={styles.amounttitle}>
                {translate("Added Amount")}
              </Text>
              <Text style={[styles.amounttext]}>{amount}</Text>
            </View>
            <View>
              <Text style={[styles.amounttitle, { textAlign: "right" }]}>
                {translate("Payment Mode")}
              </Text>
              <Text style={[styles.amounttext, { textAlign: "right" }]}>
                {translate(paymentMode)}
              </Text>
            </View>
          </View>
          <Text style={styles.notText}>
            {translate(
              "key_beloware_18",
            )}
          </Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              upiqr();
            }}
          >
            <View style={styles.leftSection}>
              <QrcodSvg />
            </View>
            <Text style={styles.label}>{translate("Generate QR")}</Text>

            {isLoading ? (
              <ShowLoaderBtn />
            ) : (
              <FontAwesome6 name="chevron-right" size={22} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Divider with text */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>{translate("OR")}</Text>
            <View style={styles.line} />
          </View>

          {/* Use Intent */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => Vastbazzarqr(amount)}
          >
            <View style={styles.leftSection}>
              <Upipaymentoptionssvg />
            </View>

            <Text style={styles.label}>{translate("UPI") + ' Intent'}</Text>

            {intentLoad ? (
              <ShowLoaderBtn />
            ) : (
              <FontAwesome6 name="chevron-right" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* {isLoading && <ShowLoader />}
                <DynamicButton
                    styleoveride={{ marginTop: 20 }}
                    title={`Pay by ${buttontxt}`}
                    onPress={() => {
                        console.log(checkFun);
                        handleOptionClick2(checkFun);
                    }} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wScale(10),
    paddingTop: hScale(10),
  },

  chargesContainer: {
    marginVertical: hScale(10),
    marginBottom: hScale(20),
  },
  chargesTitle: {
    fontSize: FontSize.massive,
    color: colors.white,
    textAlign: "center",
  },
  chargesvalue: {
    fontSize: FontSize.regular,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  chargeview: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hScale(5),
    borderRadius: 20,
  },
  chargeinfo: {
    alignItems: "center",
    flex: 1,
  },
  chargeItem: {
    padding: wScale(10),
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },

  amounttext: {
    fontSize: FontSize.heading,
    color: colors.white,
    fontWeight: "bold",
  },
  amounttitle: {
    fontSize: wScale(14),
    color: colors.white,
  },
  bordercontainer: {
    borderRightWidth: wScale(2),
    borderRightColor: colors.black_01,
  },
  rowview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(10),
    paddingHorizontal: wScale(30),
  },
  btnview: {
    alignItems: "center",
  },
  option: {
    width: wScale(60),
    height: wScale(60),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: wScale(1),
  },
  optionText: {
    fontSize: FontSize.xSmall,
    textAlign: "center",
    color: colors.black75,
    marginTop: hScale(3),
    width: wScale(90),
  },
  selected: {
    height: wScale(20),
    width: wScale(20),
    position: "absolute",
    right: wScale(-7),
    top: hScale(-7),
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "green",
    justifyContent: "center",
  },
  btncard: {
    backgroundColor: "#6A0DAD", // purple
    borderRadius: 14,
    paddingHorizontal: wScale(15),
    width: "100%",
    alignSelf: "center",
    paddingVertical: hScale(20),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 5,
    paddingHorizontal: wScale(10),
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: wScale(4),
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 3,
  },
  icon: {
    width: 34,
    height: 34,
    marginRight: 12,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: wScale(10),
  },
  arrow: {
    color: "#fff",
    fontSize: 28,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  orText: {
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  notText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "justify",
    paddingBottom: hScale(10),
  },
});

export default AddMoneyOptions;
