import 'react-native-gesture-handler';
import React, { useEffect, useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastProvider } from 'react-native-toast-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'; // Zaroori import
import 'react-native-reanimated';   // 👈 MUST ADD
import { store, persistor } from './src/reduxUtils/store';
import RNBootSplash from "react-native-bootsplash";
import { AppContainer } from './src/AppContainer';
import { navigationRef } from './src/utils/navigation/NavigationService';
import { Dispatch } from 'react';
import { setUnlocked } from './src/reduxUtils/store/userInfoSlice';
import { PaperProvider } from 'react-native-paper';

const AppContent = () => {
  const language = useSelector((state: any) => state.userInfo.appLanguage);
  const dispatch = useDispatch()
useEffect(() => {
    // Language badalte hi agar lock/unlock state reset karni hai toh
    dispatch(setUnlocked(false));
  }, [dispatch, language]);
  return (
    <NavigationContainer
      key={language}
      ref={navigationRef}
      onReady={() => {
        // Splash screen hide hone se pehle check karein ki layout ready hai
        RNBootSplash.hide({ fade: true });
      }}
    >
      <AppContainer />
    </NavigationContainer>
  );
};

function App() {
useEffect(() => {
  const isFabric = global?.nativeFabricUIManager != null;
  const isBridgeless = global?.RN$Bridgeless === true;
  const isHermes = !!global?.HermesInternal;

  if (__DEV__) {
    console.log('--- SYSTEM CHECK ---');
    console.log('Fabric Enabled:', isFabric);
    console.log('Bridgeless Mode:', isBridgeless);
    console.log('Hermes Enabled:', isHermes);
    console.log('--------------------');
  }
}, []);

  return (
    /** * STEP 1: GestureHandlerRootView sabse top par hona chahiye 
     * STEP 2: KeyboardProvider pure app ke insets ko handle karega 
     */
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          {/* <BottomSheetModalProvider>  */}
            <ToastProvider>
              <Provider store={store}>
                            <PaperProvider>

                <PersistGate loading={null} persistor={persistor}>
                  <AppContent />

                </PersistGate>
                            </PaperProvider>

              </Provider>
            </ToastProvider>
          {/* </BottomSheetModalProvider> */}
        </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;