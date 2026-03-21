import { translate } from "../utils/languageUtils/I18n";
import React from "react";
import { View, StyleSheet, Text, Pressable, Dimensions } from "react-native";
import { BottomSheet } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onLater: () => void;
  onEnable: () => void;
}

const SecurityBottomSheet: React.FC<Props> = ({ visible, onLater, onEnable }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  
  // Dynamic colors from Redux or modern defaults
  const primary = colorConfig?.primaryColor || "#6366f1"; // Indigo
  const secondary = colorConfig?.secondaryColor || "#a855f7"; // Purple

  return (
    <BottomSheet
      isVisible={visible}
      onBackdropPress={onLater}
      containerStyle={styles.backdrop}
    >
      <View style={styles.container}>
        {/* Subtle Drag Handle */}
        <View style={styles.handle} />

        <View style={styles.content}>
          {/* 1. Gradient Icon Circle */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={[`${primary}20`, `${secondary}10`]} // Very light outer ring
              style={styles.iconGradientRing}
            >
              <LinearGradient
                colors={[primary, secondary]}
                style={styles.iconCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="shield-lock" size={40} color="#fff" />
              </LinearGradient>
            </LinearGradient>
          </View>

          <Text style={styles.title}>{translate("Secure_Your_Account")}</Text>
          
          <Text style={styles.description}>{translate("key_addalaye_136")}</Text>

          <View style={styles.buttonGroup}>
            {/* 2. Primary Gradient Button */}
            <Pressable onPress={onEnable} style={styles.pressableContainer}>
              <LinearGradient
                colors={[primary, secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryText}>{translate("Enable_Now")}</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </LinearGradient>
            </Pressable>

            {/* 3. Subtle "Later" Button */}
            <Pressable 
              onPress={onLater} 
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.5 : 1 }
              ]}
            >
              <Text style={styles.laterText}>{translate("Ill_do_it_later")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default SecurityBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(15, 23, 42, 0.4)", // Slate-dark overlay
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 25,
  },
  content: {
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 24,
  },
  iconGradientRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    // Shadow glow effect
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 35,
  },
  buttonGroup: {
    width: "100%",
  },
  pressableContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden", // Important for gradient clip
    marginBottom: 10,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  laterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
  },
});