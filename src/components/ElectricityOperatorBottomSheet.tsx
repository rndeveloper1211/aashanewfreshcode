import { BottomSheet } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import React, { useState, useCallback, useMemo } from "react";
import { 
  Text, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard 
} from "react-native";

import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import NoDatafound from "../features/drawer/svgimgcomponents/Nodatafound";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";
import { colors } from "../utils/styles/theme";
import { translate } from "../utils/languageUtils/I18n";

const ElectricityOperatorBottomSheet = ({
  operatorData = [],
  stateData = [],
  isModalVisible,
  setModalVisible,
  setOperatorcode,
  setState,
  setOperator,
  GetOptlist,
  handleItemPress,
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;

  const [selectbool, setSelectbool] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Performance Optimization: Har keypress par filtered data memoize hoga
  const filteredData = useMemo(() => {
    const data = selectbool ? stateData : operatorData;
    const searchKey = selectbool ? "State Name" : "Operatorname";
    
    return data.filter(item =>
      item[searchKey]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectbool, stateData, operatorData, searchQuery]);

  // 2. Selection Logic: Fabric-ready callback taaki thread freeze na ho
  const onSelectItem = useCallback((item) => {
    handleItemPress(item);
    if (selectbool) {
      setSelectbool(false);
      setState(item['State Name']);
      GetOptlist(item['Sate Id']);
      setSearchQuery('');
    } else {
      // Final selection par modal band aur keyboard dismiss
      setOperatorcode(item['OPtCode']);
      setOperator(item['Operatorname']);
      setModalVisible(false);
      setSelectbool(true); // Reset for next time
      setSearchQuery('');
      Keyboard.dismiss();
    }
  }, [selectbool, handleItemPress, setState, GetOptlist, setOperatorcode, setOperator, setModalVisible]);

  // 3. Render Item: Memory leak rokne ke liye memoized function
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.operatorview}
      onPress={() => onSelectItem(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.operatornametext}>
        {selectbool ? item['State Name'] : item['Operatorname']}
      </Text>
    </TouchableOpacity>
  ), [selectbool, onSelectItem]);

  return (
    <BottomSheet 
    animationType="none"
      isVisible={isModalVisible}
      onBackdropPress={() => {
         setModalVisible(false);
         setSelectbool(true);
         setSearchQuery('');
         Keyboard.dismiss();
      }}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      {/* 4. Keyboard Handling: Fabric mein iska hona must hai */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={styles.bottomsheetview}
      >
        <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
          <View style={styles.titleview}>
            <Text style={styles.stateTitletext}>
              {selectbool ? translate("Select Your State") : translate("Select Your Operator")}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setSelectbool(true);
              setSearchQuery('');
              Keyboard.dismiss();
            }}
            activeOpacity={0.7}
          >
            <ClosseModalSvg2 />
          </TouchableOpacity>
        </View>

        <TextInput
          key="selec_search_input"
          placeholder={translate("Search...")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
          placeholderTextColor={colors.black75}
          cursorColor="#000"
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />

        <View style={styles.listContainer}>
          {!selectbool && operatorData.length === 0 ? (
            <View style={styles.noDataView}>
              <NoDatafound />
              <Text style={{color: '#000', marginTop: 10}}>{translate("No Operator Found")}</Text>
            </View>
          ) : (
            <FlashList
              data={filteredData}
              renderItem={renderItem}
              // 6. FlashList Fix: Accurate estimated size blinking rokta hai
              estimatedItemSize={75} 
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomsheetview: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.4, // Keyboard ke liye optimal height
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  StateTitle: {
    paddingVertical: hScale(12),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wScale(15),
    marginBottom: hScale(5),
  },
  stateTitletext: {
    fontSize: wScale(20),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  listContainer: {
    flex: 1,
    minHeight: 100,
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hScale(50)
  },
  operatorview: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wScale(15),
    borderBottomColor: "#eee",
    borderBottomWidth: wScale(1),
  },
  operatornametext: {
    textTransform: "capitalize",
    fontSize: wScale(18),
    color: "#000",
    flex: 1,
    paddingVertical: hScale(25),
  },
  searchBar: {
    borderColor: '#ccc',
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    marginHorizontal: wScale(15),
    marginBottom: hScale(10),
    borderRadius: 8,
    color: "#000",
    height: hScale(48),
    fontSize: wScale(16),
    backgroundColor: '#f9f9f9'
  },
});

export default ElectricityOperatorBottomSheet;