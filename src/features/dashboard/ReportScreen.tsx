import React, { useMemo } from "react";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ReportScreen = () => {
  const navigation = useNavigation<any>();
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo
  );

  const data = useMemo(() => {
    return IsDealer
      ? [
        "Recharge & Utilities",
        "AEPS/AadharPay",
        "Money Transfer",
        "Add Money",
        "POS ATM",
        "PAN Card",
        "Travel",
        "Security",
        "MicroATM Rental Report",
      ]
      : [
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
  }, [IsDealer]);

  const getSvgComponent = (item: string) => {
    const iconProps = { color: "#000", size: 38 }; // Slightly adjusted size
    switch (item) {
      case "Recharge & Utilities": return <RechargeSvg {...iconProps} />;
      case "IMPS/NEFT":
      case "Money Transfer": return <IMPSsvg {...iconProps} />;
      case "AEPS/AadharPay": return <AadharPay {...iconProps} />;
      case "M-POS":
      case "POS ATM": return <MPOSsvg {...iconProps} />;
      case "M-ATM":
      case "MicroATM Rental Report": return <Matmsvg {...iconProps} />;
      case "PAN Card": return <Pansvg {...iconProps} />;
      case "Cash Deposit": return <Cashsvg {...iconProps} />;
      case "Flight Booking": return <Flightsvg {...iconProps} />;
      case "Bus Booking":
      case "Travel": return <Bussvg {...iconProps} />;
      case "Payment Gateway":
      case "Add Money": return <Paymentsvg {...iconProps} />;
      case "POS Wallet": return <Possvg {...iconProps} />;
      case "Wallet Unload":
      case "Cms Wallet Transfer":
      case "Cash Pickup Prepay Report": return <Walletansvg {...iconProps} />;
      case "Cash Pikup": return <RadintPickupSvg {...iconProps} />;
      case "Security": return <Finosvg {...iconProps} />;
      default: return null;
    }
  };

  const handlePress = (item: string) => {
    const routeMap: Record<string, string> = {
      "Recharge & Utilities": IsDealer ? "DealerRechargeHistory" : "RechargeUtilitisR",
      "IMPS/NEFT": "ImpsNeftScreen",
      "Money Transfer": "ImpsNeftScreen",
      "AEPS/AadharPay": "AEPSAdharPayR",
      "M-POS": "MPosScreenR",
      "POS ATM": "MPosScreenR",
      "M-ATM": "MatmReport",
      "MicroATM Rental Report": "MatmReport",
      "PAN Card": "PanReport",
      "Cash Deposit": "cashDepReport",
      "Flight Booking": "FlightBookReport",
      "Bus Booking": "BusBookReport",
      "Travel": "BusBookReport",
      "Payment Gateway": "PaymentGReport",
      "Add Money": "PaymentGReport",
      "POS Wallet": "posreport",
      "Wallet Unload": "Walletunloadreport",
      "Cash Pikup": "CashPicUpReport",
      "Cms Wallet Transfer": "WalletTransferReport",
      "Cash Pickup Prepay Report": "RadiantPrepayReport",
    };

    if (routeMap[item]) {
      navigation.navigate(routeMap[item]);
    }
  };

  const renderItem = ({ item }: { item: string }) => (

                 <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 50 : 100} 
        keyboardShouldPersistTaps="handled"
        style={{ width: '100%' }}
    >
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => handlePress(item)}
      >
        <View style={styles.iconContainer}>{getSvgComponent(item)}</View>
        <Text
          numberOfLines={2}
          style={[styles.itemText]}
        >
          {translate(item)}
        </Text>
      </TouchableOpacity>
    </View></KeyboardAwareScrollView>
  );

  return (
    <View style={styles.main}>
      <StatusBar barStyle="light-content" />
      {/* Full Background Gradient */}
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={StyleSheet.absoluteFillObject}
      />

      <DashboardHeader />

      <View style={styles.listContainer}>
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={3}
          estimatedItemSize={130}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginTop: hScale(10),
  },
  listContent: {
    paddingTop: hScale(10),
    paddingHorizontal: wScale(5),
    paddingBottom: hScale(100),
  },
itemWrapper: {
  flex: 1,
  padding: wScale(8),
  shadowColor: "#a3b1c6",
  shadowOffset: {
    width: 6,
    height: 6,
  },
  shadowOpacity: 1,
  shadowRadius: 6,
},
card: {
  backgroundColor: "#e0e5ec",
  borderRadius: 16,
  width: "100%",
  height: hScale(110),
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#ffffff",
  shadowOffset: {
    width: -6,
    height: -6,
  },
  shadowOpacity: 1,
  shadowRadius: 6,

  elevation: 6,
},
iconContainer: {
  height: hScale(50),
  width: hScale(50),
  borderRadius: 25,
  backgroundColor: "#e0e5ec",
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#ffffff",
  shadowOffset: { width: -3, height: -3 },
  shadowOpacity: 1,
  shadowRadius: 3,
  elevation: 3,
},
  itemText: {
    color:'black',
    fontSize: wScale(11),
    textAlign: "center",
    fontWeight: "700",
    marginTop: hScale(10),
    paddingHorizontal: 4,
    lineHeight: hScale(14),
  },
});

export default ReportScreen;