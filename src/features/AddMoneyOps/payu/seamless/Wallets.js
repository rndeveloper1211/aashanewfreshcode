import { translate } from "../../../../utils/languageUtils/I18n";
import React from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity ,DeviceEventEmitter} from 'react-native';
import { CBParams ,getHash } from '../utils';
import PayUSdk from 'payu-core-pg-react';
import {initiatePayment as initPayment} from './PaymentOptions'

const Wallets = (route,props) => {
  const { navigation } = route

  const walletMakePayment = (bank) => {
    var commonParams=CBParams(route);
    var payuSDKParams={
      ...route,
      key: route.merchantKey,
      bankCode:bank,
      paymentType:"Cash Card"
    };
    console.log(payuSDKParams);
    payuSDKParams["hash"]=getHash(payuSDKParams);
    
    PayUSdk.makePayment(
      payuSDKParams,
      (response) => {
        var resp=JSON.parse(response)
       
        commonParams["cb_config"]={
          url:resp.url,
          post_data:resp.data
        }
        resp["paymentType"]=route.paymentType;
        resp["cbParams"]=commonParams
        initPayment(resp,navigation)
      },
      (err) => {
        Alert.alert('Error', JSON.stringify(err));
      }
    );
    
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#96b720' }]}
        onPress={() => walletMakePayment('AMON')}
      >
        <Text style={styles.walletText}>{translate("Airtel_Money")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#e2315b' }]}
        onPress={() => initiatePayment('AMZPAY')}
      >
        <Text style={styles.walletText}>{translate("Amazon_Pay")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#96b720' }]}
        onPress={() => walletMakePayment('CITRUSW')}
      >
        <Text style={styles.walletText}>{translate("Citrus_Wallet")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#e2315b' }]}
        onPress={() => walletMakePayment('FREC')}
      >
        <Text style={styles.walletText}>{translate("FreeCharge_PayLaterUPIWallet")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#96b720' }]}
        onPress={() => walletMakePayment('JIOM')}
      >
        <Text style={styles.walletText}>{translate("Jio_Money")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#e2315b' }]}
        onPress={() => walletMakePayment('MOBIKWIK')}
      >
        <Text style={styles.walletText}>{translate("Mobikwik_Wallet")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#96b720' }]}
        onPress={() => walletMakePayment('OLAM')}
      >
        <Text style={styles.walletText}>{translate("OlaMoney")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#e2315b' }]}
        onPress={() => walletMakePayment('TWID')}
      >
        <Text style={styles.walletText}>{translate("Pay_with_Rewards")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#96b720' }]}
        onPress={() => walletMakePayment('PAYTM')}
      >
        <Text style={styles.walletText}>{translate("Paytm")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#e2315b' }]}
        onPress={() => walletMakePayment('PHONEPE')}
      >
        <Text style={styles.walletText}>{translate("PhonePe")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#96b720' }]}
        onPress={() => walletMakePayment('PAYZ')}
      >
        <Text style={styles.walletText}>{translate("HDFC_Bank_PayZapp")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textinput: {
    height: 40,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    paddingBottom: 16,
    fontSize: 20,
  },
  walletItem: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    marginTop: 8
  },
  walletText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 12
  }
});

export default Wallets;
