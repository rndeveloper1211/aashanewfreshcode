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
import LinearGradient from "react-native-linear-gradient";
import { FlashList } from "@shopify/flash-list";

import { RootState } from "../../reduxUtils/store";
import { hScale, wScale } from "../../utils/styles/dimensions";
import { translate } from "../../utils/languageUtils/I18n";

import DashboardHeader from "./components/DashboardHeader";
import DayEarnsvg from "../drawer/svgimgcomponents/DayEarnsvg";
import DayLedgerSvg from "../drawer/svgimgcomponents/DayLedgerSvg";
import AddedMoneySvg from "../drawer/svgimgcomponents/AddedMoneySvg";
import RToRSvg from "../drawer/svgimgcomponents/RToRSvg";
import FundReceivedSvg from "../drawer/svgimgcomponents/FundReceivedSvg";
import OperatorCommissionSvg from "../drawer/svgimgcomponents/OperatorCommissionSvg";
import ManageAccountSvg from "../drawer/svgimgcomponents/ManageAccountSvg";
import PurchaseOrderSvg from "../drawer/svgimgcomponents/PurchaseOrderSvg";
import DisputeSvg from "../drawer/svgimgcomponents/DisputeSvg";
import OtherLinksSvg from "../drawer/svgimgcomponents/OtherLinksSvg";
import DayBookSvg from "../drawer/svgimgcomponents/DayBookSvg";
import RToRiportSvg from "../drawer/svgimgcomponents/RToRiportSvg";
import Paymentsvg from "../drawer/svgimgcomponents/Paymentsvg";

// ─── Icon tint & color map ────────────────────────────────────────────────────
const ICON_TINT: Record<string, string> = {
  "Day Earning":              "#ECFDF5",
  "Ledger":                   "#EFF6FF",
  "Day Ledger":               "#EFF6FF",
  "Day & Month Book":         "#F0F9FF",
  "Day Book":                 "#F0F9FF",
  "Added Money":              "#FFF7ED",
  "R TO R":                   "#FAF5FF",
  "Credit Report":            "#FFF1F2",
  "Fund Transfer History":    "#EEF2FF",
  "R TO R Report":            "#EEF2FF",
  "Fund Receive Report":      "#F0FDF4",
  "Operator Commission":      "#FFFBEB",
  "Manage A/C":               "#F0F9FF",
  "Purchase order Report":    "#FAF5FF",
  "Dispute Report":           "#FFF1F2",
  "Other Links":              "#F1F5F9",
  "My Expense":               "#FFF7ED",
};

const ICON_COLOR: Record<string, string> = {
  "Day Earning":              "#059669",
  "Ledger":                   "#2563EB",
  "Day Ledger":               "#2563EB",
  "Day & Month Book":         "#0284C7",
  "Day Book":                 "#0284C7",
  "Added Money":              "#EA580C",
  "R TO R":                   "#7C3AED",
  "Credit Report":            "#DC2626",
  "Fund Transfer History":    "#4F46E5",
  "R TO R Report":            "#4F46E5",
  "Fund Receive Report":      "#16A34A",
  "Operator Commission":      "#D97706",
  "Manage A/C":               "#0369A1",
  "Purchase order Report":    "#6D28D9",
  "Dispute Report":           "#B91C1C",
  "Other Links":              "#475569",
  "My Expense":               "#C2410C",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const ROUTE_MAP: Record<string, string> = {
  "Day Earning":            "DayEarningReport",
  "Ledger":                 "DayLedgerReport",
  "Day Ledger":             "DayLedgerReport",
  "Day & Month Book":       "DayBookReport",
  "Day Book":               "DayBookReport",
  "Added Money":            "AddedMoneyROTRReport",
  "R TO R":                 "RtorScreen",
  "Fund Transfer History":  "RToRReport",
  "R TO R Report":          "RToRReport",
  "Credit Report":          "CreditReport",
  "Fund Receive Report":    "FundReceivedReport",
  "Operator Commission":    "OperatorCommissionReport",
  "Manage A/C":             "ManageAccount",
  "Purchase order Report":  "PurchaseOrderReport",
  "Dispute Report":         "DisputeReport",
  "Other Links":            "OtherLinks",
  "My Expense":             "MyExpense",
};

const getSvgComponent = (item: string) => {
  const color = ICON_COLOR[item] ?? "#64748B";
  const props = { color, size: 28 };
  switch (item) {
    case "Day Earning":             return <DayEarnsvg {...props} />;
    case "Ledger":
    case "Day Ledger":              return <DayLedgerSvg {...props} />;
    case "Day & Month Book":
    case "Day Book":                return <DayBookSvg {...props} />;
    case "Added Money":             return <AddedMoneySvg {...props} />;
    case "R TO R":                  return <RToRSvg {...props} />;
    case "Credit Report":           return <Paymentsvg {...props} />;
    case "Fund Transfer History":
    case "R TO R Report":           return <RToRiportSvg {...props} />;
    case "Fund Receive Report":     return <FundReceivedSvg {...props} />;
    case "Operator Commission":     return <OperatorCommissionSvg {...props} />;
    case "Manage A/C":              return <ManageAccountSvg {...props} />;
    case "Purchase order Report":   return <PurchaseOrderSvg {...props} />;
    case "Dispute Report":          return <DisputeSvg {...props} />;
    case "Other Links":             return <OtherLinksSvg {...props} />;
    case "My Expense":              return <Paymentsvg {...props} />;
    default:                        return null;
  }
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  item: string;
  onPress: (item: string) => void;
}

const AccReportCard = React.memo(({ item, onPress }: CardProps) => (
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
const AccReportScreen = () => {
  const navigation = useNavigation<any>();
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo
  );

  const gridItems = useMemo(() => [
    "Day Earning",
    IsDealer ? "Ledger" : "Day Ledger",
    IsDealer ? "Day & Month Book" : "Day Book",
    ...(!IsDealer ? ["Added Money", "R TO R"] : []),
    ...(IsDealer  ? ["Credit Report"]         : []),
    IsDealer ? "Fund Transfer History" : "R TO R Report",
    ...(!IsDealer ? ["Dispute Report"] : []),
    "Fund Receive Report",
    "Operator Commission",
    "Manage A/C",
    "Purchase order Report",
    ...(!IsDealer ? ["Other Links"] : []),
  ], [IsDealer]);

  const handlePress = useCallback(
    (item: string) => {
      const route = ROUTE_MAP[item];
      if (route) navigation.navigate(route);
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <AccReportCard item={item} onPress={handlePress} />
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

      <View style={styles.sheet}>
        <FlashList
          data={gridItems}
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

export default AccReportScreen;