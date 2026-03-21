import { translate } from "../../utils/languageUtils/I18n";
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, useColorScheme, TouchableOpacity } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { colors } from '../../utils/styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import DateRangePicker from '../../components/DateRange';

const AddedMoneyROTRReport = () => {
    const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`
    const [inforeport, setInforeport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const { get, post } = useAxiosHook();
    const colorScheme = useColorScheme();

    const AddMReport = async (from, to, status) => {
        try {
            const formattedFrom = new Date(from).toISOString().split('T')[0];
            const formattedTo = new Date(to).toISOString().split('T')[0];
            const response = await post({ url: `${APP_URLS.Addmoneyrep}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}` });
            console.log(response[4]);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setInforeport(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AddMReport(selectedDate.from, selectedDate.to, selectedStatus);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={[styles.outerContainer, { backgroundColor: color1 }]}>
                <View style={styles.innerContainer}>
                    <View style={styles.row}>
                        <View style={styles.leftColumn}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.labelText]}>{translate("Transition_Time")}</Text>
                                <Text style={[styles.valueText]}>{item.txndate || ""}</Text>
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={[styles.boldText]}>{item.Apinm}</Text>
                            </View>
                        </View>
                        <View style={styles.rightColumn}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.boldText]}>{item.PayerName}</Text>
                            </View>
                            <View style={styles.amountContainer}>
                                <Text style={[styles.amountText]}>Amount: ₹ {item.amt || ""}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.expandedColumn]}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.labelText]}>{translate("Pre_Bal")}</Text>
                            <Text style={[styles.amountText]}>{item.remainpre || ""}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.labelText]}>{translate("Wl")}</Text>
                            <Text style={[styles.amountText]}>{item.remainpre || ""}</Text>
                        </View>
                    </View>
                    <View style={[styles.bordercontainer]} />

                    <View style={[styles.expandedColumn]}>
                        <Text style={[styles.labelText]}>{translate("Charges")}</Text>
                        <Text style={[styles.valueText]}>₹ {item.charge || ""}</Text>
                    </View>
                    <View style={[styles.bordercontainer]} />

                    <View style={styles.expandedColumn}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.labelText]}>{translate("Post_Bal")}</Text>
                            <Text style={[styles.valueText]}>{item.remainpost || ""}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.labelText]}>{translate("Wl")}</Text>
                            <Text style={[styles.valueText]}>{item.remainpost || ""}</Text>
                        </View>
                    </View>
                    <View style={[styles.bordercontainer]} />

                    <View style={[styles.expandedColumn, styles.rightColumn]}>
                        <Text style={[styles.labelText]}>{translate("Status")}</Text>
                        <Text style={[styles.valueText]}>{item.status || ""}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <AppBarSecond title="Add Money" />
            <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}>
                <DateRangePicker
                    onDateSelected={(from, to) => setSelectedDate({ from, to })}
                    SearchPress={(from, to, status) => AddMReport(from, to, status)}
                    status={selectedStatus}
                    setStatus={setSelectedStatus}
                    isStShow={true}
                    isshowRetailer={IsDealer}
                />
            </LinearGradient>

            <FlatList
                data={inforeport}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshing={loading}
                onRefresh={() => AddMReport(selectedDate.from, selectedDate.to, selectedStatus)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wScale(10),
        flex: 1,
        paddingTop: hScale(10)
    },
    outerContainer: {
        marginBottom: hScale(15),
        borderRadius: 4,
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(4)
    },
    innerContainer: {
        paddingBottom: hScale(6)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftColumn: {
        flex: 1,
    },
    rightColumn: {
        alignItems: 'flex-end',
    },
    expandedColumn: {
        justifyContent: 'center',
    },
    bordercontainer: {
        borderRightWidth: wScale(2),
        borderRightColor: colors.white80
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hScale(3),
    },
    labelText: {
        fontSize: wScale(12),
        color: colors.black
    },
    valueText: {
        fontSize: wScale(12),
        fontWeight: 'bold',
        color: colors.black
    },
    boldText: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: colors.black
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountText: {
        fontSize: wScale(12),
        fontWeight: 'bold',
        color: colors.black
    },
    border: {
        borderLeftWidth: 1,
        borderColor: '#e0e0e0',
        paddingLeft: wScale(10),
    },
});

export default AddedMoneyROTRReport;
