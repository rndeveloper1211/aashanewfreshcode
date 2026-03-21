import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, BackHandler, ToastAndroid, } from "react-native";
import Svg, { Path } from "react-native-svg";
import { APP_URLS } from "../utils/network/urls";
import useAxiosHook from '../utils/network/AxiosClient';
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { hScale, wScale } from "../utils/styles/dimensions";
import Success from "../features/drawer/svgimgcomponents/Success";
import Successful from "../features/drawer/svgimgcomponents/successfulimg";
import Ionicons from "react-native-vector-icons/Ionicons";

import Entypo from "react-native-vector-icons/Entypo";

import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { useNavigation } from "../utils/navigation/NavigationService";
import DynamicButton from "../features/drawer/button/DynamicButton";
import ShowLoader from "./ShowLoder";
import { ActivityIndicator } from "react-native-paper";
import { tr } from "date-fns/locale/tr";
import ShareGoback from "./ShareGoback";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AddMoneyPayResponse() {
  const capRef = useRef();

  const navigation = useNavigation<any>();
  const onPressButton = () => {
    navigation.navigate({ name: "DashboardScreen" });
  };
 
  const { colorConfig, cmsAddMFrom } = useSelector((state: RootState) => state.userInfo);

  const { get, post } = useAxiosHook()
  const [saved, setSaved] = useState([])
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [inforeport, setInforeport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem("upi_intent_params");
        console.log("RAW SAVED:", saved);

        if (saved) {
          const parsed = JSON.parse(saved); // convert string → object
          console.log("PARSED:", parsed);
          // setSaved({ "pa": "radiant@kotakpay", "pn": "Ajay Kumar", "mc": "7393", "mode": "00", "orgid": "000000", "tid": "KJP91e9db6f2c3449838753870f24a16115", "tr": "VIJA2512091807587443", "am": "20", "cu": "INR", "tn": "Payment to Vijay Kumar", "refUrl": "https://radiantpayment.in/Response/KotakResponse" })
          setSaved(parsed.result);   // your result object
        }

      } catch (e) {
        console.error("Read Error:", e);
      }
    };

    load();
    AddMReport(selectedDate.from, selectedDate.to, 'ALL')
  }, []);

  const AddMReport = async (from, to, status) => {
    setLoading(true)
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];

      const response = await post({
        url: `${APP_URLS.Addmoneyrep}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`
      });

      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response');
      }

      const latest = response[0];
      console.log(latest)
      if (latest) {
        setInforeport(latest);     // ⬅️ DATA SET
        setLoading(false);         // ⬅️ AB LOADING STOP
      } else {
        console.log("No data received");
        setLoading(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);  // ⬅️ ERROR PE BHI LOADING STOP
    }
  };

  const statusRaw = inforeport?.status

    || "Pending";
  const status = statusRaw.toLowerCase();

  const color =
    status === "pending"
      ? "#fa9507"
      : status === "failed"
        ? "red"
        : status === "success"
          ? "green"
          : "#ddd";

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("DashboardScreen");  // 👈 jaha bhejna hai
      return true; // default back ko rokta hai
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup
  }, []);


 

const onPressGoBack = () => {
  if (status === "success" && cmsAddMFrom) {
    // Agar success hai aur cmsAddMFrom set hai to CmsPrePay par jao
    navigation.navigate("CmsPrePay");
  } else {
    // Otherwise normal goBack
    navigation.goBack();
  }
};


  // if (loading) {
  //   return <ShowLoader />

  // }
  const onShare = useCallback(async () => {
    try {
      const uri = await captureRef(capRef, {
        format: "jpg",
        quality: 0.7,
      });
      await Share.open({
        message: `key_hiiams_47 ${APP_URLS.AppName} App.`,
        url: uri,
      });
    } catch (e) {
      ToastAndroid.show("Transaction details not shared", ToastAndroid.SHORT);
    }
  }, []);


  return (

    <ScrollView style={[styles.container,
    { backgroundColor: `${colorConfig.secondaryColor}0D` }
    ]}>
      <ViewShot
        ref={capRef}
        options={{
          fileName: "TransactionReciept",
          format: "jpg",
          quality: 0.9,
        }}
        style={{ backgroundColor: `${colorConfig.secondaryColor}0D` }}
      >
        <View style={styles.imgView}>
          <View style={[styles.emptyView, {
            backgroundColor: color,
          }]} />
          <View style={[styles.emptyView2, {
            backgroundColor: color,
          }]} />


          <ImageBackground source={require('../../assets/images/HeaderBg.png')}
            style={styles.imgstyle}
            resizeMode="cover"
          >
            <View style={[styles.greenTop,
            ]}>



              {status === "pending"
                ? <FontAwesome6

                  name="clock" size={70} color="#fff" />

                : status === "failed"
                  ? <Entypo
                    name="circle-with-cross" size={80} color="#fff" />

                  : status === "success"
                    ? <Ionicons
                      name="checkmark-done-circle-sharp" size={80} color="#fff" />

                    : <Ionicons
                      name="checkmark-done-circle-sh" size={80} color="#fff" />

              }

            </View>

          </ImageBackground>
        </View>
        <Text style={[styles.amount,
        ]}>
          ₹ {inforeport.amt || saved.am}
        </Text>

        <View style={[styles.card,
        { backgroundColor: `${colorConfig.secondaryColor}0D` }
        ]}>
          <Text
            style={[
              styles.labelTital,
              {
                color: color,
                borderColor: color,

              },
            ]}
          >
            {statusRaw}
          </Text>

          {renderRow("Banking Name", saved?.pn || inforeport.PayerName || "--", false, color)}

          {renderRow("Transaction ID", saved?.tid || inforeport.BankRRN || "--", false, color)}
          {renderRow("Bank Ref ID", saved?.tr || inforeport.refid || "--", false, color)}
          {renderRow("Date & Time", saved?.datetime || inforeport.txndate || "--", false, color)}
          {renderRow("Remarks", saved?.tn || "--", true, color)}

          {/* ✅ last row */}



        </View>
      </ViewShot>
      <View style={{
        marginHorizontal: wScale(15),
      }}>
        <ShareGoback onShare={() => { }}
          onHome={onPressButton}
          onGoBack={onPressGoBack}
          onRefresh={() => {
            AddMReport(selectedDate.from, selectedDate.to, 'ALL')
          }}

        />

      </View>
    </ScrollView>
  );
}

function renderRow(label, value, isLast = false, color) {
  console.log(color, 'clolorrrrr');

  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <View
      style={[
        styles.rowView,
        isLast && styles.noBorder,
        { borderColor: color }
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  greenTop: {
    alignItems: "center",
    paddingTop: hScale(6),
    flex: 1,
  },

  amount: {
    fontSize: wScale(42),
    fontWeight: "bold",
    color: "#000",
    borderRadius: wScale(30),
    textAlign: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: hScale(-5)
  },

  paid: {
    fontSize: wScale(18),
    color: "#fff",
    marginTop: hScale(5),
  },

  time: {
    fontSize: wScale(14),
    color: "#e6ffe9",
    marginTop: hScale(4),
  },

  svgCurve: {},

  card: {
    backgroundColor: "rgba(0,0,0,.3)",
    borderRadius: wScale(15),
    marginHorizontal: wScale(15),
    marginTop: hScale(20),
    paddingTop: hScale(20),
    // marginBottom:hScale(10)
  },

  labelTital: {
    color: "#000",
    fontSize: wScale(33),
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: wScale(2),
    marginBottom: hScale(10),
    paddingBottom: hScale(5)
  },

  label: {
    color: "#000",
    fontSize: wScale(13),
  },

  value: {
    color: "#000",
    fontSize: wScale(16),
    marginTop: hScale(4),
    fontWeight: "bold",
  },

  rowView: {
    borderBottomWidth: wScale(1),
    borderStyle: "dashed",
    marginBottom: hScale(10),
    paddingBottom: hScale(10),
    marginHorizontal: wScale(20),
  },

  noBorder: {
    borderBottomWidth: 0,
  },

  imgView: {
    height: hScale(200),
  },

  emptyView: {
    height: hScale(100),
  },
  emptyView2: {
    height: hScale(40),
    alignSelf: 'center',
    width: '74%',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },

  imgstyle: {
    height: "100%",
    width: "100%",
    marginTop: hScale(-99),
    zIndex: 9,
  },
});

