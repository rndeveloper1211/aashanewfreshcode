import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const AccReportScreen = () => {
  const navigation = useNavigation<any>();
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );

  // Memoizing grid items so they don't recalculate every render
  const gridItems = useMemo(() => [
    "Day Earning",
    IsDealer ? "Ledger" : "Day Ledger",
    IsDealer ? "Day & Month Book" : "Day Book",
    ...(!IsDealer ? ["Added Money", "R TO R"] : []),
    ...(IsDealer ? ["Credit Report"] : []),
    IsDealer ? "Fund Transfer History" : "R TO R Report",
    ...(!IsDealer ? ["Dispute Report"] : []),
    "Fund Receive Report",
    "Operator Commission",
    "Manage A/C",
    "Purchase order Report",
    // "My Expense",
    ...(!IsDealer ? ["Other Links"] : []),
  ], [IsDealer]);

  const getSvgComponent = (item: string) => {
    switch (item) {
      case "Day Earning": return <DayEarnsvg />;
      case "Ledger":
      case "Day Ledger": return <DayLedgerSvg />;
      case "Day & Month Book":
      case "Day Book": return <DayBookSvg />;
      case "Added Money": return <AddedMoneySvg />;
      case "R TO R": return <RToRSvg />;
      case "Credit Report": return <Paymentsvg color="#000" />;
      case "Fund Transfer History":
      case "R TO R Report": return <RToRiportSvg />;
      case "Fund Receive Report": return <FundReceivedSvg />;
      case "Operator Commission": return <OperatorCommissionSvg />;
      case "Manage A/C": return <ManageAccountSvg />;
      case "Purchase order Report": return <PurchaseOrderSvg />;
      case "Dispute Report": return <DisputeSvg />;
      case "Other Links": return <OtherLinksSvg />;
            case "My Expense": return <Paymentsvg color="#000"/>;

      default: return null;
    }
  };

  const handleItemClick = (item: string) => {
    const routes: Record<string, string> = {
      "Day Earning": "DayEarningReport",
      "Ledger": "DayLedgerReport",
      "Day Ledger": "DayLedgerReport",
      "Day & Month Book": "DayBookReport",
      "Day Book": "DayBookReport",
      "Added Money": "AddedMoneyROTRReport",
      "R TO R": "RtorScreen",
      "Fund Transfer History": "RToRReport",
      "R TO R Report": "RToRReport",
      "Credit Report": "CreditReport",
      "Fund Receive Report": "FundReceivedReport",
      "Operator Commission": "OperatorCommissionReport",
      "Manage A/C": "ManageAccount",
      "Purchase order Report": "PurchaseOrderReport",
      "Dispute Report": "DisputeReport",
      "Other Links": "OtherLinks",
      "My Expense": "MyExpense",
    };

    if (routes[item]) {
      navigation.navigate(routes[item]);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleItemClick(item)}
      >
        <View style={styles.iconWrapper}>{getSvgComponent(item)}</View>
        <Text 
            numberOfLines={2} 
            style={[styles.itemText]}
        >
          {translate(item)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.main}>
      <LinearGradient
        style={styles.gradient}
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
      >
        <DashboardHeader />
        <View style={styles.listContainer}>
          <FlashList
            data={gridItems}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            numColumns={3}
            estimatedItemSize={150}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { 
    flex: 1 
  },
  gradient: { 
    flex: 1 
  },
  listContainer: {
    flex: 1, // Ensures FlashList takes up remaining space
    marginTop: hScale(10),
  },
  listContent: {
    paddingHorizontal: wScale(5),
    paddingBottom: hScale(20),
  },
  itemContainer: {
    flex: 1,
    padding: wScale(5),
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    height: hScale(110),
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconWrapper: {
    height: hScale(40),
    justifyContent: "center",
  },
  itemText: {
        color:'black',

    fontSize: wScale(12),
    textAlign: "center",
    marginTop: hScale(8),
    fontWeight: "600",
    paddingHorizontal: 4,
  },
});

export default AccReportScreen;