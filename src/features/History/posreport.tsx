import { translate } from "../../utils/languageUtils/I18n";
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { useSelector } from 'react-redux';
import { hScale, wScale } from '../../utils/styles/dimensions';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, FontSize } from '../../utils/styles/theme';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import DateRangePicker from '../../components/DateRange';
import DynamicButton from '../drawer/button/DynamicButton';
import { RootState } from '../../reduxUtils/store';

const posreport = () => {
    const { colorConfig ,IsDealer} = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`;
    const [transactions, setTransactions] = useState([]);
    const [present, setPresent] = useState(10);
    const [loading, setLoading] = useState(false);
    const { post } = useAxiosHook();
    const { userId } = useSelector((state) => state.userInfo);

    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    useEffect(() => {
        recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
    }, []);

    const recentTransactions = async (from, to, status) => {
        try {
            setLoading(true);
            const formattedFrom = new Date(from).toISOString().split('T')[0];
            const formattedTo = new Date(to).toISOString().split('T')[0];
            const url = `${APP_URLS.posreport}fromdate=${formattedFrom}&todate=${formattedTo}`;
            console.log(url);

            const response = await post({ url });
            console.log('posreport', response);
            const transactionsData = response['Report'] || [];
            setTransactions(transactionsData);


        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setPresent((prev) => prev + 10);
    };


    const TransactionDetails = ({ item }) => {
        return (
            <View style={[styles.card, {
                backgroundColor: color1,
                borderColor: colorConfig.secondaryColor
            }]}>

                <View >
                    <View style={styles.rowview}>
                        <View >
                            <Text style={styles.timetex}>{translate("Transaction_Details")}</Text>
                            <Text style={styles.amounttex}>{item.Details === '' ? "....." : item.Details}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.border,]} />
                    <View style={[styles.rowview]}>
                        <View >
                            <Text style={styles.timetex}>{translate("Request_Time")}</Text>
                            <Text style={[styles.amounttex,]}>
                                {item.ledgerdate ? item.ledgerdate : 'Type...'}
                            </Text>
                        </View>

                        <View >
                            <Text style={[styles.timetex, styles.textrit]}>{translate("Type")}</Text>
                            <Text style={[styles.amounttex, styles.textrit]}>
                                {item.tras_type ? item.tras_type : '...'}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.border,]} />
                    <View style={[styles.rowview,]}>
                        <View style={styles.blance}>
                            <Text style={[styles.timetex,]}>{translate("Amount")}</Text>
                            <Text style={[styles.amounttex,]}>₹ {`${item.Amount}`}</Text>
                        </View>
                        <View style={[styles.blance,]}>
                            <Text style={[styles.timetex, { textAlign: 'center' }]}>{translate("pre_Balance")}</Text>
                            <Text style={[styles.amounttex, { textAlign: 'center' }]}>₹ {`${item.remainpre}`}</Text>
                        </View>

                        <View style={[styles.blance, { borderRightWidth: 0 }]}>
                            <Text style={[styles.timetex, styles.textrit,]}>{translate("Pos_Balance")}</Text>
                            <Text style={[styles.amounttex, styles.textrit,]}>₹ {`${item.remainpost}`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.main}>
            <AppBarSecond title="POS Report" />
            <DateRangePicker
                onDateSelected={(from, to) => setSelectedDate({ from, to })}
                SearchPress={(from, to, status) => recentTransactions(from, to, status)}
                status={selectedStatus}
                setStatus={setSelectedStatus}
                isStShow={true}
                isshowRetailer={IsDealer}

            />
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                    transactions.length === 0 ? (
                        <NoDatafound />) : (
                        <FlatList
                            data={transactions.slice(0, present)}
                            renderItem={({ item }) => <TransactionDetails item={item} />}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={
                                transactions.length > present ? (
                                    <DynamicButton onPress={handleLoadMore} title={'Load More'} />

                                ) : null
                            }
                        />
                    )
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1 },
    container: { flex: 1, paddingHorizontal: wScale(10), paddingVertical: hScale(20), },
    card: {
        marginBottom: hScale(10),
        borderWidth: wScale(.7),
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(8)
    },
    rowview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    border: {
        borderBottomWidth: wScale(.7),
        borderColor: '#000',
        marginVertical: hScale(4),
    },
    amounttex: {
        fontSize: wScale(12),
        color: '#000',
        fontWeight: 'bold'
    },

    timetex: {
        fontSize: FontSize.regular,
        color: '#000',
    },

    textrit: {
        textAlign: 'right',
    },

    blance: {
        flex: 1,
        borderRightWidth: wScale(.7),
        borderColor: colors.black75,
    }
});

export default posreport;
