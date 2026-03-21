import React, { useCallback, useEffect, useState } from "react";

import { View, Text, Image } from "react-native-animatable";
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  TextInput,
  ToastAndroid,
  RefreshControl,

} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { hScale, SCREEN_HEIGHT, wScale } from "../../utils/styles/dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxUtils/store";
import LottieView from "lottie-react-native";
import { transform } from "@babel/core";
import { BottomSheet, color } from "@rneui/base";
import Test from "./Test";
import SelectableButton from "./profilePages/selectButton";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DeletUser from "./profilePages/deletAccount/deleteuser";
import AppBar from "./headerAppbar/AppBar";
import FlotingInput from "./securityPages/FlotingInput";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { decryptData } from "../../utils/encryptionUtils";
import ImageBottomSheet from "../../components/ImageBottomSheet";
import ImageUploadBottomSheet from "../../components/imageUpload";
import { stateData } from "../../utils/stateData";
import { colors } from "../../utils/styles/theme";
import { FlashList } from "@shopify/flash-list";
import { openSettings } from "react-native-permissions";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import AadharCardUpload from "../../components/AdharImageUpload";
import { translate } from "../../utils/languageUtils/I18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Profile = () => {
  const { colorConfig, IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const { get, post } = useAxiosHook();
  const [profileData, setProfileData] = useState<any>({});

  const [imagePath, setImagePath] = useState<any>("");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<any>(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const { userId } = useSelector((state: RootState) => state.userInfo);
  const role = "Retailer";
  const [isUploadModal, setisUploadModal] = useState(false);

  const backbutton = `
   
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><linearGradient id="a" x1="219.858" x2="478.003" y1="387.123" y2="128.977" gradientTransform="matrix(1 0 0 -1 0 514.05)" gradientUnits="userSpaceOnUse"><stop stop-opacity="1" stop-color="${colorConfig.primaryColor}" offset="0.004629617637840665"></stop><stop stop-opacity="1" stop-color="${colorConfig.secondaryColor}" offset="1"></stop></linearGradient><path fill="url(#a)" d="M385.1 405.7c20 20 20 52.3 0 72.3s-52.3 20-72.3 0L126.9 292.1c-20-20-20-52.3 0-72.3L312.8 34c20-20 52.3-20 72.3 0s20 52.3 0 72.3L235.4 256z" opacity="1" data-original="url(#a)" class=""></path></g></svg>
    
    `;

  const deleteaccount =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="m54 19.07-2.67 36.37a5 5 0 0 1-5 4.56H36a1 1 0 0 1 0-2h10.35a3 3 0 0 0 3-2.73L52 18.93a1 1 0 1 1 2 .14ZM59 13a3 3 0 0 1-3 3H20v9a1 1 0 0 1-2 0v-9h-2a3 3 0 0 1 0-6h10V9a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v1h10a3 3 0 0 1 3 3Zm-31-3h16V9a3 3 0 0 0-3-3H31a3 3 0 0 0-3 3Zm-9 41a7 7 0 0 0-7 7s0 .06 0 .09a13.86 13.86 0 0 0 14 0s0-.09 0-.09a7 7 0 0 0-7-7Zm14-5a14 14 0 0 1-5.09 10.79 9 9 0 0 0-6.29-7.4 6 6 0 1 0-5.24 0 9 9 0 0 0-6.29 7.4A14 14 0 1 1 33 46Zm-21 1a1 1 0 0 0-.08-.38 1.15 1.15 0 0 0-.21-.33A1 1 0 0 0 10 47a1.23 1.23 0 0 0 0 .19.6.6 0 0 0 .06.19.76.76 0 0 0 .09.18 1.58 1.58 0 0 0 .12.15A1 1 0 0 0 12 47Zm16 0a1 1 0 0 0-.08-.38.93.93 0 0 0-.21-.33 1 1 0 0 0-.16-.12.56.56 0 0 0-.17-.09.6.6 0 0 0-.19-.06 1 1 0 0 0-.9.27.93.93 0 0 0-.21.33.84.84 0 0 0-.08.38.68.68 0 0 0 0 .2.64.64 0 0 0 .06.18.76.76 0 0 0 .09.18 1.58 1.58 0 0 0 .12.15l.15.12.18.09a.64.64 0 0 0 .18.06h.39a.6.6 0 0 0 .19-.06 1.15 1.15 0 0 0 .33-.21A1.05 1.05 0 0 0 28 47Zm12.62-25.08A1 1 0 0 0 41 22a1 1 0 0 0 .71-1.71 1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0 0 1.42 1.15 1.15 0 0 0 .33.21ZM36 22a1.05 1.05 0 0 0 .71-.29.93.93 0 0 0 .21-.33.94.94 0 0 0 0-.76.93.93 0 0 0-.21-.33A1 1 0 1 0 36 22Zm-5 0a1 1 0 1 0-.71-.29A1.05 1.05 0 0 0 31 22Zm9.29 4.71a1.15 1.15 0 0 0 .33.21A1 1 0 0 0 41 27a1 1 0 0 0 .71-1.71 1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0 0 1.42Zm-5 0a1 1 0 0 0 1.42 0 .93.93 0 0 0 .21-.33A1 1 0 0 0 37 26a1 1 0 1 0-1.71.71Zm-5 0A1 1 0 1 0 30 26a1.05 1.05 0 0 0 .29.71Zm10 5a1.15 1.15 0 0 0 .33.21A1 1 0 0 0 41 32a1 1 0 0 0 .71-1.71 1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0 0 1.42Zm-5.21-.33a1.15 1.15 0 0 0 .21.33 1 1 0 0 0 1.42 0 1.15 1.15 0 0 0 .21-.33.94.94 0 0 0 0-.76 1 1 0 0 0-.21-.33A1 1 0 0 0 35 31a.84.84 0 0 0 .08.38Zm5.21 12.33a1.15 1.15 0 0 0 .33.21A1 1 0 0 0 41 44a1 1 0 0 0 .71-1.71 1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0 0 1.42Zm-5 0a1 1 0 0 0 1.42 0 .93.93 0 0 0 .21-.33.94.94 0 0 0 0-.76 1 1 0 0 0-.21-.33 1 1 0 0 0-1.42 1.42Zm5 5a1.15 1.15 0 0 0 .33.21A1 1 0 0 0 41 49a1 1 0 0 0 .71-1.71 1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0 0 1.42Zm-5 0a1 1 0 0 0 1.42 0A1 1 0 0 0 37 48a1 1 0 0 0-.08-.38 1 1 0 0 0-.21-.33 1 1 0 0 0-1.42 1.42Zm5 5a1.15 1.15 0 0 0 .33.21A1 1 0 0 0 41 54a1 1 0 0 0 .71-1.71 1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0 0 1.42Zm-5 0A1 1 0 1 0 35 53a1.05 1.05 0 0 0 .29.71Zm-5-22a1 1 0 0 0 1.42-1.42 1 1 0 0 0-1.09-.21 1 1 0 0 0-.33.21 1 1 0 0 0 0 1.42Z" data-name="07 delete user, user, person, avatar, login, delete account" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>';
  const editProfile =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="33" width="33"  viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>';
  const gender = `  
  <svg id="glipy_copy" height="512" viewBox="0 0 64 64" height="33" width="33" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-name="glipy copy"><linearGradient id="linear-gradient" gradientUnits="userSpaceOnUse" x1="2.997" x2="61" y1="32" y2="32"><stop offset="0" stop-color="${colorConfig.secondaryColor}"/><stop offset="1" stop-color="${colorConfig.secondaryColor}"/></linearGradient><path d="m17.75 46.87a3.19018 3.19018 0 0 1 -3.19-3.18v-3.96a8.63707 8.63707 0 0 1 5.91-8.2l7.87-2.62c-9.2-4.88-5.86-18.95 4.7-19.04 10.58.13 13.9 14.11 4.7 19.04l7.86 2.62a8.624 8.624 0 0 1 5.91 8.2v3.96a3.188 3.188 0 0 1 -3.18 3.18zm36.1015-33.92548 1.69879.20978a1.00033 1.00033 0 0 0 .24506-1.98535l-3.96967-.48975a1.00527 1.00527 0 0 0 -1.11523.87012l-.48975 3.97021a1.00039 1.00039 0 0 0 1.98535.24506l.17969-1.45746c15.13947 17.23468 2.58142 44.77911-20.386 44.69269a26.91265 26.91265 0 0 1 -14.84-4.44513 1.00013 1.00013 0 1 0 -1.09961 1.6709 28.90928 28.90928 0 0 0 15.93987 4.77441c24.708.08685 38.173-29.5575 21.8515-48.05548zm-41.12494 34.34112a.99437.99437 0 0 0 -1.08252.90967l-.1206 1.39228c-15.00873-17.25995-2.42511-44.67603 20.47687-44.58747a26.91319 26.91319 0 0 1 14.84 4.44519 1.00029 1.00029 0 0 0 1.09955-1.671 28.90936 28.90936 0 0 0 -15.93986-4.77431c-24.499-.09351-38.04395 29.13959-22.14178 47.71844l-1.56769-.21944a.9999.9999 0 0 0 -.27735 1.98047l4.16016.58252a.99951.99951 0 0 0 1.13477-.90381l.32812-3.79a.99933.99933 0 0 0 -.90967-1.08254z" fill="url(#linear-gradient)"/></svg>

  `;
  const dropdown = `<svg xmlns="http://www.w3.org/2000/svg"  version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="26" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#000000" fill-rule="evenodd" d="M20.586 47.836a2 2 0 0 0 0 2.828l39.879 39.879a5 5 0 0 0 7.07 0l39.879-39.879a2 2 0 0 0-2.828-2.828L64.707 87.714a1 1 0 0 1-1.414 0L23.414 47.836a2 2 0 0 0-2.828 0z" clip-rule="evenodd" opacity="1" data-original="#000000" class=""></path></g></svg>`;

  const calander = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><linearGradient id="c" x1="255.646" x2="255.646" y1="345.495" y2="8.568" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"><stop stop-opacity="1" stop-color="#ffffff" offset="0"></stop><stop stop-opacity="1" stop-color="#ffffff" offset="0"></stop></linearGradient><linearGradient id="a"><stop stop-opacity="1" stop-color="#d9dbf0" offset="0"></stop><stop stop-opacity="1" stop-color="#212121" offset="0"></stop></linearGradient><linearGradient xlink:href="#a" id="d" x1="255.495" x2="255.495" y1="51.398" y2="298.135" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"></linearGradient><linearGradient id="b"><stop stop-opacity="1" stop-color="#fddab4" offset="0"></stop><stop stop-opacity="1" stop-color="#e0e0e0" offset="0"></stop></linearGradient><linearGradient xlink:href="#b" id="e" x1="296.977" x2="296.977" y1="178.589" y2="252.223" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"></linearGradient><linearGradient xlink:href="#b" id="f" x1="254.659" x2="254.659" y1="100.358" y2="195.112" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"></linearGradient><linearGradient id="g" x1="255.747" x2="255.747" y1="465.377" y2="343.895" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"><stop stop-opacity="1" stop-color="#fc7968" offset="0"></stop><stop stop-opacity="1" stop-color="#212121" offset="0"></stop></linearGradient><linearGradient xlink:href="#a" id="h" x1="143.697" x2="143.697" y1="405.318" y2="508.055" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"></linearGradient><linearGradient xlink:href="#a" id="i" x1="256.286" x2="256.286" y1="404.51" y2="506.758" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"></linearGradient><linearGradient xlink:href="#a" id="j" x1="368.741" x2="368.741" y1="404.51" y2="507.819" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse"></linearGradient><path fill="url(#c)" d="M6.3 168.5H505v323.3c.1 7.4-5.8 13.5-13.2 13.6H19.5c-7.4-.1-13.3-6.2-13.2-13.6z" opacity="1" data-original="url(#c)" class=""></path><path fill="#212121" d="M491.8 512H20.2C9 512 0 503 0 491.8V168.5h13.5v323.3c0 3.7 3 6.7 6.7 6.7h471.6c3.7 0 6.7-3 6.7-6.7V168.5H512v323.3c0 11.2-9 20.2-20.2 20.2z" opacity="1" data-original="#f0f0f0" class=""></path><path fill="url(#a)" d="M255.7 462.6c68.1-.1 123.3-55.5 123.1-123.6s-55.5-123.3-123.6-123.1c-68 .1-123.1 55.3-123.1 123.4.1 68.1 55.4 123.4 123.6 123.3z" opacity="1" data-original="url(#a)" class=""></path><path fill="#212121" d="M255.6 468.6c-71.5-.1-129.3-58.2-129.2-129.7s58.2-129.3 129.7-129.2c71.4.1 129.2 58 129.2 129.4-.1 71.6-58.1 129.5-129.7 129.5zm0-245.4c-64.1.1-115.9 52.2-115.8 116.2.1 64.1 52.2 115.9 116.2 115.8s115.8-52 115.8-116c-.1-64.1-52.1-116-116.2-116z" opacity="1" data-original="#cfd1e2" class=""></path><path fill="url(#b)" d="M296.8 335.4c20.3.1 36.9-16.3 37-36.6s-16.3-36.9-36.6-37-36.9 16.3-37 36.6v.2c-.1 20.3 16.3 36.8 36.6 36.8z" opacity="1" data-original="url(#b)" class=""></path><path fill="url(#b)" d="M329.1 363.4c4.2-16.9-2.5-40.7-2.5-40.7-5.4 4.6-11.5 8.2-18 11-7.5 1.5-15.1 1.7-22.7.5-4.8 5.7-11.8 9-19.3 9-13.8.4-22.4-10.3-26.6-15.4-14.3-16.8-28.4-6.4-28.4 3.4.2 3.5 1 6.9 2.5 10.1 0 0-12.6 2.5-20.2 8.4-6.7 5.3-11.8 10.1-14.3 19.5-1.7 5.5-.8 11.4 2.5 16.1 1.8 2.4 12.6 13.5 28.4-3.4 3.4-3.6 21 50.3 84.5 24.6 19-7.1 29.9-26.1 34.1-43.1z" opacity="1" data-original="url(#b)" class=""></path><path fill="#212121" fill-rule="evenodd" d="M210.9 392.3c-10.3 9.5-27.1 8.2-33.9-1.9-15.2-21.4 8.7-48.1 28.6-52.9-4.7-21 20.6-36 39.8-13.2 6.5 9.3 18.5 14.8 28.8 10.8-35.1-21.9-19.3-78.4 22.6-78.1 31.7-.8 53 36.5 36.5 63.4l1 2.5c10.2 32.2 1.1 75.2-35.6 90.8-38.3 17.3-72.5 2.3-87.8-21.4zM297 270.5c-37.2 1.7-38.1 54.1-1 57.6 38.4.3 39.4-56.5 1-57.6zM198.2 356c-6.6 5.2-10.1 8.9-12 15.9-1.4 4.3-.5 11.8 7.2 13.4 10.9.5 15.5-19.7 27.1-2.2C249.8 430.4 336 406.5 323 335c-9.9 7.2-22.3 8.5-34 5.9-9.7 11.1-26.9 10.8-38.6 4.9-11.3-3.7-17.1-22-27.8-19.1-9.5 4.5.4 17.2 4.5 23 7.1 8.6 12.6 13.9 21.9 17.6 8 3.4 3.4 15.8-5.1 12.6-14.2-5.7-24.8-16.6-33-29.8-4.5 1.2-8.8 3.2-12.7 5.9z" clip-rule="evenodd" opacity="1" data-original="#f2d0ac" class=""></path><path fill="url(#g)" d="M7.5 95.3c0-25.9 21.9-46.7 44.7-46.7h406.9c22.9 0 44.7 20.8 44.7 46.7v74.8H7.5z" opacity="1" data-original="url(#g)" class=""></path><path fill="#212121" d="M454.7 41.4H57.3C25.6 41.6 0 67.3 0 99v77.1h512V99c0-31.7-25.6-57.4-57.3-57.6zm43.8 121.2h-485V99c0-24.2 19.6-43.9 43.8-44h397.5c24.2.1 43.8 19.8 43.8 44v63.6z" opacity="1" data-original="#cf422f" class=""></path><path fill="url(#a)" d="M143.7 5.9c13.4 0 24.3 12.2 24.3 27.2v48.4c0 15-10.9 27.2-24.3 27.2s-24.3-12.2-24.3-27.2V33.1c0-14.9 10.9-27.2 24.3-27.2z" opacity="1" data-original="url(#a)" class=""></path><path fill="url(#a)" d="M256.3 7.2c13.9 0 25.3 12.2 25.3 27.1v48.1c0 14.9-11.4 27.1-25.3 27.1S231 97.3 231 82.4V34.3c0-14.9 11.4-27.1 25.3-27.1z" opacity="1" data-original="url(#a)" class=""></path><path fill="url(#a)" d="M368.7 6.2c13.4 0 24.3 12.3 24.3 27.4v48.6c0 15-10.9 27.4-24.3 27.4s-24.3-12.3-24.3-27.4V33.5c0-15 11-27.3 24.3-27.3z" opacity="1" data-original="url(#a)" class=""></path><g fill="#cfd1e2"><path d="M143.2 0c-16.8.1-30.3 13.7-30.3 30.5v54.1c0 16.7 13.6 30.3 30.3 30.3s30.3-13.6 30.3-30.3V30.5c0-16.8-13.6-30.4-30.3-30.5zM160 84.6c0 9.3-7.5 16.8-16.8 16.8s-16.8-7.5-16.8-16.8V30.5c0-9.3 7.5-16.8 16.8-16.8S160 21.2 160 30.5zM256 0c-16.8.1-30.3 13.7-30.3 30.5v54.1c0 16.7 13.6 30.3 30.3 30.3s30.3-13.6 30.3-30.3V30.5C286.3 13.7 272.8.1 256 0zm16.8 84.6c0 9.3-7.5 16.8-16.8 16.8s-16.8-7.5-16.8-16.8V30.5c0-9.3 7.5-16.8 16.8-16.8s16.8 7.5 16.8 16.8zM368.8 0c-16.8.1-30.3 13.7-30.3 30.5v54.1c0 16.7 13.6 30.3 30.3 30.3s30.3-13.6 30.3-30.3V30.5c0-16.8-13.5-30.4-30.3-30.5zm16.9 84.6c0 9.3-7.5 16.8-16.8 16.8S352 93.9 352 84.6V30.5c0-9.3 7.5-16.8 16.8-16.8s16.8 7.5 16.8 16.8v54.1z" fill="#212121" opacity="1" data-original="#cfd1e2" class=""></path></g></g></svg>`;

  const [selectedButton, setselectedButton] = useState(true);
  const [selectedopt, setSelectedOpt] = useState(true);

  const setselectedopt = (value) => {
    setSelectedOpt(value);
  };

  const navigation = useNavigation();

  const [selectedGender, setSelectedGender] = useState("Male");
  const [panNumber, setPanNumber] = useState("");

  const handlePanNumberChange = (text) => {
    // Remove any non-alphabetic characters
    const cleanedText = text.replace(/[^A-Za-z]/g, "");
    setPanNumber(cleanedText.toUpperCase());
  };

  const handleGenderChange = () => {
    // Toggle between different gender options
    setSelectedGender((prevGender) => {
      if (prevGender === "Male") {
        return "Female";
      }
      if (prevGender === "Female") {
        return "Other";
      }
      return "Male";
    });
  };
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const defaultProfileData = {
    Name: "",
    firmName: "",
    JoinDate: new Date().toISOString().split("T")[0],
    Mobile: "",
    Email: "",
    BusinessType: "",
    Aadhar: "",
    BusinessTypeCode: "",
    PAN: "",
    GST: "",
    Address: "",
    State: "",
    District: "",
    Cityname: "",
    PINCode: "",
    Photo: null,
    dob: "",
  };

  // Merge default + actual data
  const fetchData = async () => {
    const url2 = `${APP_URLS.dealer_profile}dlmid=${userId}`;
    const res = await get({ url: IsDealer ? url2 : APP_URLS.getProfile });
    setRefreshing(false);

    console.log(res, "*******", IsDealer ? url2 : APP_URLS.getProfile);
    if (res) {
      setProfileData(
        IsDealer
          ? res
          : JSON.parse(decryptData(res.value1, res.value2, res.data)),
      );
      console.log(JSON.parse(decryptData(res.value1, res.value2, res.data)));

      const data = JSON.parse(decryptData(res.value1, res.value2, res.data));
      console.log(data.videokycstatus);

      if (data.videokycstatus === "Y") {
        // Alert.alert(
        //   'Info',
        //   'Video kyc is pending',
        //   [
        //     {
        //       text: 'OK',  // Button text
        //       onPress: () => console.log('OK Pressed'),
        //     },
        //     {
        //       text: 'Procceed Video Kyc',
        //       onPress: () => {
        //         navigation.navigate('VideoKYC');
        //       },
        //     },
        //   ],
        //   { cancelable: false }
        // );
      }
    }
  };
  const profileDataToUse = { ...defaultProfileData, ...profileData };

  useEffect(() => {
    console.log(profileData);
    fetchData();
    setState(profileData?.State);
    setName(profileData?.Name);
    setfirmName(profileData?.firmName);
    setaadharNo(profileData?.Aadhar);
    setpanNo(profileData?.PAN);
    setGST(profileData?.GST);

    Promise.all([fetchData()]).then(() => setRefreshing(false));
  }, [
    profileData.State,
    profileData?.Name,
    profileData?.firmName,
    profileData?.Aadhar,
    profileData?.PAN,
    profileData?.GST,
  ]);

  const onPressDeleteUser = () => {
    navigation.navigate(DeletUser);
  };
  const [activeTab, setActiveTab] = useState(0);

  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleItemClick = (type, base64Img) => {
    let data = {}; // Declare the data object

    switch (type) {
      case "Aadhar Card":
        data = {
          AadharcardFront: base64Img,
          AadharcardBack: base64Img,
          txtretailerid: userId,
          currentrole: role,
        };
        break;

      case "Pan Card":
        data = {
          PancardFront: base64Img,
          txtretailerid: userId,
          currentrole: role,
        };
        break;

      case "GST IN":
        data = {
          Registrationcertificatepath: base64Img,
          txtretailerid: userId,
          currentrole: role,
        };
        break;

      case "Shop Selfie":
        data = {
          ShopeWithSelfie: base64Img,
          txtretailerid: userId,
          currentrole: role,
        };
        break;

      case "Service Agreement":
        data = {
          Serviceaggreementpath: base64Img,
          txtretailerid: userId,
          currentrole: role,
        };
        break;

      case "Profile image":
        data = {
          ProfileImagess: base64Img,
          txtretailerid: userId,
          currentrole: role,
        };
        break;

      default:
        data = null;
        break;
    }

    return data;
  };

  const uploadDoCx = async (typ, bs64) => {
    setImageModalVisible(false);
    try {
      const data = handleItemClick(typ, bs64);
      const body = JSON.stringify(data);
      console.log(body, "BODY****", typ);
      const endpoint =
        typ === "Profile image"
          ? `api/user/UploadUserImages`
          : `api/user/UploadDocumentsImages`;

      const url = `https://${APP_URLS.baseWebUrl}${endpoint}`;
      console.log(url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload. Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData === "Image Updated Successfully.") {
        ToastAndroid.show(responseData, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(responseData, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", `Failed to upload ${typ} Image: ${error.message}`);
    }
  };

  const uploadDoCxAdhar = async () => {
    const data = {
      AadharcardFront: base64Img,
      AadharcardBack: base64Img1,
      txtretailerid: userId,
      currentrole: role,
    };
    console.log(data);
    const body = JSON.stringify(data);

    console.log(body);

    try {
      const response = await fetch(
        `http://${APP_URLS.baseWebUrl}/api/user/UploadDocumentsImages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: body,
        },
      );

      const responseData = await response.json();
      const Status = responseData.Message;
      console.log(responseData);
      if (responseData === translate("Image Updated Successfully.")) {
        Alert.alert(responseData);
      } else {
        Alert.alert("Failed", responseData);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to upload ${typ} Image`);
    }
  };

  const UpdateProfile = async () => {
    const data = {
      Name: Name,
      firmName: "firm3",
      Mobile: "mobile3",
      PINCode: "pincode3",
      Email: "email3",
      Address: "address3",
      District: "districtId3",
      State: "StateId3",
      Aadhar: "aadhar3",
      PAN: "pan3",
      GST: "gst3",
      dob: "dob3",
      BusinessType: "position3",
      BusinessTypeCode: "business3",
      Password: "password3",
      PIN: "pin3",
      JoinDate: "joinDate3",
      Cityname: "cityName3",
    };
    console.log(data);
    const body = JSON.stringify(data);

    console.log(body);

    try {
      const response = await fetch(
        `http://${APP_URLS.baseWebUrl}/api/user/UploadDocumentsImages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: body,
        },
      );

      const responseData = await response.json();
      const Status = responseData.Message;
      console.log(responseData);
      if (responseData === translate("Image Updated Successfully.")) {
        Alert.alert(responseData);
      } else {
        Alert.alert("Failed", responseData);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to upload ${typ} Image`);
    }
  };
  const getDistricts = useCallback(
    async ({ id }) => {
      const response = await get({ url: `${APP_URLS.getDistricts}${id}` });
      setDistrictData(response);
    },
    [get],
  );

  const [dob, setdob] = useState(new Date());

  const [isFrontA, setIsisFrontA] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [state, setState] = useState<any>(profileData?.State);
  const [districtData, setDistrictData] = useState([]);
  const [District, setDistrict] = useState("");
  const [stateId, setStateId] = useState(0);
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [showDatePicker, setshowDatePicker] = useState(true);
  const [base64Img, setbase64Img] = useState<any>(null);
  const [base64Img1, setbase64Img1] = useState<any>(null);
  const [showLoader, setshowLoader] = useState(false);

  const [Name, setName] = useState<any>(profileData?.Name);
  const [firmName, setfirmName] = useState<any>(profileData?.firmName);
  const [aadharNo, setaadharNo] = useState<any>(profileData?.Aadhar);
  const [panNo, setpanNo] = useState<any>(profileData?.PAN);
  const [GST, setGST] = useState<any>(profileData?.GST);
  const [lastupload, setLastUpload] = useState("");

  const showBottomSheetList = () => {
    return (
      <FlashList
        style={{ marginBottom: wScale(50), marginHorizontal: wScale(24) }}
        data={showStateList ? stateData : districtData}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                marginVertical: wScale(8),
                marginHorizontal: wScale(24),
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  if (showStateList) {
                    setShowStateList(false);
                    setStateId(item.stateId);
                    // setAddressState(item.stateName);
                    //   setDistrict('');
                    await getDistricts({ id: item.stateId });
                  } else {
                    setShowDistrictList(false);
                    setDistrict(item["Dist Name"]);
                  }
                }}
              >
                <Text
                  style={{
                    color: "#ff4670",
                    fontSize: 18,
                  }}
                >
                  {showStateList ? item.stateName : item["Dist Name"]}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        estimatedItemSize={30}
      />
    );
  };

  const FrontAadhar = (Typename) => {
    Alert.alert(
      Typename,
      translate(`Choose Options For Upload ${Typename}`),
      [
        {
          text: translate("Cancel"),
          onPress: () => {
            setshowLoader(false);
          },
          style: "cancel",
        },
        {
          text: translate("Camera"),
          onPress: async () => {
            await launchCamera(
              { mediaType: "photo", includeBase64: true },
              (response) => {
                setbase64Img(response?.assets?.[0]?.base64);
              },
            );
            setIsisFrontA(false);
          },
          style: "default",
        },
        {
          text: translate("Gallary"),
          onPress: async () => {
            await launchImageLibrary(
              { selectionLimit: 1, mediaType: "photo", includeBase64: true },
              (response) => {
                setbase64Img(response?.assets?.[0]?.base64);
              },
            );

            setIsisFrontA(false);
          },
        },
      ],
      { cancelable: false },
    );
  };
  const BackAadhar = (Typename) => {
    Alert.alert(
      Typename,
      translate(`Choose Options For Upload ${Typename}`),
      [
        {
          text: translate("Cancel"),
          onPress: () => {
            setshowLoader(false);
          },
          style: "cancel",
        },
        {
          text: translate("Camera"),
          onPress: async () => {
            await launchCamera(
              { mediaType: "photo", includeBase64: true },
              (response) => {
                setbase64Img1(response?.assets?.[0]?.base64);
              },
            );
            if (base64Img === null) {
              FrontAadhar("Front Side");
            } else if (base64Img1 === null) {
              BackAadhar("Back Side");
            } else {
              uploadDoCxAdhar();
            }
          },
          style: "default",
        },
        {
          text: translate("Gallary"),
          onPress: async () => {
            await launchImageLibrary(
              { selectionLimit: 1, mediaType: "photo", includeBase64: true },
              (response) => {
                setbase64Img1(response?.assets?.[0]?.base64);
              },
            );
            if (base64Img === null) {
              console.log("f empty");
            }
          },
        },
      ],
      { cancelable: false },
    );
  };
  const UploadOptions = (Typename) => {
    setLastUpload(Typename);
    Alert.alert(
      Typename,
      translate(`Choose Options For Upload ${Typename}`),
      [
        {
          text: translate("Cancel"),
          onPress: () => {
            setshowLoader(false);
          },
          style: "cancel",
        },
        {
          text: translate("Camera"),
          onPress: async () => {
            const options = {
              mediaType: "image",
            };

            requestCameraPermission(Typename);
          },
          style: "default",
        },
        {
          text: translate("Gallary"),
          onPress: async () => {
            await launchImageLibrary(
              { selectionLimit: 1, mediaType: "photo", includeBase64: true },
              (response) => {
                setbase64Img(response?.assets?.[0]?.base64);

                if (response?.assets?.[0]?.base64) {
                  uploadDoCx(Typename, response?.assets?.[0]?.base64);
                }
              },
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  const requestCameraPermission = useCallback(async (type) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: translate("Camera Permission"),
          message: translate(
            "key_thisappn_102",
          ),
          buttonPositive: translate("OK"),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        if (type == "AA") {
          navigation.navigate(translate("AadharCardUpload"), { id: userId });
        } else {
          await launchCamera(
            { mediaType: "photo", includeBase64: true },
            (response) => {
              setbase64Img(response?.assets?.[0]?.base64);

              if (response?.assets?.[0]?.base64) {
                uploadDoCx(type, response?.assets?.[0]?.base64);
              }
            },
          );
        }
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: translate("Permission Required"),
          textBody: translate(
            "key_pleasegra_85",
          ),
          button: translate("OK"),
          onPressButton: () => {
            Dialog.hide();
            openSettings().catch(() => console.warn("cannot open settings"));
          },
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //setViewMoreStatus(false)
    fetchData().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkStatusAndCall = async () => {
        try {
          const status = await AsyncStorage.getItem("Profile_status");
          console.error(" Profile_status:", status);
          if (status === translate("Updated")) {
            fetchData();
          }
        } catch (error) {
          console.error("Error reading AsyncStorage:", error);
        }
      };

      checkStatusAndCall();

      return () => {};
    }, []),
  );

  console.error(profileData);
  return (
    <View style={styles.main}>
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={{ flex: 1 }}
      >
        <AppBar
          title="Manage Profile"
          actionButton={<SvgXml xml={deleteaccount} />}
          // onActionPress={onPressDeleteUser}
        />

        <View style={styles.imgtopedit}>
          <View
            style={[
              styles.editmainview,
              { backgroundColor: colorConfig.secondaryColor },
            ]}
          >
            <View style={styles.editimagestyle}>
              <View style={styles.profileimgedit1}>
                <Image
                  resizeMode="cover"
                  source={
                    profileImage
                      ? { uri: "data:image/png;base64," + profileImage }
                      : profileData?.Photo
                        ? {
                            uri:
                              `http://${APP_URLS.baseWebUrl}` +
                              profileData?.Photo,
                          }
                        : require("../drawer/assets/bussiness-man.png")
                  }
                  style={{ height: hScale(80), width: wScale(80) }}
                />
                <View
                  style={[
                    styles.profileimgeditbutton,
                    { backgroundColor: colorConfig.secondaryColor },
                  ]}
                >
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.CAMERA,
                          {
                            title: translate("Camera Permission"),
                            message: translate(
                              "key_thisappn_102",
                            ),
                            buttonPositive: translate("OK"),
                          },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                          if (Object.keys(profileDataToUse).length !== 0) {
                            await AsyncStorage.setItem("Profile_status", "un");

                            navigation.navigate(translate("EditProfile"), {
                              profileData: profileDataToUse,
                            });
                          }
                          console.log(Object.keys(profileData).length !== 0);
                        } else {
                          Dialog.show({
                            type: ALERT_TYPE.WARNING,
                            title: translate("Permission Required"),
                            textBody: translate(
                              "key_pleasegra_85",
                            ),
                            button: translate("OK"),
                            onPressButton: () => {
                              Dialog.hide();
                              openSettings().catch(() =>
                                console.warn("cannot open settings"),
                              );
                            },
                          });
                        }
                      } catch (err) {
                        console.warn(err);
                      }

                      // await launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', includeBase64: true }, async (response) => {
                      //   await setProfileImage(response?.assets?.[0]?.base64);

                      //   const profileImage = response?.assets?.[0]?.base64;
                      //   uploadDoCx('Profile image', profileImage);
                      // });
                    }}
                  >
                    <SvgXml xml={editProfile} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.editimageTextstyle}>
              <Text
                allowFontScaling={false}
                style={styles.profileImportantNote}
              >
                {translate("Profile Important Note")}
              </Text>
              <Text allowFontScaling={false} style={styles.retailstyle}>
                {translate("description")}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View style={styles.personalinfoandkyc}>
              <SelectableButton setselectedopt={setselectedopt} />
            </View>
          </View>

          <View>
            <View style={styles.mainbody}>
              {Object.keys(profileData).length !== 0 ? (
                <View>
                  {selectedopt ? (
                    <View>
                      <View>
                        {profileData.videokycstatus === "Y" ? null : (
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("VideoKYC", {
                                CNTNT: {
                                  hindi: "",
                                  Eng: "",
                                },
                              });
                            }}
                            style={{
                              width: "100%",
                              height: hScale(30),
                              borderWidth: 1,
                              borderColor:
                                profileData.videokycstatus === "N"
                                  ? "red"
                                  : "orange",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                              backgroundColor:
                                profileData.videokycstatus === "N"
                                  ? "red"
                                  : "orange",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: "white",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              {profileData.videokycstatus === "N" ? (
                                <>{translate("Continue to video kyc")} 🎥</>
                              ) : (
                                <>{translate("Pending")} ⌛</>
                              )}
                            </Text>
                          </TouchableOpacity>
                        )}

                        <View>
                          <FlotingInput
                            label={"Your Name"}
                            value={Name}
                            autoFocus={false}
                            editable={true}
                            value={Name}
                            inputstyle={undefined}
                            labelinputstyle={undefined}
                            onChangeTextCallback={(text) => {
                              setName(text);
                            }}
                          />
                        </View>

                        <View style={{ position: "relative" }}>
                          <Text style={styles.selectgendtext}>
                            {translate("Select Your gender")}
                          </Text>
                          <TextInput
                            style={styles.input}
                            value={selectedGender}
                          />
                          {/* <FlotingInput
                          label={selectedGender}
                          // value={selectedGender}
                          editable={false}
                          autoFocus={false} // Auto-focus on mount

                        /> */}

                          <View style={styles.righticon}>
                            <TouchableOpacity onPress={handleGenderChange}>
                              <SvgXml xml={gender} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View>
                          <FlotingInput
                            label={"Date Of Birth (DD MM YYYY)"}
                            keyboardType="number-pad"
                            value={profileData.dob}
                            // autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                          />

                          <View style={styles.righticon}>
                            <TouchableOpacity
                              onPress={() => {
                                console.log("date");
                                setshowDatePicker(true);
                              }}
                            >
                              <SvgXml xml={calander} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ position: "relative" }}>
                          <FlotingInput
                            label={"Select State"}
                            editable={false}
                            //  autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)}
                            //value={profileData?.State} // When this input blurs, focus the next input
                            value={state} // When this input blurs, focus the next input
                          />

                          <View style={styles.righticon}>
                            <TouchableOpacity
                              onPress={() => {
                                setShowStateList(true);
                              }}
                            >
                              <SvgXml xml={dropdown} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{ position: "relative" }}>
                          <FlotingInput
                            label={"Select District"}
                            // autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)}
                            editable={false}
                            value={profileData?.District} // When this input blurs, focus the next input
                          />

                          <View style={styles.righticon}>
                            <TouchableOpacity>
                              <SvgXml xml={dropdown} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <FlotingInput
                          label={"Address"}
                          multiline={true}
                          value={profileData?.Address}
                          // autoFocus={true} // Auto-focus on mount
                          onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                        />

                        <FlotingInput
                          label={"Area Pincode"}
                          value={profileData?.PINCode}
                          keyboardType="number-pad"
                          //  autoFocus={true} // Auto-focus on mount
                          onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                        />

                        <FlotingInput
                          label={"Registered Mobile"}
                          value={profileData?.Mobile}
                          // autoFocus={true} // Auto-focus on mount
                          onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                        />

                        <FlotingInput
                          label={"Registered Email ID"}
                          value={profileData?.Email}
                          // autoFocus={true} // Auto-focus on mount
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View>
                        <FlotingInput
                          label={"Firm Name"}
                          //  autoFocus={true} // Auto-focus on mount
                          value={firmName}
                          onBlur={() => setIsMobileFocused(true)}
                          onChangeTextCallback={(text) => {
                            setfirmName(text);
                          }}
                          // When this input blurs, focus the next input
                        />

                        <View>
                          <FlotingInput
                            label={"Aadhar Card"}
                            value={aadharNo}
                            keyboardType="number-pad"
                            //  autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                          />

                          <View style={styles.righticon2}>
                            <TouchableOpacity
                              onPress={() => {
                                //  aadhar2SideUpload();

                                const url = `${profileData?.aadharcardPath}`;
                                const newUrl = url.replace(
                                  /^https?:\/\/www\./,
                                  "https://",
                                );
                                console.log(url);

                                if (
                                  profileData?.aadharsts === "N" &&
                                  profileData?.chkaadharfront === null &&
                                  profileData?.chkaadharback === null
                                ) {
                                  requestCameraPermission("AA");

                                  setImagePath("");
                                } else {
                                  setImagePath(newUrl);
                                  setImageModalVisible(true);
                                  setModalTitle("Aadhar Card (Front Side)");
                                }
                              }}
                            >
                              <LottieView
                                autoPlay={true}
                                loop={true}
                                style={styles.lotiimg}
                                source={
                                  profileData?.aadharsts === "N" &&
                                  profileData?.chkaadharfront === null &&
                                  profileData?.chkaadharback === null
                                    ? require("../../utils/lottieIcons/upload-file.json")
                                    : require("../../utils/lottieIcons/View-Docs.json")
                                }
                                // source={require('../../utils/lottieIcons/View-Docs.json')}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {showLoader && (
                          <ActivityIndicator
                            size={wScale(40)}
                            style={styles.loaderStyle}
                            color={colors.black}
                          />
                        )}
                        <View>
                          <FlotingInput
                            label={"Pan Card"}
                            value={panNo}
                            //  autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                          />
                          <View style={styles.righticon2}>
                            <TouchableOpacity
                              onPress={() => {
                                setImagePath(``);

                                const url = `${profileData?.chkpanpath}`;
                                const newUrl = url.replace(
                                  /^https?:\/\/www\./,
                                  "https://",
                                );
                                console.log(newUrl);

                                if (
                                  profileData?.pancardPath === null &&
                                  profileData?.PSAStatus === "N"
                                ) {
                                  setshowLoader(true);
                                  UploadOptions("Pan Card");
                                } else {
                                  setImagePath(
                                    `http://${APP_URLS.baseWebUrl}${newUrl}`,
                                  );
                                  setImageModalVisible(true);
                                  setModalTitle("Pan Card");
                                }
                              }}
                            >
                              <LottieView
                                autoPlay={true}
                                loop={true}
                                style={styles.lotiimg}
                                source={
                                  profileData?.pancardPath === null &&
                                  profileData?.PSAStatus === "N"
                                    ? require("../../utils/lottieIcons/upload-file.json")
                                    : require("../../utils/lottieIcons/View-Docs.json")
                                }

                                //source={require('../../utils/lottieIcons/upload-file.json')}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ position: "relative" }}>
                          <FlotingInput
                            label={"GST IN"}
                            keyboardType="number-pad"
                            value={GST}
                            // autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                          />
                          <View style={styles.righticon2}>
                            <TouchableOpacity
                              onPress={() => {
                                console.log(
                                  `http://${APP_URLS.baseWebUrl}${profileData?.chkRegistractioncertificatepath}`,
                                );
                                if (
                                  profileData?.chkRegistractioncertificatepath ===
                                  null
                                ) {
                                  UploadOptions("GST IN");
                                  setshowLoader(true);
                                  setImagePath("");
                                } else {
                                  setImagePath(
                                    `http://${APP_URLS.baseWebUrl}${profileData?.chkRegistractioncertificatepath}`,
                                  );
                                  setImageModalVisible(true);
                                  setModalTitle("GST IN");
                                }
                              }}
                            >
                              <LottieView
                                autoPlay={true}
                                loop={true}
                                style={styles.lotiimg}
                                source={
                                  profileData?.chkRegistractioncertificatepath ===
                                  null
                                    ? require("../../utils/lottieIcons/upload-file.json")
                                    : require("../../utils/lottieIcons/View-Docs.json")
                                }

                                //  source={require('../../utils/lottieIcons/View-Docs.json')}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ position: "relative" }}>
                          <FlotingInput
                            label={"Service Agreement"}
                            value={profileData?.Iserviceagreementtatus}
                            // autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                          />

                          <View style={styles.righticon2}>
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  profileData?.serviceagreementpath === null
                                ) {
                                  UploadOptions("Service Agreement");
                                  setshowLoader(true);
                                  setImagePath("");
                                } else {
                                  setImagePath(
                                    `http://${APP_URLS.baseWebUrl}${profileData?.serviceagreementpath}`,
                                  );
                                  setImageModalVisible(true);
                                  setModalTitle("Service Agreement");
                                }
                              }}
                            >
                              <LottieView
                                autoPlay={true}
                                loop={true}
                                style={styles.lotiimg}
                                source={
                                  profileData?.serviceagreementpath === null
                                    ? require("../../utils/lottieIcons/upload-file.json")
                                    : require("../../utils/lottieIcons/View-Docs.json")
                                }

                                // source={require('../../utils/lottieIcons/upload-file.json')}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ position: "relative" }}>
                          <FlotingInput
                            label={"Selfie with Shop"}
                            value={profileData?.Iserviceagreementtatus}
                            // autoFocus={true} // Auto-focus on mount
                            onBlur={() => setIsMobileFocused(true)} // When this input blurs, focus the next input
                          />

                          <View style={styles.righticon2}>
                            <TouchableOpacity
                              onPress={() => {
                                if (profileData?.chkShopwithSalfie === null) {
                                  UploadOptions("Shop Selfie");
                                  setshowLoader(true);
                                  setImagePath("");
                                } else {
                                  setImagePath(
                                    `http://${APP_URLS.baseWebUrl}${profileData?.chkShopwithSalfie}`,
                                  );
                                  setImageModalVisible(true);
                                  setModalTitle("Selfie with Shop");
                                }
                              }}
                            >
                              <LottieView
                                autoPlay={true}
                                loop={true}
                                style={styles.lotiimg}
                                source={
                                  profileData?.serviceagreementpath === null
                                    ? require("../../utils/lottieIcons/upload-file.json")
                                    : require("../../utils/lottieIcons/View-Docs.json")
                                }

                                // source={require('../../utils/lottieIcons/upload-file.json')}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                  

                        <View style={{ position: "relative" }}>
                          <FlotingInput
                            label={"Address Proof"}
                            // autoFocus={true} // Auto-focus on mount
                          />
                          <View style={styles.righticon2}>
                            <TouchableOpacity
                              onPress={() => {
                                if (profileData?.chkaadharback === null) {
                                  UploadOptions(translate("Address Proof"));
                                  setImagePath("");
                                } else {
                                  const url = `${profileData?.chkaadharback}`;

                                  console.log(url);
                                  const newUrl = url.replace(
                                    /^https?:\/\/www\./,
                                    "https://",
                                  );
                                  console.log(newUrl);
                                  setImagePath(
                                    `http://${APP_URLS.baseWebUrl}` + newUrl,
                                  );
                                  setImageModalVisible(true);
                                  setModalTitle(
                                    translate("Address Proof (Back Side)"),
                                  );
                                }
                              }}
                            >
                              <LottieView
                                autoPlay={true}
                                loop={true}
                                style={styles.lotiimg}
                                source={require("../../utils/lottieIcons/View-Docs.json")}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(translate("EditProfile"), {
                        profileData: profileDataToUse,
                      })
                    }
                    style={{
                      padding: hScale(10),
                      backgroundColor: colorConfig.secondaryColor,
                      borderRadius: 10,
                      bottom: hScale(10),
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Click to Create Your Profile {">>"}
                    </Text>
                  </TouchableOpacity>
                  <Text></Text>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("VideoKYC", {
                        CNTNT: {
                          hindi: "",
                          Eng: "",
                        },
                      })
                    }
                    style={{
                      padding: hScale(10),
                      backgroundColor: colorConfig.secondaryColor,
                      borderRadius: 10,
                      bottom: hScale(10),
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Click to Create Video Kyc {">>"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <BottomSheet
        animationType="none"  
            isVisible={showStateList || showDistrictList}
            onBackdropPress={() => {
              setShowStateList(false);
              setShowDistrictList(false);
            }}
            scrollViewProps={{ scrollEnabled: false }}
            containerStyle={{ backgroundColor: "transparent" }}
          >
            <View
              style={{
                backgroundColor: colors.white,
                height: SCREEN_HEIGHT / 1.5,
                flex: 1,
                marginBottom: wScale(40),
              }}
            >
              <View style={styles.StateTitle}>
                <Text style={styles.stateTitletext}>
                  {showStateList
                    ? translate("select state")
                    : translate("select District")}
                </Text>
              </View>

              {showBottomSheetList()}
            </View>
          </BottomSheet>
          <ImageBottomSheet
            imagePath={imagePath}
            setModalVisible={setImageModalVisible}
            isModalVisible={isImageModalVisible}
            modalTitle={modalTitle}
            setImagePath={setImagePath}
            isUri={true}
            ReUpload={() => {
              setImageModalVisible(false);
              if (
                modalTitle == translate("Aadhar Card (Front Side)") ||
                modalTitle == translate("Address Proof (Back Side)")
              ) {
                requestCameraPermission("AA");
              } else {
                UploadOptions(modalTitle || lastupload);
              }
            }}
          />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
  },
  imgtopedit: {
    backgroundColor: "#fff",
    marginLeft: wScale(10),
    marginRight: wScale(10),
    // marginTop: wScale(15),
    borderTopLeftRadius: wScale(5),
    borderTopRightRadius: wScale(5),
  },

  editmainview: {
    flexDirection: "row",
    padding: wScale(10),
    borderRadius: wScale(5),
  },
  editimagestyle: {
    width: "30%",
  },
  StateTitle: {
    paddingVertical: 10,
    backgroundColor: "#ff4670",
    paddingTop: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  stateTitletext: {
    paddingHorizontal: 11,
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  editimageTextstyle: {
    width: "70%",
    paddingLeft: wScale(10),
  },
  selectgendtext: {
    position: "absolute",
    left: wScale(12),
    top: hScale(-9),
    backgroundColor: "#fff",
    paddingHorizontal: wScale(4),
    zIndex: 1,
    color: "#000",
  },
  profileImportantNote: {
    fontSize: wScale(22),
    alignSelf: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  retailstyle: {
    textAlign: "justify",
    fontSize: wScale(14),
    color: "#fff",
  },
  input: {
    borderWidth: wScale(0.5),
    borderColor: "#000",
    marginBottom: hScale(18),
    borderRadius: wScale(5),
    paddingLeft: wScale(15),
    fontSize: wScale(20),
    height: hScale(55),
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
  profileimgedit1: {
    position: "relative",
    borderWidth: wScale(4),
    borderColor: "#fff",
    padding: wScale(8),
    borderRadius: wScale(5),
    alignItems: "center",
    justifyContent: "center",
  },
  profileimgeditbutton: {
    position: "absolute",
    right: wScale(-10),
    top: hScale(-9),
    paddingLeft: wScale(2),
    paddingBottom: hScale(0.1),
  },
  personalinfoandkyc: {
    // flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: hScale(10),
    paddingBottom: hScale(10),
    marginLeft: wScale(10),
    marginRight: wScale(10),
    paddingLeft: wScale(10),
    paddingRight: wScale(10),
  },

  selectedTextbtn: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: wScale(18),
  },

  mainbody: {
    flex: 1,
    backgroundColor: "#fff",
    marginLeft: wScale(10),
    marginRight: wScale(10),
    marginBottom: hScale(10),
    borderBottomLeftRadius: wScale(5),
    borderBottomRightRadius: wScale(5),
    paddingHorizontal: wScale(10),
    paddingTop: hScale(10),
  },
  righticon: {
    position: "absolute",
    right: wScale(20),
    top: hScale(15),
  },
  righticon2: {
    position: "absolute",
    right: wScale(10),
    top: hScale(12),
  },
  lotiimg: {
    height: hScale(44),
    width: wScale(44),
  },
  loaderStyle: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
});

export default Profile;
