import { translate } from "../../utils/languageUtils/I18n";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Natifications = () => {
  return (
    <View>
      <Text>{translate("Natifications")}</Text>
    </View>
  )
}

export default Natifications

const styles = StyleSheet.create({})
