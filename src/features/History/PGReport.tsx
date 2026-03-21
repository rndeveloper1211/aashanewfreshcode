import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  TextInput,
} from "react-native";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { useSelector } from "react-redux";
import { hScale, wpScale, wScale } from "../../utils/styles/dimensions";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import { RootState } from "../../reduxUtils/store";
import { FontSize } from "../../utils/styles/theme";
import OnelineDropdownSvg from "../drawer/svgimgcomponents/simpledropdown";
import ShareSvg from "../drawer/svgimgcomponents/sharesvg";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import DateRangePicker from "../../components/DateRange";
import DynamicButton from "../drawer/button/DynamicButton";
import NoDatafound from "../drawer/svgimgcomponents/Nodatafound";
import { FlashList } from "@shopify/flash-list";
import { translate } from "../../utils/languageUtils/I18n";

const PaymentGReport = () => {
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const color1 = `${colorConfig.secondaryColor}20`;

  const [transactions, setTransactions] = useState([]);
  const [present, setPresent] = useState(10);
  const [loading, setLoading] = useState(false);
  const [heightview, setHeightview] = useState(false);
  const { post } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  const currentDate = new Date();

  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [id, setID] = useState("ALL");
  const capRef = useRef();
  const [pin, setPin] = useState("");
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [act, setAction] = useState("");
  const handleChangeStatus = async (status, index, item, pin, act) => {
    const res = await post({
      url: `${APP_URLS.UPI_Manual_Pending_To_Success}hideupiidres=${item.idno}&hideupiidrestypes=${act}&txtBankRRN=${act == "APPROVED" ? item.BankRRN : ""}&txtcode=${pin}`,
    });
    console.log(res, "**********");

    if (res) {
      ToastAndroid.show(res.Message, ToastAndroid.LONG);
    } else {
      ToastAndroid.show(
        res.Message || translate("try again "),
        ToastAndroid.LONG,
      );
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTextInputVisible(false);
    }, 2000);
  };
  const recentTransactions = async (from, to, status, id) => {
    try {
      const formattedFrom = new Date(from).toISOString().split("T")[0];
      const formattedTo = new Date(to).toISOString().split("T")[0];
      setLoading(true);

      const url = `${APP_URLS.PaymentGateway}ddlstatus=${status}&pagesize=500&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`;
      const url2 = `${APP_URLS.Get_UPI_DealerTransfer_History}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&Retailerid=${id}&ddlstatus=${status}`; // Fixed the '&' here

      const requestUrl = IsDealer ? url2 : url;
      console.log(requestUrl);
      const response = await post({ url: requestUrl });

      console.log(response, "**********************");
      if (response) {
        const transactionsData = response.RESULT || [];
        setTransactions(IsDealer ? response.Upitxn_Details : transactionsData);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus, id);
  }, [selectedDate, selectedStatus]);

  const handleLoadMore = () => {
    setPresent((prev) => prev + 10);
  };
  const handlebtn = (item) => {
    setHeightview(!heightview);
  };

  const TransactionDetails = ({ item }) => {
    const getStatusIcon = (status) => {
      switch (status) {
        case "Success":
          return "check-circle";
        case "Failed":
          return "error";
        case "Pending":
          return "hourglass-empty";
        default:
          return "help-outline";
      }
    };
    const onShare = useCallback(async () => {
      try {
        const uri = await captureRef(capRef, {
          format: "jpg",
          quality: 0.7,
        });
        await Share.open({
          message: translate(
            `key_hiiams_47 ${APP_URLS.AppName} App.`,
          ),
          url: uri,
        });
      } catch (e) {
        ToastAndroid.show(
          translate("Transaction details not shared"),
          ToastAndroid.SHORT,
        );
      }
    }, []);

    return (
      <ViewShot
        ref={capRef}
        options={{
          fileName: translate("TransactionReciept"),
          format: "jpg",
          quality: 0.9,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.card,
            {
              backgroundColor: color1,
              borderColor:
                item.status === "Success"
                  ? "green"
                  : item.status === "Failed"
                    ? "red"
                    : "#e6b42c",
            },
          ]}
          onPress={() => handlebtn(item)}
        >
          <View>
            <View style={styles.tileTitle}>
              <View style={styles.rowview}>
                <Text style={styles.statusText}>
                  {translate(`Firm Name: ${item.Frm_Name}`)}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === "Success"
                          ? "green"
                          : item.status === "Failed"
                            ? "red"
                            : "#e6b42c",
                    },
                  ]}
                >
                  {translate(item.status)}
                </Text>
              </View>

              <View style={[styles.rowview]}>
                <Text style={styles.timetex}>
                  {translate(`Txn Type : ${item.PG_TYPE}`)}
                </Text>
                <Text
                  style={[
                    styles.amounttex,
                    {
                      color:
                        item.status === "Success"
                          ? "green"
                          : item.status === "Failed"
                            ? "red"
                            : "#e6b42c",
                    },
                  ]}
                >
                  ₹ {`${item.amount}`}
                </Text>
              </View>

              <View style={[styles.border]} />

              <View style={[styles.rowview]}>
                <View>
                  <Text style={styles.statusText}>
                    {translate(`Bank RRN ${item.PG_TYPE}`)}
                  </Text>
                  <Text style={styles.amounttex}>
                    {item.bankrrnno ? item.bankrrnno : translate("BankRRN")}
                  </Text>
                </View>
                <View
                  style={{
                    transform: [{ rotate: heightview ? "180deg" : "0deg" }],
                  }}
                >
                  <OnelineDropdownSvg />
                </View>
              </View>
              <Text
                style={[
                  styles.smstex,
                  {
                    backgroundColor:
                      item.status === "Success"
                        ? "green"
                        : item.status === "Failed"
                          ? "red"
                          : "#e6b42c",
                  },
                ]}
              >
                translate('Your Transaction in Queue or'){" "}
                {translate(item.status)}
              </Text>

              <View style={styles.rowview}>
                <View>
                  <Text style={styles.timetex}>
                    {translate("Request Time")}
                  </Text>
                  <Text
                    style={styles.timetex}
                  >{`${new Date(item.f_date).toLocaleString()}`}</Text>
                </View>
                <TouchableOpacity style={styles.shearbtn} onPress={onShare}>
                  <ShareSvg size={wScale(20)} color="#000" />
                  <Text
                    style={[
                      styles.sheartext,
                      { backgroundColor: colorConfig.secondaryColor },
                    ]}
                  >
                    {translate("share")}
                  </Text>
                </TouchableOpacity>
              </View>

              {heightview ? (
                <View>
                  <View style={[styles.border]} />
                  <View style={[styles.rowview]}>
                    <Text style={styles.timetex}>
                      {translate("Transaction ID")}
                    </Text>
                    <Text style={styles.timetex}>
                      {translate("Payment Mode")}
                    </Text>
                  </View>
                  <View style={[styles.rowview]}>
                    <Text style={[styles.amounttex]}>{`${item.txnid}`}</Text>
                    <Text style={[styles.amounttex]}>{`${item.mode}`}</Text>
                  </View>

                  <View style={[styles.border]} />
                  <View style={[styles.rowview]}>
                    <Text style={styles.timetex}>
                      {translate("Pre Balance")}
                    </Text>
                    <Text style={styles.timetex}>
                      {translate("Post Balance")}
                    </Text>
                  </View>

                  <View style={[styles.rowview]}>
                    <Text style={[styles.amounttex]}>
                      ₹ {`${item.remainpre}`}
                    </Text>
                    <Text style={[styles.amounttex]}>
                      ₹ {`${item.remainpost}`}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </ViewShot>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.card, { backgroundColor: color1 }]}>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.label}>{translate("Name")}</Text>
            <Text style={styles.boldText}>
              {item.RetailerName || translate("Not Available")}
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.label}>{translate("Date")}</Text>
            <Text style={styles.boldText}>
              {item.txndate || translate("0 0 0")}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.label}>{translate("Remain Pre")}</Text>
            <Text style={styles.boldText}>₹ {item.remainpre}</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.label}>{translate("Charge")}</Text>
            <Text style={styles.boldText}>₹ {item.charge}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.label}>{translate("Pay")}</Text>
            <Text style={styles.boldText}>₹ {item.finalpay}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.label}>{translate("Remain Post")}</Text>
            <Text style={styles.boldText}>₹ {item.remainpost}</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.label}>{translate("Bank RRN")}</Text>
            <Text style={styles.boldText}>{item.BankRRN}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.label}>{translate("Amount")}</Text>
            <Text style={styles.boldText}>₹ {item.amt}</Text>
          </View>
        </View>

        {item.status === "Pending" && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                setAction("APPROVED");

                setTextInputVisible(true);
                setClickedIndex(index);
              }}
            >
              <Text style={styles.buttonText}>
                {loading
                  ? translate("Loading...")
                  : translate("Mark as SUCCESS")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#a6242d" }]}
              onPress={() => {
                setAction("REJECTED");
                setClickedIndex(index);
                setTextInputVisible(true);
              }}
            >
              <Text style={styles.buttonText}>
                {loading
                  ? translate("Loading...")
                  : translate("Mark as FAILED")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {clickedIndex === index && textInputVisible && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: colorConfig.primaryButtonColor },
              ]}
              placeholder={translate("Enter Transaction PIN")}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity
              style={[
                styles.buttonsubmit,
                { backgroundColor: colorConfig.primaryButtonColor },
              ]}
              onPress={() => {
                handleChangeStatus(
                  item.status === "Pending" ? "SUCCESS" : "FAILED",
                  index,
                  item,
                  pin,
                  act,
                );
              }}
            >
              <Text style={styles.sibmittext}>
                {loading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  const [clickedIndex, setClickedIndex] = useState(null);
  const delHistory = [
    {
      idno: "123456",
      RetailerName: "Retailer A",
      status: "SUCCESS",
      txndate: "2025-01-28",
      remainpre: 5000,
      charge: 50,
      finalpay: 4950,
      remainpost: 3000,
      BankRRN: "987654321",
      amt: 5000,
    },
    {
      idno: "789101",
      RetailerName: "Retailer B",
      status: "Pending",
      txndate: "2025-01-27",
      remainpre: 3000,
      charge: 30,
      finalpay: 2970,
      remainpost: 1000,
      BankRRN: "112233445",
      amt: 3000,
    },
    {
      idno: "112233",
      RetailerName: "Retailer C",
      status: "Refund",
      txndate: "2025-01-26",
      remainpre: 1000,
      charge: 10,
      finalpay: 990,
      remainpost: 500,
      BankRRN: "667788990",
      amt: 1000,
    },
  ];

  return (
    <View style={styles.main}>
      <AppBarSecond
        title={IsDealer ? "Add Money Report" : "Payment Gateway History"}
      />
      <DateRangePicker
        isshowRetailer={IsDealer}
        isStShow={true}
        onDateSelected={(from, to) => {
          setSelectedDate({ from, to });
        }}
        SearchPress={(from, to, status) => {
          recentTransactions(from, to, status, id);
        }}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        retailerID={(id) => {
          console.log(id);

          setID(id);
          recentTransactions(
            selectedDate.from,
            selectedDate.to,
            selectedStatus,
            id,
          );
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : transactions.length === 0 ? (
          <NoDatafound />
        ) : (
          <>
            {IsDealer ? (
              <FlashList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.idno.toString()}
                estimatedItemSize={100}
              />
            ) : (
              <FlatList
                data={transactions.slice(0, present)}
                renderItem={({ item }) => <TransactionDetails item={item} />}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={
                  transactions.length > present ? (
                    <DynamicButton title="Load More" onPress={handleLoadMore} />
                  ) : null
                }
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: wScale(15),
    paddingVertical: wScale(15),
  },
  card: {
    marginBottom: hScale(16),
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
    paddingVertical: hScale(4),
  },

  frmname: {
    fontSize: FontSize.small,
    color: "#333",
    fontWeight: "bold",
  },
  amounttex: {
    fontSize: FontSize.regular,
    color: "#000",
    fontWeight: "bold",
  },
  statusText: {
    fontSize: FontSize.small,
    color: "#000",
  },
  timetex: {
    fontSize: FontSize.regular,
    color: "#000",
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
  smstex: {
    fontSize: FontSize.teeny,
    color: "#FFF",
    letterSpacing: wScale(1),
    textAlign: "center",
    flex: 1,
    marginVertical: hScale(4),
  },
  text: {
    fontSize: hScale(14),
    color: "#666",
    marginVertical: hScale(2),
  },

  tileTitle: {
    flex: 1,
  },
  tileStatus: {
    alignItems: "flex-end",
  },

  loadMoreButton: {
    backgroundColor: "#4CAF50",
    padding: hScale(10),
    alignItems: "center",
    marginVertical: hScale(16),
    borderRadius: 5,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: hScale(16),
  },
  noDataText: {
    textAlign: "center",
    marginVertical: hScale(20),
    fontSize: hScale(18),
    color: "#D32F2F",
  },

  //////////////////////////////////

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  leftColumn: {
    flex: 1,
  },
  centerColumn: {
    flex: 1,
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 10,
    color: "#555",
  },
  boldText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 8,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#489635",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: hScale(40),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  buttonsubmit: {
    height: hScale(40),
    alignItems: "center",
    position: "absolute",
    right: 0,
    textAlign: "center",
    justifyContent: "center",
    paddingHorizontal: wScale(15),
    borderRadius: 5,
  },
  sibmittext: {
    color: "white",
    fontWeight: "bold",
    textAlignVertical: "center",
  },
});

export default PaymentGReport;
