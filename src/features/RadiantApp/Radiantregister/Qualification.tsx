import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, ToastAndroid, TouchableOpacity, ActivityIndicator } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import DynamicButton from "../../drawer/button/DynamicButton";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import Calendarsvg from "../../drawer/svgimgcomponents/Calendarsvg";
import { BottomSheet } from "@rneui/base";
import CustomCalendar from "../../../components/Calender";
import ShowLoader from "../../../components/ShowLoder";
import { RadiantContext } from "./RadiantContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Qualification = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const { post } = useAxiosHook();
  const [isLoading, setIsloading] = useState(true);
  const [isLoading2, setIsloading2] = useState(false);
  const [iscalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentEditingDate, setCurrentEditingDate] = useState(null);
  const [qualifications, setQualifications] = useState([
    {
      id: 1,
      course: "",
      specialization: "",
      fromDate: "",
      toDate: "",
      percentage: "%",
      boardOrUniversity: ""
    }
  ]);
  const handleDateSelected = (data: string) => {
    if (currentEditingDate) {
      const { id, field } = currentEditingDate;
      setQualifications(qualifications.map(qual =>
        qual.id === id ? { ...qual, [field]: data } : qual
      ));
    }
    setIsCalendarVisible(false);
  };
  const openCalendar = (id: number, field: string) => {
    setCurrentEditingDate({ id, field });
    setIsCalendarVisible(true);
  };
  const validateField = (field, value, id) => {
    switch (field) {
      case 'course':
        return typeof value === 'string' && value.trim() ? null : "Course name is required";
      case 'specialization':
        return typeof value === 'string' && value.trim() ? null : "Specialization is required";
      case 'fromDate':
        return value ? null : "From date is required";
      case 'toDate':
        if (!value) return "To date is required";
        const fromDate = qualifications.find(q => q.id === id)?.fromDate;
        if (fromDate && new Date(value) < new Date(fromDate)) {
          return "To date must be after from date";
        }
        return null;
      case 'percentage':
        if (!value) return "Percentage is required";
        if (!/^\d{1,3}(\.\d{1,2})?%?$/.test(value)) {
          return "Enter valid percentage (e.g. 85 or 85.5%)";
        }
        return null;
      case 'boardOrUniversity':
        return typeof value === 'string' && value.trim() ? null : "Board/University is required";
      default:
        return null;
    }
  };


  const validateQualification = (qual) => {
    const errors = {};
    let isValid = true;

    ['course', 'specialization', 'fromDate', 'toDate', 'percentage', 'boardOrUniversity'].forEach(field => {
      const error = validateField(field, qual[field], qual.id);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    return { isValid, errors };
  };

  const addQualification = () => {
    const lastQual = qualifications[qualifications.length - 1];
    const { isValid, errors } = validateQualification(lastQual);

    if (!isValid) {
      const firstErrorField = Object.keys(errors)[0];
      ToastAndroid.show(errors[firstErrorField], ToastAndroid.SHORT);
      return;
    }

    const newId = qualifications.length > 0
      ? Math.max(...qualifications.map(q => q.id)) + 1
      : 1;

    setQualifications([...qualifications, {
      id: newId,
      course: "",
      specialization: "",
      fromDate: "",
      toDate: "",
      percentage: "%",
      boardOrUniversity: ""
    }]);
  };
  const { currentPage, setCurrentPage } = useContext(RadiantContext);

  const removeQualification = (id) => {
    if (qualifications.length <= 1) {
      ToastAndroid.show("At least one qualification is required", ToastAndroid.SHORT);
      return;
    }
    setQualifications(qualifications.filter(q => q.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    if (field === "percentage") {
      let numericValue = value.replace(/[^0-9.]/g, "");

      if (numericValue.includes(".")) {
        const [intPart, decimalPart] = numericValue.split(".");
        if (decimalPart.length > 2) {
          numericValue = `${intPart}.${decimalPart.substring(0, 2)}`;
        }
      }

      if (parseFloat(numericValue) > 100) {
        numericValue = "100";
      }

      const newValue = numericValue ? `${numericValue}%` : "%";

      setQualifications(qualifications.map(qual =>
        qual.id === id ? { ...qual, [field]: newValue } : qual
      ));
    } else if (field === "Course" || field === "Specialization" || field === "Board/University") {
      value = value.replace(/[^a-zA-Z]/g, "");

      setQualifications(qualifications.map(qual =>
        qual.id === id ? { ...qual, [field]: value } : qual
      ));
    } else {
      setQualifications(qualifications.map(qual =>
        qual.id === id ? { ...qual, [field]: value } : qual
      ));
    }
  };





  const handleSubmit = async () => {
    let allValid = true;

    qualifications.forEach(qual => {
      const { isValid, errors } = validateQualification(qual);
      if (!isValid) {
        allValid = false;
        const firstErrorField = Object.keys(errors)[0];
        ToastAndroid.show(`Qualification ${qual.id}: ${errors[firstErrorField]}`, ToastAndroid.SHORT);
      }
    });

    if (!allValid) return;

    // ToastAndroid.show("Qualifications submitted successfully", ToastAndroid.SHORT);
    console.log("Submitted qualifications:", qualifications);


    try {
      setIsloading2(true);

      const data = {

        EducationalDetails: qualifications.map((qual) => ({
          Course: qual.course,
          Specialization: qual.specialization,
          Fromdate: qual.fromDate,
          Todate: qual.toDate,
          GPA: qual.percentage,
          Bordoruniversity: qual.boardOrUniversity
        }))
      };
      const res = await post({

        url: APP_URLS.RadiantCandiantForm3, data
      })
      console.log('Response:', res, 'Data Sent:', data);

      if (res.status === 'Data Insert Successfully') {
        setCurrentPage(currentPage + 1);
        ToastAndroid.show(res.status || '', ToastAndroid.SHORT);
      } else if (
        res.status === 'NOT' ||
        res.Message === 'An error has occurred.' ||
        res.status === 'An error has occurred.'
      ) {
        alert('Submission failed. Please contact admin.');
      } else {
        throw new Error(res.status || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error in CandiantForm:", error);
      ToastAndroid.show(error.message || "Submission failed!", ToastAndroid.SHORT);
    } finally {
      setIsloading2(false);
    }

  };
  useEffect(() => {
    formData();
  }, [])
  const formData = async () => {
    try {
      const res = await post({ url: APP_URLS.RadiantForm3Data });

      console.log("API Response:", res);

      if (
        res &&
        res.data &&
        Array.isArray(res.data.Data)
      ) {
        const formattedData = res.data.Data.map((item, index) => ({
          id: index + 1,
          course: item.Course,
          specialization: item.Specialization,
          fromDate: item.PeriodFrom,
          toDate: item.PeriodTo,
          percentage: item.ClassOrPercentage,
          boardOrUniversity: item.UniversityCollegeInstitution,
        }));

        setQualifications(formattedData);
      } else {
        alert('Data retrieval failed. Please contact the Admin.');
      }
    } catch (error) {
      console.error("Error in formData:", error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setIsloading(false);
    }
  };



  return (
    <View style={styles.main}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {qualifications.map((qualification, index) => {
            // यहाँ आप validation errors का उपयोग UI में एरर दिखाने के लिए कर सकते हैं
            const { errors } = validateQualification(qualification);

            return (
              <View key={qualification.id} style={styles.qualificationBlock}>
                {/* Qualification Header */}
                <Text style={[styles.related, { color: colorConfig.secondaryColor, marginBottom: 10 }]}>
                  Qualification #{index + 1}
                </Text>

                <FlotingInput
                  label="Course*"
                  onChangeTextCallback={(text) =>
                    handleInputChange(qualification.id, "course", text)
                  }
                  value={qualification.course}
                />

                <FlotingInput
                  label="Specialization*"
                  onChangeTextCallback={(text) =>
                    handleInputChange(qualification.id, "specialization", text)
                  }
                  value={qualification.specialization}
                />

                {/* Date Selection: From Date */}
                <TouchableOpacity onPress={() => openCalendar(qualification.id, "fromDate")}>
                  <View pointerEvents="none">
                    <FlotingInput
                      label="From Date*"
                      value={qualification.fromDate}
                      editable={false}
                    />
                  </View>
                  <View style={styles.righticon2}>
                    <Calendarsvg />
                  </View>
                </TouchableOpacity>

                {/* Date Selection: To Date */}
                <TouchableOpacity onPress={() => openCalendar(qualification.id, "toDate")}>
                  <View pointerEvents="none">
                    <FlotingInput
                      label="To Date*"
                      value={qualification.toDate}
                      editable={false}
                    />
                  </View>
                  <View style={styles.righticon2}>
                    <Calendarsvg />
                  </View>
                </TouchableOpacity>

                <FlotingInput
                  label="Percentage*"
                  onChangeTextCallback={(text) => handleInputChange(qualification.id, "percentage", text)}
                  value={qualification.percentage}
                  keyboardType="decimal-pad"
                  maxLength={6}
                  // Selection logic को थोड़ा और स्टेबल बनाया गया है
                  selection={qualification.percentage ? {
                    start: qualification.percentage.length,
                    end: qualification.percentage.length
                  } : undefined}
                />

                <FlotingInput
                  label="Board/University*"
                  onChangeTextCallback={(text) =>
                    handleInputChange(qualification.id, "boardOrUniversity", text)
                  }
                  value={qualification.boardOrUniversity}
                />

                {/* Remove Button: सिर्फ पहले इंडेक्स को छोड़कर बाकी सब पर दिखेगा */}
                {index > 0 && (
                  <DynamicButton
                    title="Remove Qualification"
                    onPress={() => removeQualification(qualification.id)}
                    styleoveride={styles.removeButton}
                  />
                )}
                
                {/* Separator Line */}
                <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 15 }} />
              </View>
            );
          })}

          {/* Add More Section */}
          <DynamicButton
            title="+ Add Other Qualification"
            onPress={addQualification}
            styleoveride={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: colorConfig.secondaryColor }}
            textStyleOverride={{ color: colorConfig.secondaryColor }}
          />

          <View style={{ marginBottom: hScale(25) }} />

          {/* Final Submit */}
          <DynamicButton
            title={isLoading2 ? <ActivityIndicator size={'small'} color={colorConfig.labelColor} /> : "Submit"}
            onPress={handleSubmit}
          />
        </View>

        {/* BottomSheet for Calendar */}
        <BottomSheet 
          animationType="fade"  
          onBackdropPress={() => setIsCalendarVisible(false)}
          isVisible={iscalendarVisible}
        >
          <View style={styles.bottomSheetContainer}>
            <CustomCalendar onDateSelected={handleDateSelected} />
          </View>
        </BottomSheet>

      </KeyboardAwareScrollView>

      {/* Global Loaders */}
      {isLoading && <ShowLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginTop: hScale(10),
    marginBottom: hScale(10),
    paddingHorizontal: wScale(10),
    flex: 1
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    marginVertical: 10
  },
  related: {
    fontSize: wScale(20),
    fontWeight: 'bold',
    paddingBottom: hScale(15),
  },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: wScale(12),
    flexDirection: 'row',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    height: hScale(350),
    marginHorizontal: wScale(10),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default Qualification;
