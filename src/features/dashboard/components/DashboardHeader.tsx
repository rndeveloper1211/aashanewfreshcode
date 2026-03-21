import React, { memo, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
} from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import MenuIcon from "./MenuIcon";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import { BalanceType } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { decryptData } from "../../../utils/encryptionUtils";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { translate } from "../../../utils/languageUtils/I18n";
import RefreshSvg from "../../drawer/svgimgcomponents/RefreshSvg";
import HoldcreditSvg from "../../drawer/svgimgcomponents/HoldcreditSvg";
import QrcodAddmoneysvg from "../../drawer/svgimgcomponents/QrcodAddmoneysvg";
import QrcodSvg from "../../drawer/svgimgcomponents/QrcodSvg";
import { log, warn } from "console";
import Entypo from "react-native-vector-icons/Entypo"; // or another icon set like MaterialIcons
import { useLocationHook } from "../../../hooks/useLocationHook";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { setRceIdStatus } from "../../../reduxUtils/store/userInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

const DashboardHeader = ({ refreshPress }) => {
  const { colorConfig, IsDealer, Loc_Data, appLanguage } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const { get, post } = useAxiosHook();
  const [balanceInfo, setBalanceInfo] = useState<BalanceType | undefined>();
  const [firmname, setfirmName] = useState<any>();
  const navigation = useNavigation();
  const { isgps, latitude, longitude } = useLocationHook();
  const [status, setStatus] = useState(null);
  const [status2, setStatus2] = useState(null);

  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      const userInfo = await get({ url: APP_URLS.getUserInfo });
      console.warn(userInfo, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

      const data = userInfo.data;
      if (!IsDealer) {
        const response = await get({ url: APP_URLS.balanceInfo });
        setBalanceInfo(response.data[0]);

      } else {
        const decryptedData = {
          adminfarmname: decryptData(data.kkkk, data.vvvv, data.adminfarmname),
          posremain: decryptData(data.kkkk, data.vvvv, data.posremain),
          remainbal: decryptData(data.kkkk, data.vvvv, data.remainbal),
          frmanems: decryptData(data.kkkk, data.vvvv, data.frmanems),
        };


        setfirmName(decryptedData.adminfarmname);
        setBalanceInfo(decryptedData);
        console.warn(decryptedData.adminfarmname);
      }

      const adminFarmName = decryptData(
        data.vvvv,
        data.kkkk,
        data.adminfarmname,
      );
      setfirmName(adminFarmName);

      console.log(APP_URLS.RCEID);
      console.log(APP_URLS.RadiantCEIntersetCheck);
      if (true) {
        try {
          const res = await post({ url: APP_URLS.RCEID });
          console.warn("First API Response:", res);

          const firstStatus = res?.Content?.ADDINFO?.sts;
          setStatus(firstStatus);

          if (firstStatus === false) {
            const res2 = await post({ url: APP_URLS.RadiantCEIntersetCheck });
            console.warn("Second API Response:", res2);
            if (res2 != "Invalid response..") {
              const secondStatus = res2?.Content?.ADDINFO?.sts;
              setStatus2(secondStatus);
              dispatch(
                setRceIdStatus({
                  status: res.Content.ADDINFO.sts,
                  status2: res2.Content.ADDINFO.sts,
                }),
              );
            } else {
              console.error(res2);
            }
          }
        } catch (error) {
          console.error("API error:", error);
        }
      }

      await AsyncStorage.setItem(
        "adminFarmData",
        JSON.stringify({
          adminFarmName: adminFarmName,
          frmanems: decryptData(data.vvvv, data.kkkk, data.frmanems),
          photoss: data.photoss
            ? decryptData(data.vvvv, data.kkkk, data.photoss)
            : "Default Value",
        }),
      );
    } catch (error) {
      if (error.message === "Network Error") {
      } else {
        console.error("Error fetching data:", error);
      }
    }
  }, [get]);
  const openSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings().catch(() =>
        console.warn("Unable to open settings"),
      );
    } else {
      console.log("Settings can be opened manually on iOS");
    }
  };
  const checkNotificationPermission = async () => {
    const permissionStatus = await check(
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    );

    if (permissionStatus === RESULTS.GRANTED) {
      console.warn("Notification permission granted");
    } else if (permissionStatus === RESULTS.DENIED) {
      console.warn("Notification permission denied");
      setnotificationPermission(true);

      requestNotificationPermission();
    } else if (permissionStatus === RESULTS.BLOCKED) {
      setnotificationPermission(true);

      requestNotificationPermission();

      console.warn("Notification permission blocked");
    } else {
      console.warn("Notification permission status unknown");
    }
  };

  const requestNotificationPermission = async () => {
    const permissionStatus = await request(
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ); // Request notification permission on Android
    console.warn(permissionStatus);
    if (permissionStatus === RESULTS.GRANTED) {
      console.log("Notification permission granted");
    } else {
      setnotificationPermission(true);

      Alert.alert(
        translate("Notification permission not granted"),
        "",
        [
          {
            text: translate("Cancel"),
            onPress: () => null,
          },
          {
            text: translate("Open Settings"),
            onPress: () => openSettings(),
          },
        ],
        { cancelable: false },
      );
      console.log("Notification permission not granted");
    }
  };
  const [net, setNet] = useState('')
  const [isnotificationPermission, setnotificationPermission] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getData();
      //   checkNotificationPermission();
      NetInfo.fetch().then(state => {

        if (!state.isConnected) {
          console.log("Internet: OFF ❌");
          return;
        }

        console.log("Internet: ON ✅");

        const generation = state.details?.cellularGeneration;
        setNet(generation)
        switch (generation) {
          case "5g":
            console.log("Network: 5G 🚀");
            break;

          case "4g":
            console.log("Network: 4G ⚡");
            break;

          case "3g":
            console.log("Network: 3G 📶");
            break;

          case "2g":
            console.log("Network: 2G 🐢");
            break;

          default:
            if (state.type === "wifi") {
              console.log("Network: WiFi 📡");
            } else {
              console.log("Network: Unknown");
            }
        }
      });

      return () => { };
    }, [isgps, latitude, longitude, Loc_Data.long]),
  );
  const longPress = useCallback(() => {
    alert(`${latitude.length}\n${longitude.length}`);
  }, [latitude, longitude]);
  const getcolor = (type) => {
    let color = ''
    if (type == '5g') {

      color = 'green'

    } else if (type == '4g') {
      color = 'orange'
    } else if (type == '3g') {
      color = 'yellow'
    }

    return color
  }
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.Headers,
          // { backgroundColor: 'rgba(0, 0, 0, 0.0)' }
        ]}
      >
        <View style={styles.MenuLogo}>
          {APP_URLS.AppName === "STdigiPe" ? (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
            >
              <Image
                source={require("../../drawer/assets/menu2.png")}
                style={{
                  width: wScale(40),
                  height: wScale(25),
                }}
              />
            </TouchableOpacity>
          ) : (
            <MenuIcon />
          )}

          {APP_URLS.AppName === "STdigiPe" ? (
            <Image
              source={require("../../drawer/assets/stdigipe.jpg")}
              style={{
                width: wScale(80),
                height: wScale(40),
                resizeMode: "contain",
                marginHorizontal: wScale(20),
                borderWidth: 1,
              }}
            />
          ) : (
            <Text style={[styles.appname, { color: 'white' }]} ellipsizeMode="tail" numberOfLines={2}>
              {firmname ? firmname : ""}
            </Text>
          )}

          {APP_URLS.AppName === "STdigiPe" && <QrcodSvg size={40} />}
        </View>
        {Loc_Data?.isGPS ? (
          <TouchableOpacity onLongPress={() => longPress()}>
            <Entypo
              name="location"
              size={15}
              color={!Loc_Data?.latitude ? "#fff" : colorConfig.secondaryColor}
              style={{ left: wScale(-10) }}
            />
          </TouchableOpacity>
        ) : null}

        {isnotificationPermission ? (
          <TouchableOpacity onPress={() => requestNotificationPermission()}>
            <Entypo
              name="bell"
              size={15}
              color={!Loc_Data?.latitude ? "#fff" : colorConfig.secondaryColor}
              style={{ left: wScale(-10) }}
            />
          </TouchableOpacity>
        ) : null}

{/* 
        <Entypo
          name={"bar-graph"}
          size={15}
          style={{ left: wScale(-10) }}
          color={getcolor(net || '3g')}
        /> */}
        <View style={styles.PossOrWall}>
          <View style={styles.poscontainer}>
            <Text style={[styles.balenstext, { color: 'white' }]}>{translate("Pos Wallet")} ₹</Text>
            <Text style={[styles.balensnumber, , { color: 'white' }]}>
              {balanceInfo?.posremain != null
                ? balanceInfo.posremain.toString()
                : "0.00"}
            </Text>
          </View>
          <View style={styles.devider} />
          <View style={styles.poscontainer}>
            <Text style={[styles.balenstext, { color: 'white' }]}>{translate("Main Wallet")} ₹</Text>

            <Text style={[styles.balensnumber, { color: 'white' }]}>
              {balanceInfo?.posremain != null
                ? balanceInfo.remainbal.toString()
                : "0.00"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(DashboardHeader);

const styles = StyleSheet.create({
  main: {
    width: "100%",
  },
  PossOrWall: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  poscontainer: {
    height: hScale(35),
    justifyContent: "space-between",
    paddingHorizontal: wScale(5),
  },

  Headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hScale(2),
    paddingBottom: hScale(5),
    paddingHorizontal: wScale(5),
  },
  MenuLogo: {
    flexDirection: "row",
    alignItems: "center",
  },

  appname: {
    fontSize: wScale(16),
    fontWeight: "bold",

    textTransform: "uppercase",
    textAlign: "left",
    height: "auto",
    width: wScale(120),
    paddingLeft: wScale(5),
    lineHeight: 15,
  },
  balenstext: {
    fontSize: wScale(11),
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "center",
    height: "auto",
    paddingTop: hScale(1),
  },

  balensnumber: {
    fontSize: wScale(13, 1),
    color: "#fff",
    alignSelf: "center",
    fontWeight: "bold",
  },
  devider: {
    width: wScale(0.1),
    height: hScale(28),
    backgroundColor: "#fff",
    padding: wScale(0.2),
    marginHorizontal: 4,
  },
});
