import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, Animated, StyleSheet, TouchableWithoutFeedback } from "react-native";
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
  const inputRef = useRef(null); // ✅ TextInput ka ref

  const hasValue = value !== undefined && value !== null && value.toString().length > 0;
  const [isFocused, setIsFocused] = useState(autoFocus || hasValue);

  const animatedFocused = useRef(new Animated.Value(hasValue || autoFocus ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedFocused, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    if (!hasValue) setIsFocused(false);
  };

  // ✅ Poore container pe tap karne par input focus ho
  const handleContainerPress = () => {
    inputRef.current?.focus();
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
      outputRange: ["transparent", "white"],
    }),
    paddingHorizontal: wScale(2),
    height: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [hScale(48), hScale(18)],
    }),
    justifyContent: "center",
    textAlignVertical: "center",
  };

  return (
    // ✅ TouchableWithoutFeedback poore area ko tappable banata hai
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={styles.main}>
        <Animated.Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[labelStyle, labelinputstyle]}
          // ✅ pointerEvents hata diya — ab TouchableWithoutFeedback handle karega
        >
          {translate(label)}
        </Animated.Text>

        <TextInput
          {...props}
          ref={inputRef} // ✅ ref attach kiya
          style={[styles.input, inputstyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeTextCallback}
          autoFocus={autoFocus}
          placeholder=""
          cursorColor="#000"
        />
      </View>
    </TouchableWithoutFeedback>
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