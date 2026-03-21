import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { useSelector } from "react-redux";
import { hScale, wScale } from "../../utils/styles/dimensions";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import Icon from "react-native-vector-icons/Ionicons";
import DateRangePicker from "../../components/DateRange";
import { colors, FontSize } from "../../utils/styles/theme";
import NoDatafound from "../drawer/svgimgcomponents/Nodatafound";
import DynamicButton from "../drawer/button/DynamicButton";
import { RootState } from "../../reduxUtils/store";
import { translate } from "../../utils/languageUtils/I18n";

const Walletunloadreport = () => {
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const color1 = `${colorConfig.secondaryColor}20`;
  const [transactions, setTransactions] = useState([]);
  const [present, setPresent] = useState(10);
  const [loading, setLoading] = useState(false);
  const { post, get } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
  }, []);

  const recentTransactions = async (from, to, status) => {
    try {
      setLoading(true);
      const formattedFrom = new Date(from).toISOString().split("T")[0];
      const formattedTo = new Date(to).toISOString().split("T")[0];
      const url = `${APP_URLS.WalletUnloadReport}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`;
      console.log(url);
      const response = await get({ url });

      if (response.status === "SUCCESS") {
        const transactionsData = response["Response"] || [];
        setTransactions(transactionsData);
      } else {
        setTransactions([]);
      }

      console.log("walletunloadreport", response);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPresent((prev) => prev + 10);
  };

  const TransactionDetails = ({ item }) => {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: color1,
            borderColor: colorConfig.secondaryColor,
          },
        ]}
      >
        <View style={styles.rowview}>
          <View>
            <Text style={styles.timetex}>{translate("Bank Account")}</Text>
            <Text style={styles.amounttex}>
              {item.BankAccount === "" ? "....." : item.BankAccount}
            </Text>
          </View>
          <View>
            <Text style={[styles.timetex, styles.textrit]}>
              {translate("Date")}
            </Text>
            <Text
              style={[styles.amounttex, styles.textrit]}
            >{`${item.RequestDate}`}</Text>
          </View>
        </View>
        <View style={[styles.border]} />
        <View style={[styles.rowview]}>
          <View>
            <Text style={styles.timetex}>{translate("TransferType")}</Text>
            <Text style={[styles.amounttex, { textTransform: "uppercase" }]}>
              {item.TransferType ? item.TransferType : "Type..."}
            </Text>
          </View>
          <View>
            <Text style={styles.timetex}>{translate("Bank RRN")}</Text>
            <Text style={[styles.amounttex]}>
              {item.BankRRN ? item.BankRRN : "BankRRN..."}
            </Text>
          </View>
          <View>
            <Text style={[styles.timetex, styles.textrit]}>
              {translate("Status")}
            </Text>
            <Text style={[styles.amounttex, styles.textrit]}>
              {item.Status ? item.Status : "..."}
            </Text>
          </View>
        </View>
        <View style={[styles.border]} />
        <View style={[styles.rowview]}>
          <View style={styles.blance}>
            <Text style={[styles.timetex]}>{translate("Pre Balance")}</Text>
            <Text style={[styles.amounttex]}>₹ {`${item.RemPre}`}</Text>
          </View>
          <View style={[styles.blance]}>
            <Text style={[styles.timetex, { textAlign: "center" }]}>
              translate("Pos Balance")
            </Text>
            <Text style={[styles.amounttex, { textAlign: "center" }]}>
              ₹ {`${item.RemPre}`}
            </Text>
          </View>
          <View style={styles.blance}>
            <Text style={[styles.timetex, { textAlign: "center" }]}>
              translate("Amount")
            </Text>
            <Text style={[styles.amounttex, { textAlign: "center" }]}>
              ₹ {`${item.Amount}`}
            </Text>
          </View>
          <View style={[styles.blance, { borderRightWidth: 0 }]}>
            <Text style={[styles.timetex, styles.textrit]}>{translate("Charge")}</Text>
            <Text style={[styles.amounttex, styles.textrit]}>
              ₹ {`${item.ProcessingCharge}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <AppBarSecond title={"Wallet Unload History"} />
      <DateRangePicker
        isshowRetailer={IsDealer}
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        isStShow={true}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : transactions.length === 0 ? (
          <NoDatafound />
        ) : (
          <FlatList
            data={transactions.slice(0, present)}
            renderItem={({ item }) => <TransactionDetails item={item} />}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={
              transactions.length > present ? (
                <DynamicButton onPress={handleLoadMore} title={"Load More"} />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(20),
  },
  card: {
    marginBottom: hScale(10),
    borderWidth: wScale(0.7),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(8),
  },
  rowview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  border: {
    borderBottomWidth: wScale(0.7),
    borderColor: "#000",
    marginVertical: hScale(4),
  },
  amounttex: {
    fontSize: wScale(12),
    color: "#000",
    fontWeight: "bold",
  },

  timetex: {
    fontSize: FontSize.regular,
    color: "#000",
  },

  textrit: {
    textAlign: "right",
  },

  blance: {
    flex: 1,
    borderRightWidth: wScale(0.7),
    borderColor: colors.black75,
  },
});
export default Walletunloadreport;
