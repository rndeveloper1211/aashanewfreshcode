import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { BottomSheet } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";
import { colors } from "../utils/styles/theme";

const OperatorBottomSheet = ({
  operatorData,
  stateData,
  isModalVisible,
  selectedOperator,
  setModalVisible,
  selectOperator,
  setOperatorcode,
  setCircle,
  setState,
  showState = false,
  setOperator,
  selectOperatorImage,
  path,
  handleItemPress,
}) => {

  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;

  const [selectbool, setSelectbool] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = (selectbool ? operatorData : stateData).filter(item =>
    selectbool
      ? item["Operatorname"].toLowerCase().includes(searchQuery.toLowerCase())
      : item["State Name"].toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    if (!isModalVisible) {
      setSearchQuery('');
    }
  }, [isModalVisible]);


  const showBottomSheetList = () => {
    return (
      <FlashList keyboardShouldPersistTaps={'always'}
        data={filteredData}
        renderItem={({ item }: { item: any }) => {
          return (
            <View>
              <TouchableOpacity
                style={[styles.operatorview]}
                onPress={async () => {
                  Keyboard.dismiss();
                  if (!showState) {
                    selectOperator(item["Operatorname"]);
                    setOperatorcode(item["OPtCode"]);
                    selectOperatorImage(item["path"]);
                    setModalVisible(false);
                  } else {
                    if (selectbool) {
                      setSelectbool(false);
                      setOperator?.(item["Operatorname"]);
                      setOperatorcode(item["OPtCode"]);
                      selectOperatorImage(item["path"]);
                      handleItemPress(item);
                    } else {
                      setSelectbool(true);
                      setCircle(item["State Name"]);
                      setState(item["State Name"]);
                      setModalVisible(false);
                    }
                  }
                  handleItemPress(item);
                }}
              >
                <Text style={[styles.operatornametext]} numberOfLines={1} ellipsizeMode="tail">
                  {selectbool ? item["Operatorname"] : item["State Name"]}
                </Text>

                {selectbool ? (
                  <Image
                    source={{ uri: item["path"] }}
                    style={styles.operatioimg}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          );
        }}
        estimatedItemSize={30}
      />
    );
  };

  return (
    <BottomSheet 
    animationType="none"
    isVisible={isModalVisible} keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.bottomsheetview}>
          <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
            <View style={styles.titleview}>
              {selectbool ? null : (
                <View style={{ marginRight: wScale(20) }}>
                  <Image style={styles.rightimg} source={{ uri: path }} />
                </View>
              )}
              <View>
                {selectbool ? null : (
                  <Text style={styles.stateTitletext}>{selectedOperator}</Text>
                )}
                <Text style={selectbool ? styles.stateTitletext : styles.stateTitletext2}>
                  {selectbool ? "Select Your Operator" : "Select Your Circle"}
                </Text>
              </View>
            </View>
            {selectbool ? (
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                <ClosseModalSvg2 />
              </TouchableOpacity>
            ) : null}
          </View>
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            style={styles.searchBar}
            placeholderTextColor={colors.black75}
            cursorColor={'colors.black'}
          />
          {showBottomSheetList()}
        </View>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomsheetview: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  StateTitle: {
    paddingVertical: hScale(10),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wScale(10),
    marginBottom: hScale(10),
  },
  stateTitletext: {
    fontSize: wScale(22),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  stateTitletext2: {
    fontSize: wScale(17),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  rightimg: {
    height: wScale(45),
    width: wScale(45),
  },
  operatorview: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: wScale(10),
  },
  operatornametext: {
    textTransform: "capitalize",
    fontSize: wScale(20),
    color: "#000",
    flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: wScale(0.5),
    alignSelf: "center",
    paddingVertical: hScale(30),
  },
  operatioimg: {
    width: wScale(45),
    height: wScale(45),
    marginRight: wScale(20),
  },
  searchBar: {
    borderColor: 'gray',
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    marginHorizontal: wScale(10),
    marginBottom: hScale(10),
    borderRadius: 5,
    color: colors.black75,
    fontSize: wScale(16),
  },
});

export default OperatorBottomSheet;