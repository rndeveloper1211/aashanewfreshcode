import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ToastAndroid, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard 
} from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { colors } from '../utils/styles/theme';
import { hScale, SCREEN_HEIGHT, wScale } from '../utils/styles/dimensions';
import { APP_URLS } from '../utils/network/urls';
import useAxiosHook from '../utils/network/AxiosClient';
import DynamicButton from '../features/drawer/button/DynamicButton';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';

const ForgotPasswordModal = ({
  showForgotPasswordModal,
  setShowForgotPasswordModal,
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo)
  const { post } = useAxiosHook();
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (input) => {
    const isMobileValid = /^\d{10}$/.test(input);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    return isMobileValid || isEmailValid;
  };

  const ForgotPassword = useCallback(async () => {
    if (!validateInput(mobile)) {
      ToastAndroid.showWithGravity(
        'Please enter a valid mobile number or email address.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      setIsLoading(false); // Fix: Loader stop karna zaroori hai validation fail pe
      return;
    }

    try {
      const data = { Email: mobile };
      const response = await post({
        url: APP_URLS.forgotLoginPassword,
        data: data,
      });

      if (response && response.Message) {
        ToastAndroid.showWithGravity(
          response.Message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        setShowForgotPasswordModal(false);
        setMobile(''); // Clean input
      } else {
        ToastAndroid.showWithGravity(
          'An error occurred. Please try again later.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
    } catch (error) {
      console.error('Error fetching dealer token status:', error);
      ToastAndroid.showWithGravity(
        'Failed to send password reset link. Please try again later.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } finally {
      setIsLoading(false);
      Keyboard.dismiss(); // Keyboard band karein request ke baad
    }
  }, [mobile, post, setShowForgotPasswordModal]);

  return (
    <BottomSheet animationType="none"  
      isVisible={showForgotPasswordModal}
      onBackdropPress={() => {
        setIsLoading(false);
        setShowForgotPasswordModal(false);
        Keyboard.dismiss();
      }}
      // Fabric Fix: Modal container ko stable rakhta hai
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      {/* FIX: KeyboardAvoidingView keyboard ke upar input ko dhakelega */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={styles.container}
      >
        <View style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
          <Text style={styles.headerText}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.infoText}>
            Enter your mobile number or email ID to reset your password
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              key="forgot_pwd_input" // Stable key for Fabric focus management
              style={styles.input}
              placeholder="Enter Mobile Number or Email ID"
              placeholderTextColor={colors.black75}
              onChangeText={setMobile}
              value={mobile}
              keyboardType={Platform.OS === 'android' ? 'default' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
              cursorColor={colorConfig.secondaryColor}
            />
          </View>

          <DynamicButton 
            title={isLoading ? <ActivityIndicator color={colorConfig.labelColor || '#fff'} size={'small'} /> : 'Send Password'}
            onPress={() => {
              setIsLoading(true);
              ForgotPassword();
            }} 
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    // Fabric mein exact height ki jagah minHeight ya flex use karein taaki resize ho sake
    minHeight: SCREEN_HEIGHT / 2.2, 
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: hScale(30), // Keyboard se thoda gap
  },
  header: {
    paddingVertical: hScale(15),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: wScale(20),
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: wScale(20),
    paddingTop: hScale(15)
  },
  infoText: {
    marginTop: 8,
    fontSize: wScale(16), // Thoda chhota kiya taaki layout manage ho sake
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.black75
  },
  inputContainer: {
    marginVertical: hScale(25), // top property ki jagah margin use karein
  },
  input: {
    width: '100%',
    height: hScale(50),
    borderColor: colors.ticker_border,
    borderWidth: 1,
    paddingHorizontal: wScale(10),
    fontSize: wScale(16),
    borderRadius: 5,
    color: colors.black
  },
});

export default ForgotPasswordModal;