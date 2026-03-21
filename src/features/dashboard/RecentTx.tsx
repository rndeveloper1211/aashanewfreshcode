import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { APP_URLS } from "../../utils/network/urls";
import { FlashList } from "@shopify/flash-list";
import useAxiosHook from "../../utils/network/AxiosClient";
import { hScale, wScale } from "../../utils/styles/dimensions";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import ShowLoader from "../../components/ShowLoder";
import { translate } from "../../utils/languageUtils/I18n";

const RecentTx = () => {
  const { get } = useAxiosHook();
  const [transactions, setTransactions] = useState([]);
  const [selectedTab, setSelectedTab] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentTransactions();
  }, [selectedTab]);

  const fetchRecentTransactions = async () => {
    setIsLoading(true);
    const res = await get({ url: `${APP_URLS.recentTx}${selectedTab}` });
    console.log(res, selectedTab);
    setIsLoading(false);
    setTransactions(res);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.date}>
            {new Date(item.Date).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.description}>{item.Description}</Text>
        <Text style={styles.amount}>Amount: ₹{item.Amount}</Text>
      </View>
    </View>
  );

  const handleTabPress = (tabValue) => {
    setSelectedTab(tabValue);
  };

  return (
    <View style={styles.screen}>
      <AppBarSecond
        title={"recent_transactions"}
        onActionPress={undefined}
        actionButton={undefined}
        onPressBack={undefined}
      />
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 5 && styles.activeTab]}
          onPress={() => handleTabPress(5)}
        >
          <Text style={styles.tabText}>{translate("top_5")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 10 && styles.activeTab]}
          onPress={() => handleTabPress(10)}
        >
          <Text style={styles.tabText}>{translate("top_10")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 50 && styles.activeTab]}
          onPress={() => handleTabPress(50)}
        >
          <Text style={styles.tabText}>{translate("top_50")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {transactions.length > 0 ? (
          <FlashList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.Idno.toString()}
            estimatedItemSize={100}
          />
        ) : (
          <Text style={styles.noDataText}>
            {translate("no_transactions_found")}
          </Text>
        )}
      </View>

      {isLoading && <ShowLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e9f7f7",
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hScale(15),
    marginBottom: hScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabButton: {
    paddingVertical: hScale(10),
    paddingHorizontal: wScale(15),
    borderRadius: 30,
  },
  tabText: {
    fontSize: hScale(16),
    color: "#333",
    fontWeight: "600",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#3b7d7b",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: hScale(20),
    paddingHorizontal: hScale(10),
  },
  card: {
    backgroundColor: "#ffffff",
    marginBottom: hScale(15),
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    padding: wScale(15),
  },
  cardContent: {
    flexDirection: "column",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(10),
  },
  username: {
    fontSize: hScale(16),
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: hScale(12),
    color: "#888",
  },
  description: {
    fontSize: hScale(14),
    color: "#555",
    marginVertical: hScale(5),
  },
  amount: {
    fontSize: hScale(16),
    fontWeight: "600",
    color: "#008000",
  },
  noDataText: {
    textAlign: "center",
    fontSize: hScale(18),
    color: "#888",
    marginTop: hScale(50),
  },
});

export default RecentTx;
