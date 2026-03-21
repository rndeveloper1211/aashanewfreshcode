import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { useSelector } from "react-redux";
import { hScale, wScale } from "../../utils/styles/dimensions";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import DateRangePicker from "../../components/DateRange";
import { RootState } from "../../reduxUtils/store";
import NoDatafound from "../drawer/svgimgcomponents/Nodatafound";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import ShareSvg from "../drawer/svgimgcomponents/sharesvg";
import { FontSize } from "../../utils/styles/theme";
import { translate } from "../../utils/languageUtils/I18n";

const MPosScreenR = () => {
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const color1 = `${colorConfig.secondaryColor}20`;
  const [present, setPresent] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");

  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchnumber, setSearchnumber] = useState("");
  const [heightview, setHeightview] = useState(false);

  const { get, post } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
  }, []);

  const handlePress = (item) => {
    setHeightview(!heightview);
  };

  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split("T")[0];
      const formattedTo = new Date(to).toISOString().split("T")[0];
      const url2 = `${APP_URLS.dealer_Rem_m_possreport}ddl_status=All&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&allretailer=${selectedRetailerId}`;
      const url = `${APP_URLS.mposRrport}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&Type=`;
      if (IsDealer) {
        const response = await get({ url: url2 });
        setTransactions(IsDealer ? response : response.data || []);
      } else {
        const response = await post({ url: url });
        setTransactions(IsDealer ? response : response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPresent((prev) => prev + 10);
  };
  const onShare = async (item) => {
    const pdfOptions = {
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 20px;
                background-color: #f0f8ff;
                color: #333;
              }
              h1 {
                text-align: center;
                color: #2e8b57;
                margin-bottom: 20px;
                font-size: 24px;
                text-shadow: 1px 1px 2px #aaa;
              }
              .container {
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 8px;
                background-color: #ffffff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                margin-bottom: 20px;
              }
              .row {
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
              }
              .row strong {
                color: #2e8b57;
              }
              p {
                line-height: 1.6;
                margin: 10px 0;
                font-size: 16px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 0.9em;
                color: #555;
                border-top: 1px solid #ccc;
                padding-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${APP_URLS.AppName}</h1>
              <h1>${translate("Transaction Details")}</h1>
              <div class="row">
                <strong>${translate("Transaction ID")}</strong>
                <span>${item.TxnId}</span>
              </div>
              <div class="row">
                <strong>${translate("RRN")}</strong>
                <span>${item.rrn}</span>
              </div>
              <div class="row">
                <strong>${translate("Status")}</strong>
                <span>${item.status}</span>
              </div>
              <div class="row">
                <strong>${translate("Merchant ID")}</strong>
                <span>${item.merchant_id}</span>
              </div>
              <div class="row">
                <strong>${translate("Amount")}</strong>
                <span>₹ ${item.amount}</span>
              </div>
            </div>
            <div class="footer">
              <p>${translate("Thank you for choosing our service!")}</p>
            </div>
          </body>
        </html>
      `,
      fileName: "TransactionDetails",
      directory: "Documents",
    };

    try {
      const file = await RNHTMLtoPDF.convert(pdfOptions);
      await sharePDF(file.filePath);
    } catch (error) {
      console.error(error);
      Alert.alert(translate("Error"), translate("Failed to generate PDF."));
    }
  };
  const onShareMultiple = async (items) => {
    const transactionRows = items
      .map(
        (item) => `
      <div class="row">
        <strong>${translate("Retailer Name")}</strong>
        <span>${item.RetailerName}</span>
      </div>
      <div class="row">
        <strong>${translate("Date")}</strong>
        <span>${item.date}</span>
      </div>
      <div class="row">
        <strong>${translate("Type")}</strong>
        <span>${item.transType}</span>
      </div>
      <div class="row">
        <strong>${translate("Status")}</strong>
        <span>${item.status}</span>
      </div>
      <div class="row">
        <strong>${translate("Amount")}</strong>
        <span>₹ ${item.amount}</span>
      </div>
      <div class="row">
        <strong>${translate("Retailer Comm")}</strong>
        <span>₹ ${item.remincome}</span>
      </div>
      <div class="row">
        <strong>${translate("Total Amount")}</strong>
        <span>₹ ${item.totalamount}</span>
      </div>
      <hr />
    `,
      )
      .join("");

    const pdfOptions = {
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 20px;
                background-color: #f0f8ff;
                color: #333;
              }
              h1 {
                text-align: center;
                color: #2e8b57;
                margin-bottom: 20px;
                font-size: 24px;
              }
              .container {
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 8px;
                background-color: #ffffff;
                margin-bottom: 20px;
              }
              .row {
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
              }
              .row strong {
                color: #2e8b57;
              }
              hr {
                border: 1px solid #ccc;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${translate("Transaction Details")}</h1>
              ${transactionRows}
            </div>
            <div class="footer">
              <p>${translate("Thank you for choosing our service!")}</p>
            </div>
          </body>
        </html>
      `,
      fileName: "TransactionDetails",
      directory: "Documents",
    };

    try {
      const file = await RNHTMLtoPDF.convert(pdfOptions);
      await sharePDF(file.filePath);
    } catch (error) {
      console.error(error);
      Alert.alert(translate("Error"), translate("Failed to generate PDF."));
    }
  };
  const sharePDF = async (filePath) => {
    const options = {
      title: translate("Share PDF"),
      url: `file://${filePath}`,
      type: "application/pdf",
      message: translate("key_pleasefin_74"),
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert(translate("Error"), translate("Failed to share the PDF."));
    }
  };
  const TransactionDetails = ({ item }) => {
    return (
      <View style={[styles.card, { backgroundColor: color1 }]}>
        <View style={styles.tileHeader}>
          <View style={styles.tileTitle}>
            <Text style={styles.text}>
              {translate("Transaction ID")}: ${item.TxnId}
            </Text>
            <Text style={styles.textBold}>
              {translate("RRN")}: ${item.rrn}
            </Text>
            <Text style={styles.text}>
              {translate("Status")}: ${item.status}
            </Text>
            <Text style={styles.text}>
              {translate("Merchant ID")}: ${item.merchant_id}
            </Text>
          </View>
          <View style={styles.tileStatus}>
            <Icon
              name={
                item.status === "Success" || item.status === "SUCCESS"
                  ? "checkmark-circle"
                  : item.status === "M_Pending"
                    ? "time"
                    : item.status === "Failed" || item.status === "FAILED"
                      ? "close-circle"
                      : "cash"
              }
              size={14}
              color={
                item.status === "Success" || item.status === "SUCCESS"
                  ? "green"
                  : item.status === "M_Pending"
                    ? "yellow"
                    : item.status === "Failed" || item.status === "FAILED"
                      ? "red"
                      : "orange"
              }
            />
            <Text style={styles.text}>{translate(item.status)}</Text>
            <Text style={styles.textBold}>{`\u{20B9} ${item.amount}`}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shearbtn} onPress={() => onShare(item)}>
          <ShareSvg size={wScale(20)} color="#000" />
          <Text
            style={[
              styles.sheartext,
              { backgroundColor: colorConfig.secondaryColor },
            ]}
          >
            {translate("Share")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const DealerItem = ({ item }) => {
    return (
      <View style={[styles.card, { backgroundColor: color1 }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            {item.status === "Pending" ? (
              <Ionicons name="time-sharp" color="#CA8215" size={20} />
            ) : item.status === "SUCCESS" ? (
              <AntDesign name="checkcircle" color="#3C9A16" size={20} />
            ) : (
              <FontAwesome name="times-circle-o" color="#ff0000" size={20} />
            )}
            <View style={styles.column}>
              <Text style={styles.textSmall}>{translate("Name")}</Text>
              <Text style={styles.textBold}>
                {item.RetailerName || translate("Not Available")}
              </Text>
            </View>
          </View>
          <View style={styles.columnRight}>
            <Text style={styles.textSmall}>{translate("Date")}</Text>
            <Text style={styles.textBold}>{item.date || "0 0 0"}</Text>
          </View>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.row}>
          <View style={styles.expandedColumn}>
            <Text style={styles.textSmall}>{translate("Type")}</Text>
            <Text style={styles.textBold}>{item.transType}</Text>
          </View>
          <View style={styles.expandedColumn}>
            <Text style={styles.textSmall}>{translate("Amount")}</Text>
            <Text style={styles.textBold}>₹ {item.amount}</Text>
          </View>
          <View style={styles.expandedColumn}>
            <Text style={styles.textSmall}>{translate("Retailer Comm")}</Text>
            <Text style={styles.textBold}>₹ {item.remincome}</Text>
          </View>
          <View style={[styles.expandedColumn, { borderRightWidth: 0 }]}>
            <Text style={styles.textSmall}>{translate("Total Amount")}</Text>
            <Text style={styles.textBold}>₹ {item.totalamount}</Text>
          </View>

          <TouchableOpacity
            style={styles.shearbtn}
            onPress={() => onShareMultiple(item)}
          >
            <ShareSvg size={wScale(20)} color="#000" />
            <Text
              style={[
                styles.sheartext,
                { backgroundColor: colorConfig.secondaryColor },
              ]}
            >
              {translate("Share")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <AppBarSecond title={"M_pos History"} />
      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        isshowRetailer={IsDealer}
        retailerID={(id) => {
          recentTransactions(
            selectedDate.from,
            selectedDate.to,
            (status = "ALL"),
          );
          console.log(id); // You can still log it for debugging
          setSelectedRetailerId(id); // Store the selected retailer ID
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colorConfig.secondaryButtonColor}
          />
        ) : transactions.length === 0 ? (
          <NoDatafound />
        ) : (
          <FlatList
            data={transactions.slice(0, present)}
            renderItem={({ item }) =>
              !IsDealer ? (
                <TransactionDetails item={item} />
              ) : (
                <DealerItem item={item} />
              )
            }
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={
              transactions.length > present ? (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                >
                  <Text style={styles.loadMoreText}>
                    {translate("Load More")}
                  </Text>
                </TouchableOpacity>
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
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hScale(7),
  },
  button: {
    flex: 1,
    marginHorizontal: hScale(5),
    paddingVertical: hScale(17),
    borderRadius: hScale(5),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: hScale(17),
  },
  loadMoreButton: {
    backgroundColor: "gray",
    padding: 10,
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 5,
  },
  loadMoreText: {
    color: "white",
  },
  tileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
  },
  tileTitle: {
    flex: 1,
  },
  tileStatus: {
    flex: 1,
    alignItems: "flex-end",
  },
  text: {
    fontSize: 12,
  },
  textBold: {
    fontSize: 12,
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    marginVertical: hScale(20),
    fontSize: hScale(16),
    color: "red",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    marginLeft: 10,
  },
  columnRight: {
    alignItems: "flex-end",
  },
  expandedColumn: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 5,
  },
  textSmall: {
    fontSize: 10,
  },

  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  shearbtn: {
    alignItems: "center",
  },
  sheartext: {
    fontSize: FontSize.tiny,
    color: "#FFF",
    paddingHorizontal: wScale(4),
    borderRadius: 10,
    paddingVertical: hScale(2),
  },
});

export default MPosScreenR;
