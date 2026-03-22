import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import LinearGradient from "react-native-linear-gradient";

import { RootState } from "../../reduxUtils/store";
import { hScale, wScale } from "../../utils/styles/dimensions";
import { translate } from "../../utils/languageUtils/I18n";

import DashboardHeader from "./components/DashboardHeader";
import RechargeSvg from "../drawer/svgimgcomponents/RechargeSvg";
import IMPSsvg from "../drawer/svgimgcomponents/IMPSsvg";
import AadharPay from "../drawer/svgimgcomponents/AdharPaysvg";
import MPOSsvg from "../drawer/svgimgcomponents/M-POSsvg";
import Matmsvg from "../drawer/svgimgcomponents/Matmsvg";
import Pansvg from "../drawer/svgimgcomponents/Pansvg";
import Cashsvg from "../drawer/svgimgcomponents/Cashsvg";
import Flightsvg from "../drawer/svgimgcomponents/Flightsvg";
import Bussvg from "../drawer/svgimgcomponents/Bussvg";
import Paymentsvg from "../drawer/svgimgcomponents/Paymentsvg";
import Possvg from "../drawer/svgimgcomponents/Possvg";
import Walletansvg from "../drawer/svgimgcomponents/Walletansvg";
import Finosvg from "../drawer/svgimgcomponents/Finosvg";
import RadintPickupSvg from "../drawer/svgimgcomponents/RadintPickupSvg";

// Muted icon tint backgrounds
const ICON_TINT: Record<string, string> = {
  "Recharge & Utilities":       "#EEF2FF",
  "IMPS/NEFT":                  "#EFF6FF",
  "Money Transfer":             "#EFF6FF",
  "AEPS/AadharPay":             "#ECFDF5",
  "M-POS":                      "#FFFBEB",
  "POS ATM":                    "#FFFBEB",
  "M-ATM":                      "#FFF1F2",
  "MicroATM Rental Report":     "#FFF1F2",
  "PAN Card":                   "#EFF6FF",
  "Cash Deposit":               "#F0FDF4",
  "Flight Booking":             "#F0F9FF",
  "Bus Booking":                "#FAF5FF",
  "Travel":                     "#FAF5FF",
  "Payment Gateway":            "#FFF7ED",
  "Add Money":                  "#FFF7ED",
  "POS Wallet":                 "#ECFDF5",
  "Wallet Unload":              "#F0F9FF",
  "Cms Wallet Transfer":        "#F0F9FF",
  "Cash Pickup Prepay Report":  "#F0F9FF",
  "Cash Pikup":                 "#FFFBEB",
  "Security":                   "#F1F5F9",
};

const ICON_COLOR: Record<string, string> = {
  "Recharge & Utilities":       "#4F46E5",
  "IMPS/NEFT":                  "#2563EB",
  "Money Transfer":             "#2563EB",
  "AEPS/AadharPay":             "#059669",
  "M-POS":                      "#D97706",
  "POS ATM":                    "#D97706",
  "M-ATM":                      "#DC2626",
  "MicroATM Rental Report":     "#DC2626",
  "PAN Card":                   "#1D4ED8",
  "Cash Deposit":               "#16A34A",
  "Flight Booking":             "#0284C7",
  "Bus Booking":                "#7C3AED",
  "Travel":                     "#7C3AED",
  "Payment Gateway":            "#EA580C",
  "Add Money":                  "#EA580C",
  "POS Wallet":                 "#0D9488",
  "Wallet Unload":              "#0369A1",
  "Cms Wallet Transfer":        "#0369A1",
  "Cash Pickup Prepay Report":  "#0369A1",
  "Cash Pikup":                 "#B45309",
  "Security":                   "#475569",
};

const DEALER_DATA = [
  "Recharge & Utilities",
  "AEPS/AadharPay",
  "Money Transfer",
  "Add Money",
  "POS ATM",
  "PAN Card",
  "Travel",
  "Security",
  "MicroATM Rental Report",
];

const RETAILER_DATA = [
  "Recharge & Utilities",
  "IMPS/NEFT",
  "AEPS/AadharPay",
  "M-POS",
  "M-ATM",
  "PAN Card",
  "Cash Deposit",
  "Flight Booking",
  "Bus Booking",
  "Payment Gateway",
  "POS Wallet",
  "Wallet Unload",
  "Cash Pikup",
  "Cms Wallet Transfer",
  "Cash Pickup Prepay Report",
];

const ROUTE_MAP: Record<string, string> = {
  "Recharge & Utilities":       "RechargeUtilitisR",
  "IMPS/NEFT":                  "ImpsNeftScreen",
  "Money Transfer":             "ImpsNeftScreen",
  "AEPS/AadharPay":             "AEPSAdharPayR",
  "M-POS":                      "MPosScreenR",
  "POS ATM":                    "MPosScreenR",
  "M-ATM":                      "MatmReport",
  "MicroATM Rental Report":     "MatmReport",
  "PAN Card":                   "PanReport",
  "Cash Deposit":               "cashDepReport",
  "Flight Booking":             "FlightBookReport",
  "Bus Booking":                "BusBookReport",
  "Travel":                     "BusBookReport",
  "Payment Gateway":            "PaymentGReport",
  "Add Money":                  "PaymentGReport",
  "POS Wallet":                 "posreport",
  "Wallet Unload":              "Walletunloadreport",
  "Cash Pikup":                 "CashPicUpReport",
  "Cms Wallet Transfer":        "WalletTransferReport",
  "Cash Pickup Prepay Report":  "RadiantPrepayReport",
  "Security":                   "SecurityReport",
};

const getSvgComponent = (item: string) => {
  const color = ICON_COLOR[item] ?? "#64748B";
  const iconProps = { color, size: 28 };
  switch (item) {
    case "Recharge & Utilities":        return <RechargeSvg {...iconProps} />;
    case "IMPS/NEFT":
    case "Money Transfer":              return <IMPSsvg {...iconProps} />;
    case "AEPS/AadharPay":             return <AadharPay {...iconProps} />;
    case "M-POS":
    case "POS ATM":                    return <MPOSsvg {...iconProps} />;
    case "M-ATM":
    case "MicroATM Rental Report":     return <Matmsvg {...iconProps} />;
    case "PAN Card":                   return <Pansvg {...iconProps} />;
    case "Cash Deposit":               return <Cashsvg {...iconProps} />;
    case "Flight Booking":             return <Flightsvg {...iconProps} />;
    case "Bus Booking":
    case "Travel":                     return <Bussvg {...iconProps} />;
    case "Payment Gateway":
    case "Add Money":                  return <Paymentsvg {...iconProps} />;
    case "POS Wallet":                 return <Possvg {...iconProps} />;
    case "Wallet Unload":
    case "Cms Wallet Transfer":
    case "Cash Pickup Prepay Report":  return <Walletansvg {...iconProps} />;
    case "Cash Pikup":                 return <RadintPickupSvg {...iconProps} />;
    case "Security":                   return <Finosvg {...iconProps} />;
    default:                           return null;
  }
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  item: string;
  onPress: (item: string) => void;
}

const ReportCard = React.memo(({ item, onPress }: CardProps) => (
  <View style={styles.itemWrapper}>
    <TouchableOpacity
      activeOpacity={0.72}
      onPress={() => onPress(item)}
      style={styles.card}
    >
      <View style={[styles.iconContainer, { backgroundColor: ICON_TINT[item] ?? "#F1F5F9" }]}>
        {getSvgComponent(item)}
      </View>
      <Text numberOfLines={2} style={styles.itemText}>
        {translate(item)}
      </Text>
    </TouchableOpacity>
  </View>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const ReportScreen = () => {
  const navigation = useNavigation<any>();
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo
  );

  const data = useMemo(
    () => (IsDealer ? DEALER_DATA : RETAILER_DATA),
    [IsDealer]
  );

  const handlePress = useCallback(
    (item: string) => {
      const route =
        item === "Recharge & Utilities" && IsDealer
          ? "DealerRechargeHistory"
          : ROUTE_MAP[item];
      if (route) navigation.navigate(route);
    },
    [navigation, IsDealer]
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <ReportCard item={item} onPress={handlePress} />
    ),
    [handlePress]
  );

  const keyExtractor = useCallback(
    (_: string, index: number) => String(index),
    []
  );

  return (
    <View style={styles.main}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={StyleSheet.absoluteFillObject}
      />

      <DashboardHeader />

      {/* White sheet */}
      <View style={styles.sheet}>
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={3}
          estimatedItemSize={118}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === "android"}
          drawDistance={400}
        />
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  main: { flex: 1 },

  sheet: {
    flex: 1,
    // backgroundColor: "#F4F6F9",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: hScale(8),
    overflow: "hidden",
  },
  listContent: {
    paddingTop: hScale(14),
    paddingHorizontal: wScale(8),
    paddingBottom: hScale(100),
  },

  itemWrapper: {
    flex: 1,
    padding: wScale(5),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    height: hScale(106),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wScale(4),
    shadowColor: "#B0BEC5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  iconContainer: {
    height: hScale(44),
    width: hScale(44),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hScale(8),
  },

  itemText: {
    color: "#1E293B",
    fontSize: wScale(10),
    textAlign: "center",
    fontWeight: "600",
    lineHeight: hScale(13),
    paddingHorizontal: 2,
  },
});

export default ReportScreen;