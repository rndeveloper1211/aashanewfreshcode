import { translate } from "../../../utils/languageUtils/I18n";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const frameSize = width * 0.75;

const QRScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const isProcessing = useRef(false);

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCameraActive) {
      scanAnim.setValue(0);
      Animated.loop(
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isCameraActive]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, frameSize - 4],
  });

  const parseUPIData = (data) => {
    if (!data || !data.startsWith('upi://')) return null;
    try {
      const obj = {};
      const queryString = data.split('?')[1];
      if (!queryString) return null;
      queryString.split('&').forEach((item) => {
        const [key, value] = item.split('=');
        if (key && value) obj[key] = decodeURIComponent(value);
      });
      return obj;
    } catch {
      return null;
    }
  };

  const checkPermission = useCallback(async () => {
    const status = await Camera.getCameraPermissionStatus();
    if (status === 'granted') {
      setHasPermission(true);
    } else {
      const newStatus = await Camera.requestCameraPermission();
      setHasPermission(newStatus === 'granted');
    }
  }, []);

  useEffect(() => {
    if (isFocused) checkPermission();
  }, [isFocused, checkPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isCameraActive && !isProcessing.current) {
        const data = codes[0].value;
        isProcessing.current = true;
        setIsCameraActive(false);

        const parsed = parseUPIData(data);
        if (parsed) {
          navigation.navigate('ShowUPIData', { upi: parsed });
        } else {
          Alert.alert('Invalid QR', 'Not a valid UPI QR', [
            {
              text: 'OK',
              onPress: () => {
                isProcessing.current = false;
                setIsCameraActive(true);
              },
            },
          ]);
        }
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{translate("Camera_access_required")}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={checkPermission}>
          <Text style={styles.primaryButtonText}>{translate("Allow_Permission")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00B9F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && isCameraActive}
        codeScanner={codeScanner}
      />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.topCard}>
          <Text style={styles.title}>{translate("Scan_QR_Code")}</Text>
          <Text style={styles.subtitle}>{translate("Hold_your_phone_steady")}</Text>
        </View>

        <View style={styles.scannerWrapper}>
          <View style={styles.scannerFrame}>
            <LinearGradient colors={['#00B9F1', '#0A84FF']} style={styles.glowBorder} />
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          </View>
        </View>

        {/* Simplified Bottom Panel */}
        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={[styles.scanAgainBtn, !isCameraActive && { backgroundColor: '#FF3B30' }]}
            onPress={() => {
              isProcessing.current = false;
              setIsCameraActive(true);
            }}
            disabled={isCameraActive}
          >
            <Text style={styles.scanAgainText}>
              {isCameraActive ? 'Scanning...' : 'Tap to Scan Again'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default QRScanScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  topCard: {
    marginTop: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#000' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  scannerWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: frameSize, height: frameSize, borderRadius: 25, overflow: 'hidden' },
  glowBorder: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
  scanLine: { width: '100%', height: 3, backgroundColor: '#00B9F1' },
  bottomPanel: {
    width: '100%',
    paddingBottom: 40,
    paddingTop: 20,
    alignItems: 'center',
  },
  scanAgainBtn: {
    backgroundColor: 'rgba(0, 185, 241, 0.2)',
    borderWidth: 1,
    borderColor: '#00B9F1',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  scanAgainText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 5, borderLeftWidth: 5, borderColor: '#00B9F1', borderTopLeftRadius: 20 },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 5, borderRightWidth: 5, borderColor: '#00B9F1', borderTopRightRadius: 20 },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: '#00B9F1', borderBottomLeftRadius: 20 },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 5, borderRightWidth: 5, borderColor: '#00B9F1', borderBottomRightRadius: 20 },
  errorText: { color: '#fff', marginBottom: 20 },
  primaryButton: { backgroundColor: '#00B9F1', padding: 15, borderRadius: 25 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold' },
});