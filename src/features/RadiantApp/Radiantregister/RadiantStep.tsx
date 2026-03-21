import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import StepIndicator from 'react-native-step-indicator';
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import BasicInfo from "./BasicInfo";
import { colors } from "../../../utils/styles/theme";
import { StepIndicatorStyle } from "./stepIndicatorRadiantStyle";
import AddressRadiant from "./AddressRadiant ";
import DrawingLaises from "./DrawingLaises";
import ReferencesRadiant from "./ReferencesRadiant";
import Qualification from "./Qualification";
import UploadDocRadiant from "./UploadDocRadiant";
import { RadiantContext } from "./RadiantContext";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import { useNavigation } from "@react-navigation/native";

const RadiantStep = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [formStatus, setFormStatus] = useState({
    form1status: false,
    form2status: false,
    form3status: false,
    form4status: false,
    form5status: false,
    form6status: false,
  })
  const { post } = useAxiosHook();

  const labels = [
    'Basic info',
    'Address',
    'Qualification',
    'Vehicles',
    'References',
    'Upload Doc',
  ];


  const renderStepIndicator = ({ position, stepStatus }) => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {stepStatus === 'finished' && <CheckSvg size={14} />}
      </View>
    );
  };

  const getStepStatus = (position) => {
    if (position < currentPage) return 'finished';
    if (position === currentPage) return 'current';
    return 'unfinished';
  };
  const onStepPress = (position) => {
    // setCurrentPage(position);
  };
  const getScreen = useCallback(() => {
    switch (currentPage) {
      case 0:
        return <BasicInfo />;
      case 1:
        return <AddressRadiant />;
      case 2:
        return <Qualification />;
      case 3:
        return <DrawingLaises />;
      case 4:
        return <ReferencesRadiant />;
      case 5:
        return <UploadDocRadiant />;
      default:
        return <UploadDocRadiant />;
    }

  }, [currentPage]);

  useEffect(() => {
    const FormStatus = async () => {
      try {
        const res = await post({ url: APP_URLS.RadiantFormStatus })
        console.log(res)
        console.warn(res, '*-*-*-*-*-')
        setFormStatus({
          form1status: res.form1status,
          form2status: res.form2status,
          form3status: res.form3status,
          form4status: res.form4status,
          form5status: res.form5status,
          form6status: res.form6status,
        });
        if (!res.form1status) {
          setCurrentPage(0);
        } else if (!res.form2status) {
          setCurrentPage(1);
        } else if (!res.form3status) {
          setCurrentPage(2);
        } else if (!res.form4status) {
          setCurrentPage(3);
        } else if (!res.form5status) {
          setCurrentPage(4);
        } else if (!res.form6status) {
          setCurrentPage(5);
        } else {
          setCurrentPage(5);
        }

      } catch (error) {
      }
    };
    FormStatus()
  }, [])
  const navigation = useNavigation<any>();

  return (
    <RadiantContext.Provider
      value={{
        currentPage,
        setCurrentPage,
      }}>
      <View style={styles.main}>
        <AppBarSecond title={labels[currentPage]}
          onPressBack={() => {
            if (currentPage > 0) {
              setCurrentPage(currentPage - 1);
            }else{
                        navigation.navigate('DashboardScreen');

            }
          }}
        />
        <View style={styles.stepIndicator}>
          <StepIndicator
            stepCount={6}
            customStyles={StepIndicatorStyle}
            currentPosition={currentPage}
            onPress={onStepPress}
            labels={labels}
            renderStepIndicator={renderStepIndicator}

          />

        </View>
        <>{getScreen()}
        </>

      </View>
    </RadiantContext.Provider>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.base
  },
  stepIndicator: {
    marginTop: hScale(10),
    marginBottom: hScale(10),
  },
});

export default RadiantStep;
