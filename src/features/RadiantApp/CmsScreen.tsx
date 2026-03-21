import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import RadiantTransactionScreen from './RadiantTransactionScreen';
import Pendingcms from './RadiantNewClient/Pendingcms';
import InterestVerification from './RadiantNewClient/InterestVerification';
import RadiantStep from './Radiantregister/RadiantStep';
import RadiantWellCome from './RadiantNewClient/RadiantWellCome';
import CheckPendingForm from './RadiantNewClient/CheckPendingForm';
import DownloadDocRadiant from './Radiantregister/DownloadDocRadiant';

import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { RootState } from '../../reduxUtils/store';
import { clearEntryScreen, setRceID, setRctype, } from '../../reduxUtils/store/userInfoSlice';
import CmsPayoutStructure from './RadiantNewClient/CmsPayoutStructure';
import SelfieScreen from './selfiescreen';
import ImgPendingcms from './RadiantNewClient/ImgPendingcms';
import AddMoneyPayResponse from '../../components/AddMoneyPayResponse';
import CrePayout from './CmsSalarySheet/CrePayout';
import PickupSalaryCalendar from './CmsSalarySheet/PickupSalaryCalendar';
import CmsShowPayoutStructure from './RadiantNewClient/CmsShowPayoutStructure';
import CmsPrePay from './RadiantTrxn/CmsPrePay';
import TestingScreen from '../../AN';

const CmsScreen = () => {
  const { rceIdStatus, } = useSelector((state: RootState) => state.userInfo);

  const [status, setStatus] = useState<boolean | null>(null);
  const [status2, setStatus2] = useState<string | null>(null);
  const [checkInfo, setCheckInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageStatus, setImageStatus] = useState('');
  const { post } = useAxiosHook();
  const dispatch = useDispatch();

// return <TestingScreen/>


  useEffect(() => {
    const loadStatus = async () => {
      setLoading(true);
      dispatch(clearEntryScreen(null))
      try {
        // API 1
        const res1 = await post({ url: APP_URLS.RCEID });
        const s1 = res1?.Content?.ADDINFO?.sts ?? null;
        const t1 = res1?.Content?.ADDINFO?.Type ?? null;
        const rceID = res1?.Content?.ADDINFO?.CEID ?? null;

        const t3 = res1?.Content?.ADDINFO?.ImageStatus ?? null;
        console.log(res1, '===');

        setStatus(s1);
        dispatch(setRctype(t1));
        dispatch(setRceID(rceID))
        setImageStatus(t3)
        if (s1 === false) {
          const res2 = await post({ url: APP_URLS.RadiantCEIntersetCheck });
          const s2 = res2?.Content?.ADDINFO?.sts ?? null;
          setStatus2(s2);

          if (s2 === 'Success' || s2 === 'DocVerification') {
            const res3 = await post({ url: APP_URLS.CheckPendingForm });
            setCheckInfo(res3?.status ?? null);
          }
        }

      } catch (error) {
        console.error('Error:', error);
      }

      setLoading(false);
    };

    loadStatus();
  }, [dispatch]);

  if (loading || status === null || (status === false && status2 === null)) {
    return <RadiantWellCome />;
  }

  const renderScreen = () => {

    // if (imageStatus == 'NEW') {
    //   return <SelfieScreen />

    // }
    // if (imageStatus == 'Pending') {
    //   return <ImgPendingcms />
    // }
    if (status === true) {
      return <RadiantTransactionScreen />;
    }

    if (status === false) {
      switch (status2) {
        case 'Pending':
        case 'DocPending':
        case 'CERegPending':
        case 'CEPointsPending':
          return <Pendingcms />;

        case 'Success':
        case 'DocVerification':
          if (checkInfo === 'Pending') return <CheckPendingForm />;
          if (checkInfo === 'Approved') return <DownloadDocRadiant />;
          return <RadiantStep />;

        case 'DocSuccess':
          return <RadiantTransactionScreen />;

        default:
          return <InterestVerification />;
      }
    }

    return <RadiantWellCome />;
  };

  return <View style={styles.container}>
    {renderScreen()}
    {/* <CrePayout/> */}
    {/* <PickupSalaryCalendar/> */}
    {/* <AddMoneyPayResponse /> */}
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default CmsScreen;
