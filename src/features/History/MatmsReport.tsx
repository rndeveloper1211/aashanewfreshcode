import { translate } from "../../utils/languageUtils/I18n";
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
import NoDatafound from "../drawer/svgimgcomponents/Nodatafound";
import DynamicButton from "../drawer/button/DynamicButton";
import { RootState } from "../../reduxUtils/store";
import { colors, FontSize } from "../../utils/styles/theme";
import DateRangePicker from "../../components/DateRange";
import OnelineDropdownSvg from "../drawer/svgimgcomponents/simpledropdown";
import ShareSvg from "../drawer/svgimgcomponents/sharesvg";

const MatmReport = () => {
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const color1 = `${colorConfig.secondaryColor}20`;
  const [transactions, setTransactions] = useState([]);
  const [present, setPresent] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const { get } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  const currentDate = new Date();
  const [ddlStatus, setDdlStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [serchMO, setMo] = useState("ALL");

  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchnumber, setSearchnumber] = useState("");
  const [heightview, setHeightview] = useState(true);

  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
  }, []);
  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      setLoading(true);
      const formattedFrom = new Date(from).toISOString().split("T")[0];
      const formattedTo = new Date(to).toISOString().split("T")[0];
      const url2 = `${APP_URLS.dealermicroatm}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&userrole=Dealer`;
      const url = `${APP_URLS.matmReport}ddl_status=${status}&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`;
      console.log(IsDealer ? url2 : url);

      const response = await get({ url: IsDealer ? url2 : url });
      console.log(response);

      const transactionsData = response.Message || [];
      setTransactions(transactionsData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPresent((prev) => prev + 10);
  };
  const handlePress = (item) => {
    setHeightview(!heightview);
  };

  const TransactionDetails = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        style={[
          styles.card,
          {
            backgroundColor: color1,
            borderColor:
              item.status === "success" || item.status === "Success"
                ? "green"
                : item.status === "Failed" || item.status === "failed"
                  ? "red"
                  : "#e6b42c",
          },
        ]}
        onPress={() => handlePress(item)}
      >
        <View>
          <View style={styles.rowview}>
            <View>
              <Text style={styles.timetex}>
                Firm Name : {item.Frm_Name === "" ? "....." : item.Frm_Name}
              </Text>
              <Text style={styles.txntyp}>
                Txn Type :{" "}
                {item.transaction_type === "" ? "....." : item.transaction_type}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.statusText,
                  styles.textrit,
                  {
                    color:
                      item.status === "success" || item.status === "Success"
                        ? "green"
                        : item.status === "Failed" || item.status === "failed"
                          ? "red"
                          : "#e6b42c",
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.status}
              </Text>
              <Text style={[styles.amounttex, styles.textrit]}>
                ₹ {`${item.amount}.0`}
              </Text>
            </View>
          </View>

          <View style={[styles.rowview]}>
            <Text
              style={[
                styles.smstex,
                {
                  backgroundColor:
                    item.status === "success" || item.Status === "Success"
                      ? "green"
                      : item.status === "failed" || item.Status === "Failed"
                        ? "red"
                        : item.status === "Pending"
                          ? "orange"
                          : "deepPurple",
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(() => {
                switch (item.status) {
                  case "Success":
                  case "success":
                    return "Transaction Amount Paid Successfully";

                  case "Pending":
                    return "Your Transaction is in Queue or Pending";

                  case "Failed":
                  case "failed":
                    return "Your Transaction has Failed";

                  default:
                    return "";
                }
              })()}
            </Text>
          </View>

          <View style={[styles.rowview]}>
            <View>
              <Text style={styles.statusText}>{translate("Transaction_Mode")}</Text>
              <Text style={[styles.amounttex, { textTransform: "uppercase" }]}>
                {item.transaction_type ? item.transaction_type : "Mode..."}
              </Text>
            </View>
            <View style={styles.drporow}>
              <View
                style={[
                  { transform: [{ rotate: heightview ? "180deg" : "0deg" }] },
                ]}
              >
                <OnelineDropdownSvg />
              </View>
            </View>
          </View>
          <View style={[styles.border]} />

          <View style={styles.rowview}>
            <View>
              <Text style={styles.statusText}>{translate("Request_Time")}</Text>
              <Text style={styles.timetex}>{item.transtime}</Text>
            </View>
            <TouchableOpacity
              style={styles.shearbtn}
              //  onPress={onShare}
            >
              <ShareSvg size={wScale(20)} color="#000" />
              <Text
                style={[
                  styles.sheartext,
                  { backgroundColor: colorConfig.secondaryColor },
                ]}
              >{translate("Share")}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.border]} />

          <View style={styles.rowview}>
            <View>
              <Text style={styles.statusText}>{translate("Card_Number")}</Text>
              <Text style={styles.timetex}>{item.masked_pan}</Text>
            </View>
          </View>
          {heightview ? (
            <View>
              <View style={[styles.border]} />

              <View style={styles.rowview}>
                <Text style={[styles.statusText]}>{translate("Transaction_ID")}</Text>
                <Text style={[styles.timetex]}>
                  <Text style={[styles.statusText]}>Payment Mode</Text>
                </Text>
              </View>
              <View style={styles.rowview}>
                <Text style={[styles.statusText]}>
                  {item.transaction_id ? item.transaction_id : "..."}
                </Text>
                <Text style={[styles.timetex, styles.textrit]}>
                  {item.payment_method}
                </Text>
              </View>

              <View style={[styles.border]} />
              <View style={[styles.rowview]}>
                <View style={styles.blance}>
                  <Text style={[styles.statusText]}>{translate("Pre_Balance")}</Text>
                  <Text style={[styles.timetex]}>
                    ₹ {`${item.retailer_remain_pre}`}
                  </Text>
                </View>
                <View style={styles.blance}>
                  <Text style={[styles.statusText, { textAlign: "center" }]}>{translate("Network")}</Text>
                  <Text style={[styles.timetex, { textAlign: "center" }]}>
                    ₹ {`${item.network}`}
                  </Text>
                </View>

                <View style={[styles.blance, { borderRightWidth: 0 }]}>
                  <Text style={[styles.statusText, styles.textrit]}>{translate("Pos_Balance")}</Text>
                  <Text style={[styles.timetex, styles.textrit]}>
                    ₹ {`${item.retailer_remain_post}`}
                  </Text>
                </View>
              </View>
              <View style={[styles.border]} />

              <View style={[styles.rowview]}>
                <View style={styles.blance}>
                  <Text style={[styles.statusText]}>{translate("GST")}</Text>
                  <Text style={[styles.timetex]}>
                    ₹ {`${item.Retailer_gst}`}
                  </Text>
                </View>
                <View style={styles.blance}>
                  <Text style={[styles.statusText, { textAlign: "center" }]}>{translate("TDS")}</Text>
                  <Text style={[styles.timetex, { textAlign: "center" }]}>
                    ₹ {`${item.Retailer_tds}`}
                  </Text>
                </View>

                <View style={[styles.blance, { borderRightWidth: 0 }]}>
                  <Text style={[styles.statusText, styles.textrit]}>{translate("My_Earn")}</Text>
                  <Text style={[styles.timetex, styles.textrit]}>
                    ₹ {`${item.Retailer_comm}`}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const TransactionDetails2 = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        style={[
          styles.card,
          {
            backgroundColor: color1,
            borderColor:
              item.status === "success" || item.status === "Success"
                ? "green"
                : item.status === "Failed" || item.status === "failed"
                  ? "red"
                  : "#e6b42c",
          },
        ]}
        onPress={() => handlePress(item)}
      >
        <View>
          <View style={styles.rowview}>
            <View>
              <Text style={styles.timetex}>
                Firm Name : {item.Frm_Name === "" ? "....." : item.Frm_Name}
              </Text>
              <Text style={styles.txntyp}>
                Device id : {item.deviceid === "" ? "....." : item.deviceid}
              </Text>
            </View>
          </View>

          <View style={[styles.rowview]}>
            <View>
              <Text style={styles.statusText}>{translate("Plan_Name")}</Text>
              <Text style={[styles.amounttex, { textTransform: "uppercase" }]}>
                {item.planname ? item.planname : "..."}
              </Text>
            </View>
            <View style={styles.drporow}>
              <View
                style={[
                  { transform: [{ rotate: heightview ? "180deg" : "0deg" }] },
                ]}
              >
                <OnelineDropdownSvg />
              </View>
            </View>
          </View>
          <View style={[styles.border]} />

          <View style={styles.rowview}>
            <View>
              <Text style={styles.statusText}>{translate("Request_Time")}</Text>
              <Text style={styles.timetex}>{item.transdate}</Text>
            </View>
            <TouchableOpacity style={styles.shearbtn}>
              <ShareSvg size={wScale(20)} color="#000" />
              <Text
                style={[
                  styles.sheartext,
                  { backgroundColor: colorConfig.secondaryColor },
                ]}
              >{translate("Share")}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.border]} />

          <View style={styles.rowview}>
            <View>
              <Text style={styles.statusText}>{translate("Noof_Trans")}</Text>
              <Text style={styles.timetex}>{item.nooftrans}</Text>
            </View>
          </View>

          {heightview ? (
            <View>
              <View style={[styles.border]} />

              <View style={styles.rowview}>
                <Text style={[styles.statusText]}>
                  {item.transaction_id ? item.transaction_id : "..."}
                </Text>
                <Text style={[styles.timetex, styles.textrit]}>
                  {item.payment_method}
                </Text>
              </View>

              <View style={[styles.border]} />
              <View style={[styles.rowview]}>
                <View style={styles.blance}>
                  <Text style={[styles.statusText]}>{translate("Pre_Balance")}</Text>
                  <Text style={[styles.timetex]}>₹ {`${item.dlmpre}`}</Text>
                </View>
                {/* <View style={styles.blance}>
                  <Text style={[styles.statusText, { textAlign: 'center' }]}>{translate("Network")}</Text>
                  <Text style={[styles.timetex, { textAlign: 'center' }]}>₹ {`${item.network}`}</Text>
                </View> */}

                <View style={[styles.blance, { borderRightWidth: 0 }]}>
                  <Text style={[styles.statusText, styles.textrit]}>{translate("Pos_Balance")}</Text>
                  <Text style={[styles.timetex, styles.textrit]}>
                    ₹ {`${item.dlmpost}`}
                  </Text>
                </View>
              </View>
              <View style={[styles.border]} />

              <View style={[styles.rowview]}>
                <View style={styles.blance}>
                  <Text style={[styles.statusText]}>{translate("GST")}</Text>
                  <Text style={[styles.timetex]}>₹ {`${item.dlmgst}`}</Text>
                </View>
                <View style={styles.blance}>
                  <Text style={[styles.statusText, { textAlign: "center" }]}>{translate("TDS")}</Text>
                  <Text style={[styles.timetex, { textAlign: "center" }]}>
                    ₹ {`${item.dlmtds}`}
                  </Text>
                </View>

                <View style={[styles.blance, { borderRightWidth: 0 }]}>
                  <Text style={[styles.statusText, styles.textrit]}>{translate("Commission")}</Text>
                  <Text style={[styles.timetex, styles.textrit]}>
                    ₹ {`${item.dlmcomm}`}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <AppBarSecond
        title={!IsDealer ? "m-ATM History" : "Micro Atm Rental Report"}
      />
      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        searchnumber={searchnumber}
        setSearchnumber={setSearchnumber}
        isshowRetailer={false}
        isStShow={true}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : transactions.length === 0 ? (
          <NoDatafound />
        ) : (
          <FlatList
            data={transactions.slice(0, present)}
            renderItem={({ item }) =>
              IsDealer ? (
                <TransactionDetails2 item={item} />
              ) : (
                <TransactionDetails item={item} />
              )
            }
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={
              transactions.length > present ? (
                <DynamicButton onPress={handleLoadMore} />
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
    fontSize: wScale(18),
    color: "#000",
    fontWeight: "bold",
  },
  statusText: {
    fontSize: FontSize.small,
    color: "#000",
    fontWeight: "bold",
    flex: 1,
  },
  timetex: {
    fontSize: FontSize.regular,
    color: "#000",
  },
  txntyp: {
    fontSize: FontSize.medium,
    color: "#000",
  },
  dropview: {
    paddingRight: wScale(10),
  },
  textrit: {
    textAlign: "right",
  },
  drporow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    letterSpacing: wScale(3),
    textAlign: "center",
    flex: 1,
    marginVertical: hScale(2),
    paddingHorizontal: wScale(5),
  },
  blance: {
    flex: 1,
    borderRightWidth: wScale(0.7),
    borderColor: colors.black75,
  },
});

export default MatmReport;
