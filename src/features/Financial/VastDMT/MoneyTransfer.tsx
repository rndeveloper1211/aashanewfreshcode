import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DynamicButton from '../../drawer/button/DynamicButton';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import GetBenifiaryScreen from './GetBenifiaryScreen';
import DmtTabScreen from '../Dmt/DmtTabScreen';

const MoneyTransferScreen = () => {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const { get, post } = useAxiosHook();
const [isOk,setIsOk] = useState(false);
  useEffect(() => {


    
    const CheckDmtstatus = async () => {
      try {
        const url = `${APP_URLS.Dmtstatus}`;
        const response = await get({ url: url });
        console.log(response, '******************');
        const msg = response.Message;
        const Response = response.Response;
        const Name = response.Name;
    
        if (Response === 'Success') {
        } else if (Response === 'BOTHNOTDONE' || Response === 'NOTOK' || Response === 'ALLNOTDONE' || Response === 'PURCHASE' || Response === 'OTPREQUIRED') {
        
        
        console.log('ServicepurchaseScreen')
          navigation.navigate('ServicepurchaseScreen', { typename: 'DMT' });
        }
    
      } catch (error) {
        console.log(error);
      }
    };
    
    CheckDmtstatus();
  }, []);

  const buttonTextColor = colorScheme === 'dark' ? 'white' : 'black';


  return (

    <DmtTabScreen/>
    // <View>
    //   <AppBarSecond title={'To Bank Account'} />
    //   <View style={styles.container}>


    //     <DynamicButton
    //       title={'To Account'}
    //       onPress={() => {
    //         navigation.navigate('DmtTabScreen');

    //        CheckDmtstatus();

    //       }}
    //       styleoveride={{ marginVertical: hScale(10), }}
    //     />

    //     <DynamicButton
    //       title={'To Upi'}
    //       onPress={() => {
    //         navigation.navigate('UpiGetBenificiaryScreen');

    //       }}
    //       styleoveride={{ marginVertical: hScale(10), }}
    //     /> 

    //   </View>
    // </View>


  );
};

export default MoneyTransferScreen;
