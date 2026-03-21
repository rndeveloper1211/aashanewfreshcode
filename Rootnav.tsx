import { useSelector } from "react-redux";
import { RootState } from "./src/reduxUtils/store";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./src/utils/navigation/NavigationService";
import RNBootSplash from 'react-native-bootsplash';
import { AppContainer } from "./src/AppContainer";

function MainApp() {
  const appLanguage = useSelector(
    (state: RootState) => state.userInfo.appLanguage
  );

  return (
    <NavigationContainer
      key={appLanguage}
      ref={navigationRef}
      onReady={() => {
        RNBootSplash.hide({ fade: true });
      }}
    >
      <AppContainer />
    </NavigationContainer>
  );
}

export default MainApp;