import React from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';

const SafeWrapper = ({ children }) => {
  const { colorConfig, needUpdate, dashboardData, userId } = useSelector((state: RootState) => state.userInfo);
  const insets = useSafeAreaInsets();
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colorConfig.primaryColor?colorConfig.primaryColor:'#000000'// 1. Yahan Header ka Blue color dein
    }}>
      {/* 2. Content ko ek alag view mein rakhein jo baaki screen white rakhe */}
      <View style={{ 
        flex: 1, 
        marginTop: insets.top, // Padding ki jagah MarginTop try karein
      backgroundColor: colorConfig.primaryColor?colorConfig.primaryColor:'#000000'// 1. Yahan Header ka Blue color dein
      }}>
        {children}
      </View>
    </View>
  );
};

export default SafeWrapper;
