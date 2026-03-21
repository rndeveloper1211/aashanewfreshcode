import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, Animated, StyleSheet } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import { translate } from "../../../utils/languageUtils/I18n";

const FlotingInput = ({
  inputstyle,
  labelinputstyle,
  label,
  onChangeTextCallback,
  autoFocus = false,
  ...props
}) => {
  const value = props.value;

  // चेक करें कि वैल्यू है या नहीं (0 को भी वैल्यू माना जाए)
  const hasValue = value !== undefined && value !== null && value.toString().length > 0;
  
  const [isFocused, setIsFocused] = useState(autoFocus || hasValue);

  // एनीमेशन वैल्यू: अगर वैल्यू है तो 1 (ऊपर), नहीं तो 0 (नीचे)
  const animatedFocused = useRef(new Animated.Value(hasValue || autoFocus ? 1 : 0)).current;

  useEffect(() => {
    // InteractionManager हटा दिया ताकि रिस्पॉन्स तुरंत मिले
    Animated.timing(animatedFocused, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false, // CRITICAL: top, fontSize के लिए false ही रखना पड़ेगा
    }).start();
  }, [isFocused, hasValue]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!hasValue) {
      setIsFocused(false);
    }
  };

  const labelStyle = {
    position: "absolute",
    left: wScale(12),
    zIndex: 1,
    top: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [hScale(8), hScale(0)],
    }),
    fontSize: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [wScale(20), wScale(14)],
    }),
    color: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#000", "#1f1d1d"],
    }),
    backgroundColor: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "white"], // rgba को सरल बनाया ताकि फ्लिकर न हो
    }),
    paddingHorizontal: wScale(2),
    // height एनीमेशन लेआउट बिगाड़ सकता है, इसे फिक्स्ड रखना बेहतर है अगर दिक्कत आए
    height: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [hScale(48), hScale(18)],
    }),
    justifyContent: "center",
    textAlignVertical: "center",
  };

  return (
    <View style={styles.main}>
      <Animated.Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[labelStyle, labelinputstyle]}
        pointerEvents="none" // ताकि लेबल पर क्लिक करने पर भी इनपुट फोकस हो
      >
        {translate(label)}
      </Animated.Text>

      <TextInput
        {...props}
        style={[styles.input, inputstyle]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeTextCallback}
        autoFocus={autoFocus}
        placeholder="" // Floating label के साथ placeholder खाली रखें
        cursorColor="#000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: hScale(8.9),
  },
  input: {
    borderWidth: wScale(0.5),
    borderColor: "#000",
    borderRadius: wScale(5),
    paddingLeft: wScale(15),
    height: hScale(48),
    width: "100%",
    color: "#000",
    fontSize: hScale(20),
    marginBottom: hScale(18),
  },
});

export default React.memo(FlotingInput);