import { translate } from "../../../utils/languageUtils/I18n";
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { hScale } from '../../../utils/styles/dimensions';

const CmsFinalOtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isChecked, setIsChecked] = useState(false);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity>
          {/* <Ionicons name="arrow-back" size={24} color="#fff" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translate("Cms_Code_Verification")}</Text>
      </View>

      <Image source={require('../../assets/checklist.png')} style={styles.image} />

      <Text style={styles.title}>{translate("Verification_Required")}</Text>
      <Text style={styles.description}>
        Please match the number of <Text style={styles.highlight}>Notes</Text> and the <Text style={styles.highlight}>{translate("total_amount")}</Text>. If everything is okay, complete the transaction by entering the OTP. <Text style={styles.success}>{translate("The_OTP_has_been_sent_to_the_store_contact_person")}</Text> with the details of the total amount.
      </Text>

      <View style={styles.infoRow}>
        <Text>{translate("ReQ_No_VW1457842514521")}</Text>
        <Text>{translate("Pickup_Time_10082025_1042_AM")}</Text>
      </View>

      <View style={styles.table}>
        {[...Array(6)].map((_, rowIndex) => (
          <View style={styles.tableRow} key={rowIndex}>
            <View style={styles.tableCell} /><View style={styles.tableCell} /><View style={styles.tableCell} />
          </View>
        ))}
      </View>

      <View style={styles.checkboxRow}>
        {/* <CheckBox value={isChecked} onValueChange={setIsChecked} /> */}
        <Text style={styles.checkboxText}>{translate("key_yesihave_181")}</Text>
      </View>

      <TouchableOpacity style={styles.sendOtpBtn}>
        <Text style={styles.sendOtpText}>{translate("Send_OTP_to_Customer_Point")}</Text>
      </TouchableOpacity>

      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
          />
        ))}
      </View>
      <Text style={styles.resendText}>If OTP is not received, Resend OTP</Text>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>{translate("Submit_OTP")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcff',
    paddingHorizontal: 16,
    paddingBottom:hScale(10)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8e2de2',
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    marginVertical: 8,
  },
  highlight: {
    color: 'orange',
    fontWeight: 'bold',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderWidth: 1,
    borderColor: '#000',
    height: 40,
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  checkboxText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  sendOtpBtn: {
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 12,
  },
  sendOtpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 18,
  },
  resendText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#555',
  },
  submitBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CmsFinalOtpVerification;
