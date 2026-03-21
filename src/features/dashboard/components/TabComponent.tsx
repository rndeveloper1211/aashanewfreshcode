import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import LinearGradient from "react-native-linear-gradient";

// Utils & Redux
import { RootState } from "../../../reduxUtils/store";
import { setFcmToken } from "../../../reduxUtils/store/userInfoSlice";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import { translate } from "../../../utils/languageUtils/I18n";
import { hScale, wScale } from "../../../utils/styles/dimensions";

// Screens & SVGs
import HomeScreen from "../HomeScreen";
import WalletScreen from "../WalletScreen";
import ReportScreen from "../ReportScreen";
import AccReportScreen from "../accont";
import DealerHome from "../../Delerpages/DealerTabs/DealerHome";
import Updatebox from "./Update";
import HomeSvg from "../../drawer/svgimgcomponents/homesvg";
import WalletSvg from "../../drawer/svgimgcomponents/Walletsvg";
import Accounttabsvg from "../../drawer/svgimgcomponents/Accounttabsvg";
import ReportSvg from "../../drawer/svgimgcomponents/Reportsvg";

const Tab = createBottomTabNavigator();

// --- Colors ---
const NEO_BG = "#eef2f7";
const LIGHT = "#ffffff";
const DARK = "#cfd8e3";

export const TabComponent = () => {
  const { colorConfig, IsDealer, Loc_Data } = useSelector(
    (state: RootState) => state.userInfo
  );
  const { get } = useAxiosHook();
  const [update, setUpdate] = useState(true);
  const dispatch = useDispatch();

  const primary = colorConfig.primaryColor || "#4F46E5";

  useEffect(() => {
    async function checkVersion() {
      try {
        const versionData = await get({ url: APP_URLS.current_version });
        setUpdate(APP_URLS.version === versionData.currentversion);
        const token = await messaging().getToken();
        if (token) dispatch(setFcmToken(token));
      } catch (e) {}
    }
    if (!Loc_Data["isGPS"]) checkVersion();
  }, []);

  if (!update) return <Updatebox isplay={true} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: NEO_BG }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={({ state, descriptors, navigation }) => (
          <View style={styles.tabContainer}>
            <View style={styles.tabContent}>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <Pressable
                    key={route.key}
                    onPress={onPress}
                    style={styles.tabItem}
                  >
                    {/* The Neomorphic Button */}
                    <LinearGradient
                      colors={isFocused ? [NEO_BG, "#f0f2f5"] : ["#f8f9fb", "#d8dee9"]}
                      useAngle={true}
                      angle={145}
                      style={[
                        styles.neoIconBox,
                        isFocused ? styles.activeNeo : styles.inactiveNeo,
                      ]}
                    >
                      {options.tabBarIcon &&
                        options.tabBarIcon({
                          focused: isFocused,
                          color: isFocused ? primary : "#8E9AAF",
                          size: wScale(22),
                        })}
                    </LinearGradient>

                    <Text style={[
                        styles.label,
                        { color: isFocused ? primary : "#8E9AAF", fontWeight: isFocused ? '800' : '600' }
                    ]}>
                      {options.tabBarLabel as string}
                    </Text>

                    {/* Active Indicator Dot */}
                    {isFocused && <View style={[styles.dot, { backgroundColor: primary }]} />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      >
        <Tab.Screen name="Home" component={IsDealer ? DealerHome : HomeScreen} options={{ tabBarLabel: translate("home"), tabBarIcon: ({ color }) => <HomeSvg size={hScale(22)} color={color} /> }} />
        <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: translate("wallet"), tabBarIcon: ({ color }) => <WalletSvg size={hScale(22)} color={color} /> }} />
        <Tab.Screen name="Account" component={AccReportScreen} options={{ tabBarLabel: translate("account"), tabBarIcon: ({ color }) => <Accounttabsvg size={hScale(22)} color={color} /> }} />
        <Tab.Screen name="Report" component={ReportScreen} options={{ tabBarLabel: translate("report"), tabBarIcon: ({ color }) => <ReportSvg size={hScale(22)} color={color} /> }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },

  tabContent: {
    flexDirection: "row",
    height: hScale(70),
    backgroundColor: NEO_BG,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-around",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  neoIconBox: {
    width: wScale(50),
    height: wScale(50),
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },

  inactiveNeo: {
    backgroundColor: NEO_BG,

    shadowColor: DARK,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 6,

    elevation: 6,
  },

  activeNeo: {
    backgroundColor: "#ffffff",

    shadowColor: "#a3b1c6",
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 6,

    elevation: 8,

    transform: [{ scale: 1.1 }],
  },

  label: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
});