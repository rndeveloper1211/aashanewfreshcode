import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { BottomSheet } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { colors } from "../utils/styles/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  data: any[];
  onSelect: (item: any) => void;
  labelKey?: string;
  idKey?: string;
  title?: string;
};

const BankListModal = ({
  visible,
  onClose,
  data,
  onSelect,
  labelKey = "bankName",
  idKey = "idno",
  title = "Select",
}: Props) => {
  const { colorConfig } = useSelector(
    (state: RootState) => state.userInfo
  );
  
  const [searchQuery, setSearchQuery] = useState('');


  const filteredData = useMemo(() => { if (!searchQuery) return data; return data.filter((item) => item?.[labelKey]?.toLowerCase().includes(searchQuery.toLowerCase()) ); }, [searchQuery, data, labelKey]);
  return (
    <BottomSheet animationType="none"  
        animationType="none"   isVisible={visible}>
      <View style={styles.container}>
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { backgroundColor: `${colorConfig.secondaryColor}20` },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <ClosseModalSvg2 size={35} />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchBar}
          placeholderTextColor={colors.black75}
          cursorColor={'colors.black'}
        />
        <FlashList
          data={filteredData}
          estimatedItemSize={50}
          keyExtractor={(item, index) =>
            item?.[idKey]?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => { onSelect(item) }

              }
            >
              <Text style={styles.itemText}>
                {item?.[labelKey] ?? "N/A"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </BottomSheet>
  );
};

export default BankListModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.3,
    borderTopLeftRadius: hScale(15),
    borderTopRightRadius: hScale(15),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: wScale(5),
    paddingHorizontal: wScale(10),
    borderTopLeftRadius: hScale(15),
    borderTopRightRadius: hScale(15),
  },
  title: {
    fontSize: wScale(20),
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  item: {
    paddingVertical: hScale(18),
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    marginHorizontal: wScale(10),
  },
  itemText: {
    fontSize: wScale(18),
    color: "#000",
  },
    searchBar: {
    borderColor: 'gray',
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    marginHorizontal: wScale(10),
    marginBottom: hScale(8),
    borderRadius: 5,
    color: colors.black75,
    fontSize: wScale(16),
    marginTop:hScale(5)
  },
});
