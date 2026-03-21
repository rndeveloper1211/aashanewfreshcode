import { translate } from "../../utils/languageUtils/I18n";
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { colors } from '../../utils/styles/theme';
import DateRangePicker from '../../components/DateRange';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';

const DisputeReport = () => {
    const { colorConfig ,IsDealer } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`
    const [inforeport, setInforeport] = useState([]);
    const [loading, setLoading] = useState(true);
    const { get, post } = useAxiosHook();
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');


    const demoData = [
        {
            Rechargeno: '123',
            Responsetime: '12:30 PM',
            Amount: 1000,
            opt: 'Operator A',
            Status: 'Success',
            Response: 'OK'
        },
        {
            Rechargeno: '456',
            Responsetime: '01:00 PM',
            Amount: 2000,
            opt: 'Operator B',
            Status: 'Failed',
            Response: 'Error'
        },
    ];

    const FundRecReport = async (from, to, status) => {
        setLoading(true);
        const formattedFrom = new Date(from).toISOString().split('T')[0];
        const formattedTo = new Date(to).toISOString().split('T')[0];
        const url = `${APP_URLS.retailerBalRecRep}fromdate=${formattedFrom}&todate=${formattedTo}`;
        try {
            const response = await get({ url: `${APP_URLS.disputeReport}fromdate=${formattedFrom}&todate=${formattedTo}` });
            console.log(response);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setInforeport(response);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to load data, showing demo data');
            setInforeport(demoData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FundRecReport(selectedDate.from, selectedDate.to, selectedStatus);
    }, []);
    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: color1 }]}>
            <View style={styles.row}>
                <View >
                    <Text style={styles.label}>{translate("Recharge_No")}</Text>
                    <Text style={styles.value}>{item.Rechargeno || '...'}</Text>
                </View>
                <View style={styles.rightcontainer}>
                    <Text style={styles.label}>{translate("Response_Time")}</Text>
                    <Text style={styles.value}>{item.Responsetime || '...'}</Text>
                </View>
            </View>
            <View style={[styles.divider, {
                backgroundColor: colorConfig.secondaryColor,
            }]} />
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>{translate("Amount")}</Text>
                    <Text style={styles.value}>{`\u20B9 ${item.Amount}`}</Text>
                </View>
                <View style={[styles.divider, {
                    backgroundColor: colorConfig.secondaryColor,
                }]} />
                <View>
                    <Text style={styles.label}>{translate("Operator")}</Text>
                    <Text style={styles.value}>{item.opt || '...'}</Text>
                </View>
                <View style={[styles.divider, {
                    backgroundColor: colorConfig.secondaryColor,
                }]} />
                <View style={styles.rightcontainer}>
                    <Text style={styles.label}>{translate("Status")}</Text>
                    <Text style={styles.value}>{item.Status || '...'}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.responseLabel}>{translate("Response")}</Text>
                <Text style={styles.responseValue}>{item.Response}</Text>
            </View>
        </View>
    );

    return (
        <View >
            <AppBarSecond
                title="Dispute Report"
                onActionPress={undefined}
                actionButton={undefined}
                onPressBack={undefined}
            />
            <DateRangePicker
                onDateSelected={(from, to) => setSelectedDate({ from, to })}
                SearchPress={(from, to, status) => FundRecReport(from, to, status)}
                status={selectedStatus}
                setStatus={setSelectedStatus}
                isStShow={true}
                isshowRetailer={IsDealer}
            />
            <View style={styles.container}>
                {loading ? <ActivityIndicator size="large" color={colorConfig.secondaryColor} />
                    : inforeport.length > 0 ? <FlatList
                        data={inforeport}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    /> :
                        <NoDatafound />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    container: {
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(15)
    },
    card: {
        marginBottom: hScale(10),
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        paddingVertical: hScale(5)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    rightcontainer: {
        alignItems: 'flex-end'
    },
    label: {
        fontSize: wScale(12),
        color: colors.black
    },
    value: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: colors.black
    },
    divider: {
        marginVertical: 5,
        padding: wScale(.3)
    },
    responseLabel: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: colors.black,
    },
    responseValue: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        flex: 1,
        color: colors.black,
        marginLeft: wScale(6)
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DisputeReport;
