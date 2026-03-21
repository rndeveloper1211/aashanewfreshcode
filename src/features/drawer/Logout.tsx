import React, { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { reset } from "../../reduxUtils/store/userInfoSlice";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reduxUtils/store";
import AppBar from "./headerAppbar/AppBar";
import { hScale, wScale } from "../../utils/styles/dimensions";
import DynamicButton from "./button/DynamicButton";
import CloseSvg from "./svgimgcomponents/CloseSvg";
import { translate } from "../../utils/languageUtils/I18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = (onRequestClose) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const { authToken, refreshToken } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch]);

  const navigation = useNavigation();

const handleBack = () => {
    console.log("Cancel Pressed"); // Debugging ke liye
    if (onRequestClose) {
      onRequestClose(); // Ye Modal ki setLogoutVisible(false) ko trigger karega
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log("All AsyncStorage data cleared");
    } catch (error) {
      console.error("Failed to clear AsyncStorage:", error);
    }
    dispatch(reset());
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.close} onPress={handleBack}>
            <CloseSvg
              size={30}
              color={colorConfig?.secondaryButtonColor || "#000"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{translate("Logout?")}</Text>
        <Text style={styles.confirmText}>
          {translate("Are you sure you want to logout?")}
        </Text>

        <View style={styles.buttonContainer}>
          <DynamicButton title="Logout" onPress={handleLogout} />
          <View style={styles.empty} />
          <DynamicButton title="Cancel" onPress={handleBack} />
          <View style={styles.empty} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
flex: 1,
  width: '100%', // Add this
  height: '100%', // Add this
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    paddingHorizontal: wScale(20),
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopEndRadius: 20,
    paddingTop: hScale(20),
  },
  title: {
    fontSize: wScale(30),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hScale(10),
  },
  confirmText: {
    fontSize: 18,
    color: "#555",
    marginBottom: hScale(20),
  },
  buttonContainer: {
    width: "100%",
  },
  empty: {
    marginBottom: hScale(30),
  },
  close: {
    alignSelf: "flex-end",
  },
});

export default Logout;
