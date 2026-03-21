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
  Linking,
} from "react-native";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { useSelector } from "react-redux";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import { hScale, wScale } from "../../utils/styles/dimensions";
import DateRangePicker from "../../components/DateRange";
import { colors, FontSize } from "../../utils/styles/theme";
import NoDatafound from "../drawer/svgimgcomponents/Nodatafound";
import OnelineDropdownSvg from "../drawer/svgimgcomponents/simpledropdown";
import ShareSvg from "../drawer/svgimgcomponents/sharesvg";
import { RootState } from "../../reduxUtils/store";
import CheckBalSvg from "../drawer/svgimgcomponents/CheckBlreporSvg";
import AadharReporSvg from "../drawer/svgimgcomponents/AadharReporSvg";
import MStateMentReporSvg from "../drawer/svgimgcomponents/MStateMentReporSvg";
import AepsReportSvg from "../drawer/svgimgcomponents/AepsReportSvg";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Fontisto from "react-native-vector-icons/Fontisto";
import { translate } from "../../utils/languageUtils/I18n";

const AEPSAdharPayR = () => {
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const color1 = `${colorConfig.secondaryColor}20`;
  const { get } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  const currentDate = new Date();
  const [ddlStatus, setDdlStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [serchMO, setMo] = useState("ALL");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchnumber, setSearchnumber] = useState("");
  const [heightview, setHeightview] = useState(false);
  const delHistory = [
    {
      Status: "Pending",
      RetailerName: "Retailer 1",
      Txn_Date: "2025-01-25",
      AccountHolderAadhaar: "1234 5678 9101",
      Amount: 1000,
      Type: "Credit",
      BankRRN: "UTR123456789",
    },
    {
      Status: "Success",
      RetailerName: "Retailer 2",
      Txn_Date: "2025-01-26",
      AccountHolderAadhaar: "2345 6789 1012",
      Amount: 5000,
      Type: "Debit",
      BankRRN: "UTR987654321",
    },
    {
      Status: "Refund",
      RetailerName: "Retailer 3",
      Txn_Date: "2025-01-27",
      AccountHolderAadhaar: "3456 7890 1123",
      Amount: 2000,
      Type: "Refund",
      BankRRN: "UTR192837465",
    },
    {
      Status: "Balance",
      RetailerName: "Retailer 4",
      Txn_Date: "2025-01-28",
      AccountHolderAadhaar: "4567 8901 1234",
      Amount: 3500,
      Type: "Credit",
      BankRRN: "UTR564738291",
    },
  ];

  const [filePath, setFilePath] = useState("");
  useEffect(() => {
    recentTransactions(
      selectedDate.from,
      selectedDate.to,
      selectedStatus,
      "ALL",
    );
  }, []);

  const recentTransactions = async (from, to, status, id) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split("T")[0];
      const formattedTo = new Date(to).toISOString().split("T")[0];

      const url2 = `${APP_URLS.dealer_Rem_AepsReport}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&allretailer=${id}&ddl_status=${ddlStatus}`;
      const url = `${APP_URLS.aepsReport}pageindex=1&pagesize=500&userid=${userId}&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&ddl_status=${ddlStatus}&amount=&BankId=&aadhar=&Type=${type}&userserch_acc_mob=${serchMO}`;
      const response = await get({ url: IsDealer ? url2 : url });
      console.log(url2);
      console.log(response);
      setTransactions(response || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePress = (item) => {
    setHeightview(!heightview);
  };
  const capRef = useRef();
  // const onShare = useCallback(async () => {
  //   try {

  //     const filename = `TXN-Reciept-${APP_URLS.AppName}.jpg`;

  //     const uri = await captureRef(capRef, {
  //       format: 'jpg',
  //       quality: 0.7,
  //       result: 'tmpfile',
  //     });

  //     await Share.open({
  //       message: `key_hiiams_47 ${APP_URLS.AppName} App.`,
  //       url: uri,
  //       filename: filename,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     ToastAndroid.show("Transaction details not shared", ToastAndroid.SHORT);
  //   }
  // }, []);
  const getStatusMessage = (status) => {
    let message = "";

    switch (status) {
      case "Done":
        message =
          "T r a n s a c t i o n     A m o u n t    P a i d    S u c c e s s f u l l y";
        break;
      case "M_Success":
        message =
          "M i n i  -  S t a t e m e n t  C h e c k e d   S u c c e s s f u l l y";
        break;
      case "M_Failed":
        message = "M i n i  -  S t a t e m e n t  C h e c k e d  F a i l e d";
        break;
      case "Pending":
        message =
          "Y o u r   T r a n s a c t i o n   i n  Q u e u e   o r   P e n d i n g";
        break;
      case "Failed":
        message =
          "Y  o  u r    T r a n s a c t i o n    i s    F  a  i  l  e  d";
        break;
      case "Balance":
        message = "B a l a n c e   E n q u i r y";
        break;
      default:
        message = "Status Unknown";
        break;
    }

    return message;
  };

  const renderItem = ({ item }) => (
    <ViewShot
      ref={capRef}
      style={{ flex: 1, backgroundColor: "white" }}
      options={{ format: "jpg", quality: 0.7 }}
    >
      <TouchableOpacity
        activeOpacity={0.4}
        style={[
          styles.card,
          {
            backgroundColor: color1,
            borderColor:
              item.Status === "Success" ||
              item.Status === "Done" ||
              item.Status === "M_Success"
                ? "green"
                : item.Status === "FAILED" || item.Status === "M_Failed"
                  ? "red"
                  : "#e6b42c",
          },
        ]}
        onPress={() => handlePress(item)}
      >
        <View>
          <View style={styles.rowview}>
            <View style={styles.drporow}>
              {item.TYPE === "Balance" ? (
                <CheckBalSvg />
              ) : item.TransactionType === "Aadhar Pay" ? (
                <AadharReporSvg />
              ) : item.TYPE === "Mini StateMent" ? (
                <MStateMentReporSvg />
              ) : (
                <AepsReportSvg />
              )}
              <View style={styles.bankInfoContainer}>
                {IsDealer ? (
                  <Text
                    style={styles.timetex}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.RetailerName === "" ? "No Name" : item.RetailerName}
                  </Text>
                ) : (
                  <Text
                    style={styles.timetex}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.BankName === "" ? "No Name" : item.BankName}
                  </Text>
                )}
                {IsDealer ? (
                  <Text style={styles.statusText}>
                    {item.BankRRN === "" ? "....." : item.BankRRN}
                  </Text>
                ) : (
                  <Text style={styles.statusText}>
                    {item.BankId === "" ? "....." : item.BankId}
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Text
                style={[
                  styles.statusText,
                  styles.textrit,
                  {
                    color:
                      item.Status === "Success" ||
                      item.Status === "Done" ||
                      item.Status === "M_Success"
                        ? "green"
                        : item.Status === "Failed" || item.Status === "M_Failed"
                          ? "red"
                          : "#e6b42c",
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.Status == "Done"
                  ? "Success"
                  : item.Status == "Balance"
                    ? "Balance Enquiry"
                    : item.Status == "M_Success"
                      ? "Success"
                      : item.Status == "M_Failed"
                        ? "Failed"
                        : item.Status == "Failed"
                          ? "Failed"
                          : item.Status}
              </Text>
              <Text style={[styles.amounttex, styles.textrit]}>
                ₹ {`${item.Amount}`}
              </Text>
            </View>
          </View>

          <View style={[styles.border]} />

          <View style={[styles.rowview]}>
            {!IsDealer && (
              <View>
                <Text style={styles.statusText}>{translate("Mobile No")}</Text>
                <Text style={styles.amounttex}>
                  {item.Mobile
                    ? translate(item.Mobile)
                    : translate("Mobile...")}
                </Text>
              </View>
            )}

            <View style={styles.drporow}>
              <View style={styles.dropview}>
                <Text style={[styles.statusText, styles.textrit]}>
                  {translate("Consumer Aadhar")}
                </Text>
                <Text style={[styles.amounttex, styles.textrit]}>
                  {IsDealer
                    ? translate(item.AccountHolderAadhaar)
                    : translate(item.AccountHolderAadhar)}
                </Text>
              </View>
              <View
                style={[
                  { transform: [{ rotate: heightview ? "180deg" : "0deg" }] },
                ]}
              >
                <OnelineDropdownSvg />
              </View>
            </View>
          </View>

          <View style={[styles.rowview]}>
            <Text
              style={[
                styles.smstex,
                {
                  backgroundColor:
                    item.Status === "Success" ||
                    item.Status === "Done" ||
                    item.Status === "M_Success"
                      ? "green"
                      : item.Status === "Failed"
                        ? "red"
                        : item.Status === "M_Failed"
                          ? "brown"
                          : "#e6b42c",
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(() => {
                switch (item.Status) {
                  case "Done":
                    return "T r a n s a c t i o n     A m o u n t    P a i d    S u c c e s s f u l l y";
                  case "M_Success":
                    return "M i n i  -  S t a t e m e n t  C h e c k e d   S u c c e s s f u l l y";
                  case "M_Failed":
                    return "M i n i  -  S t a t e m e n t  C h e c k e d  F a i l e d";
                  case "Pending":
                    return "Y o u r   T r a n s a c t i o n   i n  Q u e u e   o r   P e n d i n g";
                  case "Failed":
                    return "Y  o  u r    T r a n s a c t i o n    is    F  a  i  l  e  d";
                  case "Balance":
                    return "B a l a n c e   E n q u i r y";
                  default:
                    return "Status Unknown";
                }
              })()}
            </Text>
          </View>

          <View style={styles.rowview}>
            <View>
              <Text style={styles.statusText}>{translate("Request_Time")}</Text>
              {IsDealer ? (
                <Text style={styles.timetex}>{item.Txn_Date}</Text>
              ) : (
                <Text style={styles.timetex}>{item.Reqesttime}</Text>
              )}
            </View>
            {/* <View>
              <TouchableOpacity onPress={sendMessage}>
                <Fontisto name="whatsapp" color="#4FCE5D" size={24} />
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity
              style={styles.shearbtn}
              onPress={() => onShare(item)}
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

          {heightview ? (
            <View>
              <View style={[styles.border]} />

              <View style={styles.rowview}>
                <Text style={[styles.statusText, styles.textrit]}>
                  {translate("TXN ID")}
                </Text>
                <Text style={[styles.timetex]}>
                  {item.MerchantTxnId
                    ? translate(item.MerchantTxnId)
                    : translate("...")}
                </Text>
              </View>
              <View style={styles.rowview}>
                <Text style={[styles.statusText]}>
                  {translate("Transaction Mode")}
                </Text>
                <Text style={[styles.timetex, styles.textrit]}>
                  {item.TYPE} By{" "}
                  {IsDealer === false ? item.Type : item.TransactionType}
                </Text>
              </View>

              <View style={[styles.border]} />
              {IsDealer && (
                <View style={[styles.rowview]}>
                  <View style={styles.blance}>
                    <Text style={[styles.statusText, { flex: 1 }]}>
                      {translate("Pos Pre")}
                    </Text>
                    <Text style={[styles.timetex]}>
                      ₹ {`${item.REM_Remain_Pre}`}
                    </Text>
                  </View>
                  <View style={styles.blance}>
                    <Text style={[styles.statusText]}>
                      {translate("Net Amt")}
                    </Text>
                    <Text style={[styles.timetex]}>₹ {`${item.Total}`}</Text>
                  </View>
                  <View style={styles.blance}>
                    <Text style={[styles.statusText]}>{translate("Earn")}</Text>
                    <Text style={[styles.timetex]}>
                      ₹ {`${item.Rem_Income}`}
                    </Text>
                  </View>
                  <View style={styles.blance}>
                    <Text style={[styles.statusText, styles.textrit]}>
                      {translate("Cr / Dr")}
                    </Text>
                    <Text style={[styles.timetex]}>₹ {`${item.CR}`}</Text>
                  </View>
                  <View style={[styles.blance, { borderRightWidth: 0 }]}>
                    <Text style={[styles.statusText, styles.textrit]}>
                      {translate("Pos Post")}
                    </Text>
                    <Text style={[styles.timetex, styles.textrit]}>
                      ₹ {`${item.REM_Remain_Post}`}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </ViewShot>
  );
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
              .divider {
                border-bottom: 2px solid #2e8b57;
                margin: 20px 0;
              }
              .logo {
                display: block;
                margin: 0 auto 20px;
                width: 150px; /* Adjust size as needed */
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${APP_URLS.AppName}</h1>
                <h1>{translate("Transaction Details")}</h1>

              <div class="divider"></div>
  
              <!-- Bank and Account Info -->
              <div class="row">
                <strong>{translate("Bank Name")}:</strong>
                <span>${item.BankName || "No Bank Name"}</span>
              </div>
              <div class="row">
                <strong>{translate("Account No")}:</strong>
                <span>${IsDealer ? item.AccountHolderAadhaar || "....." : item.AccountHolderAadhar || "No Account"}</span>
              </div>
  
              <!-- Transaction Details -->
              <div class="row">
                <strong>{translate("Status")}:</strong>
                <span>${getStatusMessage(item.Status)}</span>
              </div>
              <div class="row">
                <strong>{translate("Amount")}:</strong>
                <span>₹ ${item.Amount || 0}</span>
              </div>
  
              <!-- Dealer-specific details -->
              ${
                IsDealer
                  ? `
                <div class="row">
                  <strong>{translate("Receiver Name")}:</strong>
                  <span>${item.RetailerName || "No Name"}</span>
                </div>
                <div class="row">
                  <strong>{translate("Bank RRN")}:</strong>
                  <span>${item.BankRRN || "....."}</span>
                </div>
                <div class="row">
                  <strong>{translate("Transaction Mode")}:</strong>
                  <span>${item.TransactionType || "No Transaction Mode"}</span>
                </div>
                <div class="row">
                  <strong>{translate("Request Time")}:</strong>
                  <span>${item.Txn_Date || "No Request Time"}</span>
                </div>
                <div class="row">
                  <strong>{translate("Mobile No")}:</strong>
                  <span>${item.Mobile || "Mobile..."}</span>
                </div>
                <div class="row">
                  <strong>{translate("Consumer Aadhar")}:</strong>
                  <span>${item.AccountHolderAadhaar || "No Aadhar"}</span>
                </div>
              `
                  : `
                <!-- Non-Dealer Information -->
                <div class="row">
                  <strong>{translate("Transaction ID")}:</strong>
                  <span>${item.MerchantTxnId || "No Transaction ID"}</span>
                </div>
                <div class="row">
                  <strong>{translate("Transaction Mode")}:</strong>
                  <span>${item.TransactionType || "No Transaction Mode"}</span>
                </div>
                <div class="row">
                  <strong>{translate("Transaction Date")}:</strong>
                  <span>${item.Reqesttime || "No Request Time"}</span>
                </div>
              `
              }
  
              <!-- Payment Details -->
              <div class="row">
                <strong>{translate("Transaction Status")}:</strong>
                <span>${item.Status === "Done" ? "Success" : item.Status}</span>
              </div>
  
              <!-- Additional Info -->
              <div class="row">
                <strong>{translate("Transaction Amount")}:</strong>
                <span>₹ ${item.Amount || 0}</span>
              </div>
  
              <!-- Request Time -->
              <div class="row">
                <strong>{translate("Request Time:</strong>
                <span>${IsDealer ? item.Txn_Date : item.Reqesttime || "No Request Time"}</span>
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

  const sharePDF = async (filePath) => {
    setFilePath(filePath);
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

  const sendMessage = async (item) => {
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
              .divider {
                border-bottom: 2px solid #2e8b57;
                margin: 20px 0;
              }
              .logo {
                display: block;
                margin: 0 auto 20px;
                width: 150px; /* Adjust size as needed */
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${APP_URLS.AppName}</h1>
                <h1>${translate("Transaction Details")}</h1>

              <div class="divider"></div>
  
              <!-- Bank and Account Info -->
              <div class="row">
                <strong>${translate("Bank Name")}:</strong>
                <span>${item.BankName || "No Bank Name"}</span>
              </div>
              <div class="row">
                <strong>${translate("Account No")}:</strong>
                <span>${IsDealer ? item.AccountHolderAadhaar || "....." : item.AccountHolderAadhar || "No Account"}</span>
              </div>
  
              <!-- Transaction Details -->
              <div class="row">
                <strong>${translate("Status")}:</strong>
                <span>${getStatusMessage(item.Status)}</span>
              </div>
              <div class="row">
                <strong>${translate("Amount")}:</strong>
                <span>₹ ${item.Amount || 0}</span>
              </div>
  
              <!-- Dealer-specific details -->
              ${
                IsDealer
                  ? `
                <div class="row">
                  <strong>${translate("Receiver Name")}:</strong>
                  <span>${item.RetailerName || "No Name"}</span>
                </div>
                <div class="row">
                  <strong>${translate("Bank RRN")}:</strong>
                  <span>${item.BankRRN || "....."}</span>
                </div>
                <div class="row">
                  <strong>${translate("Transaction Mode")}:</strong>
                  <span>${item.TransactionType || "No Transaction Mode"}</span>
                </div>
                <div class="row">
                  <strong>${translate("Request Time")}:</strong>
                  <span>${item.Txn_Date || "No Request Time"}</span>
                </div>
                <div class="row">
                  <strong>${translate("Mobile No")}:</strong>
                  <span>${item.Mobile || "Mobile..."}</span>
                </div>
                <div class="row">
                  <strong>${translate("Consumer Aadhar")}:</strong>
                  <span>${item.AccountHolderAadhaar || "No Aadhar"}</span>
                </div>
              `
                  : `
                <!-- Non-Dealer Information -->
                <div class="row">
                  <strong>${translate("Transaction ID")}:</strong>
                  <span>${item.MerchantTxnId || "No Transaction ID"}</span>
                </div>
                <div class="row">
                  <strong>${translate("Transaction Mode")}:</strong>
                  <span>${item.TransactionType || "No Transaction Mode"}</span>
                </div>
                <div class="row">
                  <strong>${translate("Transaction Date")}:</strong>
                  <span>${item.Reqesttime || "No Request Time"}</span>
                </div>
              `
              }
  
              <!-- Payment Details -->
              <div class="row">
                <strong>${translate("Transaction Status")}:</strong>
                <span>${item.Status === "Done" ? "Success" : item.Status}</span>
              </div>
  
              <!-- Additional Info -->
              <div class="row">
                <strong>${translate("Transaction Amount")}:</strong>
                <span>₹ ${item.Amount || 0}</span>
              </div>
  
              <!-- Request Time -->
              <div class="row">
                <strong>${translate("Request Time")}:</strong>
                <span>${IsDealer ? item.Txn_Date : item.Reqesttime || "No Request Time"}</span>
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
      const phoneNumber = "7414088555";
      const message = translate("Hello, this is a test message!");

      const shareOptions = {
        title: translate("Share file"),
        message: message,
        url: file.filePath,
        social: Share.Social.WHATSAPP,
        recipient: phoneNumber,
      };
      console.log(shareOptions);
      await Share.open(shareOptions);
    } catch (error) {
      console.error(error);
      Alert.alert(translate("Error"), translate("Failed to generate PDF."));
    }

    try {
    } catch (err) {
      console.error("An error occurred", err);
    }
  };
  return (
    <View style={styles.main}>
      <AppBarSecond title={"Aeps History"} />
      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        searchnumber={searchnumber}
        setSearchnumber={setSearchnumber}
        isshowRetailer={IsDealer}
        isStShow={true}
        retailerID={(id) => {
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
          <ActivityIndicator size="large" color={colorConfig.secondaryColor} />
        ) : transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <NoDatafound />
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
  },
  timetex: {
    fontSize: FontSize.regular,
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
    letterSpacing: wScale(1),
    textAlign: "center",
    flex: 1,
    marginVertical: hScale(2),
    paddingHorizontal: wScale(5),
  },
  blance: {
    flex: 1,
    borderRightWidth: wScale(0.7),
    borderColor: colors.black75,
    alignItems: "center",
  },
  bankInfoContainer: {
    paddingLeft: wScale(10),
    maxWidth: wScale(260),
  },
});

export default AEPSAdharPayR;
