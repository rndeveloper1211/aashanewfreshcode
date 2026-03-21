import React, { useEffect, useState } from 'react';
import { View, StyleSheet, NativeModules, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../../drawer/button/DynamicButton';

const PaysprintDmt = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const [merchantCode, setMerchantCode] = useState('');
    const [partnerApiKey, setPartnerApiKey] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const { post } = useAxiosHook();

    useEffect(() => {
        getDmtPayload();
    }, []);

    const getDmtPayload = async () => {
        try {
            const res = await post({ url: `MoneyDMT/api/PPI/info` });
            if (res && res.ADDINFO) {
                setMerchantCode(res.ADDINFO.merchantCode || '');
                setPartnerApiKey(res.ADDINFO.partnerApiKey || '');
                setPartnerId(res.ADDINFO.partnerId || '');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

const handleNext = async () => {
  if (!merchantCode) {
    Alert.alert("Error", "Please wait for data to load...");
    return;
  }

  try {
    const result = await NativeModules.AepsModule.initCredo(
      merchantCode,
      partnerApiKey,
      partnerId
    );

    console.log("DMT Response:", result);

    if (result === "CANCELLED") {
      Alert.alert("Status", "Transaction Cancelled by user");
    }
  } catch (error) {
    Alert.alert("SDK Error", error.message);
  }
};

    return (
        <View style={styles.main}>
            <LinearGradient 
                colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
                style={styles.gradient}
            >
                <View style={styles.inercontainer}>
                    {/* Aapka content yahan aayega */}
                </View>
                
                <DynamicButton
                    title={'Next'}
                    onPress={handleNext}
                />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#fff' },
    gradient: { flex: 1, padding: wScale(10) },
    inercontainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        marginBottom: hScale(20)
    }
});

export default PaysprintDmt;
