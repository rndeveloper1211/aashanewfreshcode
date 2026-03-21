import { translate } from "../utils/languageUtils/I18n";
import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';

import { colors } from '../utils/styles/theme';
import { hScale, wScale, SCREEN_HEIGHT } from '../utils/styles/dimensions';
import { APP_URLS } from '../utils/network/urls';
import useAxiosHook from '../utils/network/AxiosClient';
import DynamicButton from '../features/drawer/button/DynamicButton';
import { RootState } from '../reduxUtils/store';

interface ForgotPasswordModalProps {
  id?: string;
  showForgotPasswordModal: boolean;
  setShowForgotPasswordModal: (value: boolean) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  id,
  showForgotPasswordModal,
  setShowForgotPasswordModal,
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const { post } = useAxiosHook();

  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showForgotPasswordModal) {
      setMobile(id || '');
    }
  }, [showForgotPasswordModal, id]);

  const closeModal = () => {
    if (!isLoading) {
      setShowForgotPasswordModal(false);
      Keyboard.dismiss();
    }
  };

  const internalHandleForgotPassword = useCallback(async () => {
    const validateInput = (input: string) => {
      const isMobileValid = /^\d{10}$/.test(input);
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      return isMobileValid || isEmailValid;
    };

    if (!validateInput(mobile)) {
      const msg = 'Please enter a valid mobile number or email.';
      Platform.OS === 'android' ? ToastAndroid.show(msg, ToastAndroid.SHORT) : alert(msg);
      return;
    }

    setIsLoading(true);
    try {
      const response = await post({
        url: APP_URLS.forgotLoginPassword,
        data: { Email: mobile },
      });

      if (response?.Message) {
        Platform.OS === 'android' ? ToastAndroid.show(response.Message, ToastAndroid.SHORT) : alert(response.Message);
        setMobile('');
        setShowForgotPasswordModal(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      Keyboard.dismiss();
    }
  }, [mobile, post, setShowForgotPasswordModal]);

  return (
    <Modal
      visible={showForgotPasswordModal}
      transparent={true}
      animationType="fade" // Pop-up feel ke liye fade better hai center modal mein
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                {/* Modern Header */}
                <View style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
                  <Text style={styles.headerText}>{translate("Reset_Password")}</Text>
                </View>

                <View style={styles.body}>
                  <Text style={styles.subText}>{translate("Enter_your_mobile_number_or_email_ID_to_reset_your_password")}</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>{translate("Mobile_Email")}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 9876543210 or name@mail.com"
                      placeholderTextColor="#A0A0A0"
                      onChangeText={setMobile}
                      value={mobile}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      cursorColor={colorConfig.secondaryColor}
                    />
                  </View>

                  <View style={styles.buttonWrapper}>
                    <DynamicButton
                      title={
                        isLoading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          'Forgot Password'
                        )
                      }
                      onPress={internalHandleForgotPassword}
                      disabled={isLoading}
                      // Yahan aap button ka internal style pass kar sakte hain agar DynamicButton support karta ho
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Backdrop thoda dim
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wScale(25),
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // iOS style high border radius
    overflow: 'hidden',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    // Android Shadow
    elevation: 10,
  },
  header: {
    paddingVertical: hScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: wScale(19),
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  body: {
    padding: wScale(24),
  },
  subText: {
    fontSize: wScale(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: hScale(20),
    marginBottom: hScale(25),
  },
  inputContainer: {
    marginBottom: hScale(20),
  },
  label: {
    fontSize: wScale(12),
    color: '#333',
    fontWeight: '600',
    marginBottom: hScale(8),
    marginLeft: wScale(4),
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: hScale(54),
    backgroundColor: '#F2F2F7', // iOS Light Gray Background
    borderRadius: 12,
    paddingHorizontal: wScale(16),
    fontSize: wScale(15),
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  buttonWrapper: {
    marginTop: hScale(10),
  },
});

export default ForgotPasswordModal;