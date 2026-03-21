import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  BackHandler, 
  NativeModules, 
  TouchableOpacity 
} from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';
import { setUnlocked } from '../reduxUtils/store/userInfoSlice';

const { SecurityModule } = NativeModules;

export default function BiometricAuth() {
  const dispatch = useDispatch();
  const { unLocked } = useSelector(
    (state: RootState) => state.userInfo,
  );

  // Default true rakhein kyunki render tabhi hota hai jab unLocked false ho
  const [isModalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (unLocked === false) {
      authenticateWithNative();
    }
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Agar modal visible hai toh back button ko block karein
      return isModalVisible; 
    });

    return () => backHandler.remove();
  }, [unLocked, isModalVisible]);

const authenticateWithNative = async () => {
  try {
    const success = await SecurityModule.showScreenLock();

    if (success) {
      // ✅ Authentication success
      dispatch(setUnlocked(true));
      setModalVisible(false);
    } else {
      // ❌ User ne cancel kiya ya fail hua
      // Yaha bhi aage allow karna hai
      dispatch(setUnlocked(true));
      setModalVisible(false);
    }

  } catch (error) {
    // ⚠️ Agar phone me koi screen lock set nahi hai
    console.log('No Screen Lock Found:', error);

    // ✅ Direct aage allow kar do
    dispatch(setUnlocked(true));
    setModalVisible(false);
  }
};

  return (
  null
  );
}

// Styles remains the same...

