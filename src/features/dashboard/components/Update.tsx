import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import UpdateSvg from "../../drawer/svgimgcomponents/UpdateSvg";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import DynamicButton from "../../drawer/button/DynamicButton";
import { translate } from "../../../utils/languageUtils/I18n";
import DeviceInfo from 'react-native-device-info';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { onReceiveNotification2 } from "../../../utils/NotificationService";
const UpdateScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const { get } = useAxiosHook();

  const [latestVersion, setLatestVersion] = useState("...");
  const [currentVersion, setCurrentVersion] = useState(APP_URLS.version);
  const [id, setid] = useState('')
  const [response, setResponse] = useState(null);
  const [lastInstalled, setlastInstalled] = useState(null)
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const version = await get({ url: APP_URLS.current_version });

        console.log(version)
        setResponse(version)
        setLatestVersion(version.currentversion);
        setid(version.PackageName);
      } catch (error) {
        console.log("Version fetch error:", error);
      }
    };
    fetchVersion();
    //  getInstallTime()
  }, []);

  const getInstallTime = async () => {
    const first = await DeviceInfo.getFirstInstallTime();
    const last = await DeviceInfo.getLastUpdateTime();

    const firstTime = new Date(first).toLocaleString();
    const lastTime = new Date(last).toLocaleString();

    Alert.alert(
      "App Install Info",
      `First Install: ${firstTime}\nLast Update: ${lastTime}`
    );
  };
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const handleUpdate = async () => {
    try {
      if (!response) {
        Alert.alert("Error", "Version info not found");
        return;
      }

      if (response.isgoogle) {
        const url = `${APP_URLS.playUrl}${id}`;
        await Linking.openURL(url);
      } else {
        const apkUrl = `http://${APP_URLS.baseWebUrl}${APP_URLS.DownloadAPK}`;

        setIsDownloading(true);
        setDownloadProgress(0);

        onReceiveNotification2({
          notification: {
            title: 'Downloading App Update',
            body: 'Please Wait',
          },
        });

        const downloadPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/app-update-${Date.now()}.apk`;

        ReactNativeBlobUtil.config({
          //  trusty: true,          // ✅ bypasses SSL cert validation

          fileCache: true,
          path: downloadPath,     // ✅ direct path, no DownloadManager
          appendExt: 'apk',
        })
          .fetch('GET', apkUrl)
          .progress((received, total) => {        // ✅ now works correctly
            if (total > 0) {
              const percentage = Math.floor((received / total) * 100);
              setDownloadProgress(percentage);
              console.log(`Download progress: ${percentage}%`);
            }
          })
          .then((res) => {
            setIsDownloading(false);
            setDownloadProgress(100);

            // Install the APK
            ReactNativeBlobUtil.android.actionViewIntent(
              res.path(),
              'application/vnd.android.package-archive'
            );
          })
          .catch((errorMessage) => {
            setIsDownloading(false);
            console.log("Download error:", errorMessage);
            const apkUrl = `http://${APP_URLS.baseWebUrl}${APP_URLS.DownloadAPK}`;
           Linking.openURL( apkUrl);

            Alert.alert("Update Failed", "Could not download APK.");
          });
      }
    } catch (error) {
      setIsDownloading(false);
      Alert.alert(translate("Error"), translate("Something went wrong."));
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Animated/Floating Icon Wrapper */}
          <View style={styles.iconContainer}>
            <View style={styles.iconShadow}>
              <View style={styles.iconWrapper}>
                <UpdateSvg
                  progress={downloadProgress}
                  color2={colorConfig.primaryColor}
                  color={colorConfig.secondaryColor}
                />
              </View>
            </View>
          </View>

          <Text style={styles.title}>{translate("New Update Available")}</Text>
          <Text style={styles.subtitle}>
            {translate("A newer version of the app is available for a better experience.")}
          </Text>

          {/* Version Info Section */}
          <View style={styles.versionRow}>
            <View style={styles.versionTag}>
              <Text style={styles.versionLabel}>{translate("Latest")}</Text>
              <Text style={styles.versionValue}>V{latestVersion}</Text>
            </View>
            <Text style={styles.currentVersionText}>
              {translate("Current")}: V{currentVersion}
            </Text>
          </View>

          <View style={styles.updateCard}>
            <Text style={styles.updateTitle}>
              🚀 {translate("What's new in this version?")}
            </Text>
            <View style={styles.divider} />

            {[
              translate("Fixed minor bugs and crashes"),
              translate("Improved performance and speed"),
              translate("Enhanced design and usability"),
              translate("Security improvements"),
            ].map((item, index) => (
              <View key={index} style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: colorConfig.primaryColor }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button Section */}
        <View style={styles.bottomSection}>
          <DynamicButton
            onlong={getInstallTime}
            title={translate("Update Now")}
            onPress={handleUpdate}
          />
          <Text style={styles.note}>
            {translate("You will be redirected to Google Play Store.")}
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: "center",
    width: "90%",
    paddingTop: hScale(40),
    alignSelf: "center",
  },
  iconContainer: {
    marginBottom: hScale(25),
  },
  iconShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  iconWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: wScale(50),
    padding: wScale(25),
  },
  title: {
    fontSize: wScale(26),
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: hScale(10),
  },
  subtitle: {
    fontSize: wScale(14),
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    paddingHorizontal: wScale(20),
    marginBottom: hScale(25),
    lineHeight: hScale(20),
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hScale(25),
  },
  versionTag: {
    backgroundColor: "#FFFFFF",
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hScale(5),
    paddingHorizontal: wScale(12),
    borderRadius: 20,
    marginRight: wScale(15),
  },
  versionLabel: {
    fontSize: wScale(12),
    color: "#666",
    fontWeight: "600",
    marginRight: 5,
  },
  versionValue: {
    fontSize: wScale(13),
    color: "#000",
    fontWeight: "bold",
  },
  currentVersionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: wScale(13),
    fontWeight: '500'
  },
  updateCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    width: "100%",
    borderRadius: wScale(20),
    padding: wScale(20),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  updateTitle: {
    fontSize: wScale(16),
    fontWeight: "700",
    color: "#333",
    marginBottom: hScale(10),
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginBottom: hScale(15),
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hScale(12),
  },
  bulletDot: {
    width: wScale(6),
    height: wScale(6),
    borderRadius: 3,
    marginRight: wScale(12),
  },
  bulletText: {
    flex: 1,
    fontSize: wScale(14),
    color: "#555",
    lineHeight: hScale(18),
  },
  bottomSection: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: hScale(30),
  },
  note: {
    color: "rgba(255,255,255,0.7)",
    fontSize: wScale(11),
    marginTop: hScale(12),
    textAlign: "center",
  },
});

export default UpdateScreen;
