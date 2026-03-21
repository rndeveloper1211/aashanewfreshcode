import { BottomSheet } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";

import ClosseModalSvg from "../features/drawer/svgimgcomponents/ClosseModal";
import { FlashList } from "@shopify/flash-list";
import NoDatafound from "../features/drawer/svgimgcomponents/Nodatafound";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";

const RecentHistory = ({

  isModalVisible,
  setModalVisible,
  historylistdata,
  onBackdropPress,
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const color3 = `${colorConfig.primaryColor}10`;


  const recenttransactionlist = () => {
    return (
      historylistdata.length === 0 ? (
        <View style={styles.nodataview}>
          <NoDatafound />

        </View>
      ) : (
        <FlashList
          data={historylistdata}
          renderItem={({ item }: { item: any }) => {
            return (
              <TouchableOpacity style={[styles.transactionContainer, { backgroundColor: color3 }]}>
                {item['Operator_name'] === 'JIO' ? (
                  <Image source={require('.././utils/svgUtils/JIO.png')} style={styles.operatioimg} />
                ) : item['Operator_name'] === 'Vodafone' || item['Operator_name'] === 'Vodaidea' ? (
                  <Image source={require('.././utils/svgUtils/VI.png')} style={styles.operatioimg} />
                ) : item['Operator_name'] === 'Airtel' || item['Operator_name'] === 'Airtel Pre On Post' ? (
                  <Image source={require('.././utils/svgUtils/Airtel.png')} style={styles.operatioimg} />
                ) : item['Operator_name'] === 'BSNL' ? (
                  <Image source={require('.././utils/svgUtils/BSNL.png')} style={styles.operatioimg} />
                ) : item['Operator_name'] === 'Jio Lite' ? (
                  <Image source={require('.././utils/svgUtils/JIO.png')} style={styles.operatioimg} />
                ) : (
                  <Image source={require('.././utils/svgUtils/exclamation-mark.png')} style={styles.operatioimg} />
                )}

                <View style={styles.leftContainer}>
                  <Text style={styles.dateTimeText}>{item['Reqesttime']}</Text>
                  <Text style={styles.mobileNumberText}>{item['Recharge_number']}</Text>
                  <Text style={styles.mobileNumberText}>{item['Operator_name']}</Text>
                </View>

                <View style={styles.rightContainer}>
                  <Text style={styles.amountText}>₹ {item['Recharge_amount']}</Text>
                  <Text style={[
                    styles.rechTypeText,
                    {
                      color: item['Status'] === 'SUCCESS' ? 'green' : item['Status'] === 'FAILED' ? 'red' :
                        '#a89b0a'
                    }
                  ]}>
                    {item['Status']}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )
    );
  };
  useEffect(() => {
  })

  return (
    <BottomSheet
animationType="none"
      isVisible={isModalVisible}
      onBackdropPress={onBackdropPress}
      containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.8)', paddingBottom:hScale(70)}}>
      <View style={styles.bottomsheetview}>
        <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
          <View style={styles.titleview}>
            <Text style={styles.stateTitletext}>
              Recent 5 Transaction
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}

            activeOpacity={0.7}>
            <ClosseModalSvg2 />
          </TouchableOpacity>
        </View>
        {recenttransactionlist()}
      </View>
    </BottomSheet>
  );
};
const styles = StyleSheet.create({
  bottomsheetview: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  StateTitle: {
    paddingVertical: hScale(10),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wScale(10),
    marginBottom: hScale(10)
  },
  stateTitletext: {
    fontSize: wScale(22),
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  titleview: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wScale(8),
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: hScale(10),
    paddingVertical: hScale(10),
    marginHorizontal: wScale(10)
  },
  leftContainer: {
    flex: 1,
  },
  dateTimeText: {
    fontSize: wScale(14),
    fontWeight: 'bold',
    marginBottom: hScale(5),
  },

  mobileNumberText: {
    fontSize: 14,
    color: '#555',
  },
  amountText: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    color: '#000',
  },
  rechTypeText: {
    fontSize: wScale(14),
    color: '#666',
  },
  rightContainer: {
    marginLeft: wScale(15),
    alignItems: 'flex-end',
  },
  nodata: {
    width: '100%',
    textAlign: 'center',
    color: '#000',
    fontSize: wScale(16)
  },
  nodataview: {
    alignItems: 'center',
    paddingBottom: hScale(20)
  },
  operatioimg: {
    width: wScale(45),
    height: wScale(45),
    marginRight: wScale(20),
  },
});
export default RecentHistory;