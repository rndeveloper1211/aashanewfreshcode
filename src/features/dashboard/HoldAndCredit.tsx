import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxUtils/store";
import { APP_URLS } from "../../utils/network/urls";
import useAxiosHook from "../../utils/network/AxiosClient";
import HoldcreditSvg from "../drawer/svgimgcomponents/HoldcreditSvg";
import { hScale, wScale } from "../../utils/styles/dimensions";
import { translate } from "../../utils/languageUtils/I18n";

const HoldAndCredit = ({}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.primaryColor}80`;
  const { get, post } = useAxiosHook();
  const [listdata, setListdata] = useState("");
  const [balance, setBalance] = useState([]);

  async function stateList() {
    try {
      const balance = await get({ url: `${APP_URLS.balanceInfo}` });
      console.log(balance, "*/*/*/*/*/*/*/*/balance");
      setBalance(balance.data[0]);

      const response = await get({ url: `${APP_URLS.HoldAndCreditReport}` });
      setListdata(response);
      console.log(APP_URLS.balanceInfo);
    } catch (error) {
      console.error("Error fetching  state list:", error.message);
      throw error;
    } finally {
    }
  }
  useEffect(() => {
    stateList();
  }, []);

  return (
    <View style={styles.main}>
      <AppBarSecond title={"Hold & Credit"} />

      <ScrollView>
        <View style={styles.container}>
          <View
            style={[
              styles.stackContainer,
              { backgroundColor: colorConfig.primaryColor },
            ]}
          >
            <View style={styles.centerRow}>
              <View style={styles.textContainer}>
                <Text style={styles.headerText}>
                  {translate("My Current Credit")}
                </Text>
                <Text style={styles.balanceText}>
                  {balance == null ? "₹0.0" : `₹${balance.totalCurrentcr}`}
                </Text>
              </View>
            </View>

            <View style={[styles.creditInfo]}>
              <View style={styles.creditItem}>
                <Text style={styles.creditTitle}>
                  {translate("Company Credit")}
                </Text>
                <Text style={styles.creditValue}>
                  {balance == null ? "₹0.0" : `₹${balance.admincr}`}
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.creditItem}>
                <Text style={styles.creditTitle}>
                  {translate("Distributor Credit")}
                </Text>
                <Text style={styles.creditValue}>
                  {balance == null ? "₹0.0" : `₹${balance.dealer}`}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.stackContainer,
              { backgroundColor: colorConfig.primaryColor },
            ]}
          >
            <View style={styles.iconContainer}>
              <HoldcreditSvg />
            </View>
            <View style={styles.holdAmountContainer}>
              <Text style={styles.creditTitle}>
                {translate("Total Hold Amount")}
              </Text>
              <Text style={styles.creditValue}>
                {balance == null ? "₹0.0" : `₹${balance.totalCurrentcr}`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(20),
  },
  main: {
    flex: 1,
  },

  stackContainer: {
    paddingTop: hScale(10),
    alignItems: "center",
    borderRadius: 5,
    marginBottom: hScale(20),
  },
  centerRow: {
    flexDirection: "column",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  headerText: {
    fontSize: wScale(22),
    color: "white",
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: wScale(55),
    color: "white",
  },

  creditInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wScale(20),
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  creditItem: {
    paddingVertical: hScale(8),
    alignItems: "center",
    flex: 1,
  },
  creditTitle: {
    fontSize: wScale(14),
    color: "white",
  },
  creditValue: {
    fontSize: wScale(17),
    fontWeight: "bold",
    color: "white",
  },
  separator: {
    width: 1,
    height: hScale(35),
    backgroundColor: "white",
  },
  content: {
    paddingTop: hScale(35),
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: hScale(10),
  },
  holdAmountContainer: {
    alignItems: "center",
    marginTop: hScale(10),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: "100%",
    paddingVertical: hScale(8),
  },
});

export default HoldAndCredit;
