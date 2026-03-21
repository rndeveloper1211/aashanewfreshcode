import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import {
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { translate } from "../../../utils/languageUtils/I18n";

const DynamicButton = ({ title, onPress, styleoveride ,onlong }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const handlePress = () => {
    onPress();
  };  
  const handlePresslong = () => {
    onlong();
  };

  return (
    <View>
      <LinearGradient
        style={[styles.LinearGradient, styleoveride]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={[
          colorConfig.primaryButtonColor,
          colorConfig.secondaryButtonColor,
        ]}
      >
        <TouchableOpacity
        onLongPress={handlePresslong}
        onPress={handlePress} style={[styles.subnitbtn]}>
          {/* Yahan hum check kar rahe hain: agar title string hai toh translate karein, 
              nahi toh direct render karein (ActivityIndicator ke liye) */}
          {typeof title === "string" ? (
            <Text style={[styles.submittext, { color: colorConfig.labelColor }]}>
              {translate(title)}
            </Text>
          ) : (
            // Agar title koi component hai (Loader), toh yahan render hoga
            title
          )}
        </TouchableOpacity>
      </LinearGradient>
      <AlertNotificationRoot />
    </View>
  );
};

const styles = StyleSheet.create({
  subnitbtn: {
    alignItems: "center",
    height: hScale(55),
    justifyContent: "center",
    borderRadius: wScale(5),
  },
  submittext: {
    fontSize: wScale(18),
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  LinearGradient: {
    width: "100%",
    borderRadius: wScale(5),
  },
});
export default DynamicButton;
