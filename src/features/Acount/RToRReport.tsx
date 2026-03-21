import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import LinearGradient from 'react-native-linear-gradient';
import DateRangePicker from '../../components/DateRange';
import { FlashList } from '@shopify/flash-list';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import { RootState } from '../../reduxUtils/store';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import { translate } from '../../utils/languageUtils/I18n';

const RToRReport = () => {
    const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`;
    const [selectedRetailerId, setSelectedRetailerId] = useState('');

    const { userId } = useSelector((state: RootState) => state.userInfo);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const { post, get } = useAxiosHook();
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');


    const Rtor = async (from, to, status) => {
        setLoading(true);

        try {
            const formattedFrom = new Date(from).toISOString().split('T')[0];
            const formattedTo = new Date(to).toISOString().split('T')[0];
            const url = `${APP_URLS.RtorReport}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&RetailerId1=${userId}`;
            if (IsDealer) {
                const dealerUrl = `${APP_URLS.dealer_fund_trans_history}dlmid=${userId}&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&remid=${selectedRetailerId}`;
                console.log('Dealer URL:', dealerUrl);
                console.log('selectedRetailerId****:', selectedRetailerId);
                const response2 = await get({ url: dealerUrl });
                console.log('Dealer Response:', response2);
                if (!response2) {
                    throw new Error('Network response was not ok');
                }
                //setInforeport(response2);
                setTransactions(response2);

                return;
            }
            const response = await post({ url: url });

            console.log(response, url, 'response');
            setTransactions(response.Report);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Rtor(selectedDate.from, selectedDate.to, IsDealer ? selectedStatus : '');
    }, []);

    const renderItem = ({ item }) => (
        <View style={[styles.cardContainer, { backgroundColor: color1 }]}>
            <View style={styles.balanceRow}>

                <View >
                    <Text style={styles.cardTitle}>{translate("Name")}</Text>
                    <Text style={styles.cardValue}>{item.transfertoretailername}</Text>
                </View>
                <View style={styles.balanceColumnRight}>
                    <Text style={styles.cardTitle}>{translate("Date")}</Text>
                    <Text style={styles.cardValue}>{item.tran_date}</Text>
                </View>
            </View>

            <View style={styles.balanceRow}>
                <View style={styles.balanceColumnLeft}>
                    <Text style={styles.cardTitle}>{translate("Pre_Balance")}</Text>
                    <Text style={styles.cardValue}>₹ {item.rem_from_old_bal.toFixed(2)}</Text>
                </View>
                <View style={styles.balanceColumnCenter}>
                    <Text style={[styles.cardTitle,]}>{translate("Post_Balance")}</Text>
                    <Text style={styles.cardValue}>₹ {item.rem_from_new.toFixed(2)}</Text>
                </View>
                <View style={styles.balanceColumnRight}>
                    <Text style={styles.cardTitle}>{translate("Amount")}</Text>
                    <Text style={styles.cardValue}>₹ {item.value.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );

    const renderItem2 = ({ item }) => (
        console.log(item.ProfileImages),
        <View>
            <View style={[styles.itemContainer, { backgroundColor: color1 }]}>
                <View style={styles.row}>
                    <View style={styles.leftColumn}>
                        <TouchableOpacity >
                            <Image
                                resizeMode="cover"
                                source={
                                    item.ProfileImages
                                        ? { uri: `http://${APP_URLS.baseWebUrl}${item.ProfileImages}` }
                                        : require('../../features/drawer/assets/bussiness-man.png')
                                }
                                style={styles.image}
                            />
                        </TouchableOpacity>
                        <View >
                            <Text style={styles.label}>{'FirmName'}</Text>
                            <Text style={styles.value}>{item.FirmName === '' ? '....' : item.FirmName}</Text>
                        </View>
                    </View>

                    <View style={styles.rightColumn}>
                        <Text style={styles.label}>{'Type'}</Text>
                        <Text style={styles.value}>{item.Type}</Text>

                    </View>
                </View>
                <View style={[styles.border2, { backgroundColor: colorConfig.secondaryColor, marginTop: hScale(4) }]} />

                <View style={styles.row}>
                    <View style={styles.leftColumn}>

                        <View >
                            <Text style={styles.label}>{'Net T/F'}</Text>
                            <Text style={styles.value}>₹ {item.TotalBal}</Text>
                        </View>
                    </View>

                    <View style={styles.rightColumn}>
                        <Text style={styles.label}>{'Amount'}</Text>
                        <Text style={styles.value}>₹ {item.Balance}</Text>

                    </View>
                </View>
                <View style={[styles.border2, { backgroundColor: colorConfig.secondaryColor }]} />

                <View style={styles.row}>
                    <View style={styles.leftColumn}>
                        <View >
                            <Text style={styles.label}>{'Date'}</Text>
                            <Text style={styles.value}>{item.Date !== null ? `${item.Date}` : 'N/A'}</Text>

                        </View>
                    </View>

                    <View style={styles.rightColumn}>
                        <Text style={styles.label}>{'Charge'}</Text>
                        <Text style={styles.value}>₹ {item.Commission}</Text>

                    </View>
                </View>

                <View style={[styles.border2, { backgroundColor: colorConfig.secondaryColor, marginBottom: hScale(4) }]} />

                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Pre Bal'}</Text>
                        <Text style={styles.value}>₹ {item.RetailerOldBal}</Text>
                    </View>
                    <View style={[styles.border, { backgroundColor: colorConfig.secondaryColor }]} />

                    <View style={styles.column}>
                        <Text style={styles.label}>{'Post Bal'}</Text>
                        <Text style={styles.value}>₹ {item.RetailerCurrentBal}</Text>
                    </View>
                    <View style={[styles.border, { backgroundColor: colorConfig.secondaryColor }]} />
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Old Cr'}</Text>
                        <Text style={styles.value}>{item.RetailerOldCr !== null ? `₹ ${item.RetailerOldCr}` : 'N/A'}</Text>

                    </View>
                </View>
            </View>
        </View>
    );


    return (
        <View style={styles.main}>
            <AppBarSecond title={IsDealer ? 'Fund Transfer Report' : 'R To R History'} />

            <DateRangePicker
                onDateSelected={(from, to) => setSelectedDate({ from, to })}
                SearchPress={(from, to, status) => Rtor(from, to, status)}
                status={selectedStatus}
                setStatus={setSelectedStatus}
                isStShow={false}
                isshowRetailer={IsDealer}
                retailerID={(id) => {
                    Rtor(selectedDate.from, selectedDate.to, status = 'ALL')
                    console.log(id); // You can still log it for debugging
                    setSelectedRetailerId(id); // Store the selected retailer ID
                }}

            />



            <View style={styles.container}>

                {loading ? <ActivityIndicator size="large" color={colorConfig.secondaryColor} /> : !Array.isArray(transactions) || transactions.length === 0 ? <NoDatafound /> :
                    <FlashList
                        data={transactions}
                        renderItem={IsDealer ? renderItem2 : renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: hScale(15),
        paddingHorizontal: hScale(10)
    },

    cardContainer: {
        padding: wScale(10),
        marginBottom: hScale(12),
        borderRadius: 12,
    },

    cardTitle: {
        fontSize: wScale(14),
        color: '#333',
    },

    cardValue: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: '#0d47a1',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hScale(5),
    },
    balanceColumnLeft: {
        alignItems: 'flex-start',
        flex: 1,
    },
    balanceColumnCenter: {
        alignItems: 'center',
        flex: 1,
    },
    balanceColumnRight: {
        alignItems: 'flex-end',
        flex: 1,
    },

    /////////////////////////////

    itemContainer: {
        paddingHorizontal: wScale(5),
        borderRadius: 5,
        paddingVertical: hScale(5),
        marginBottom: hScale(10)

    },
    timenumber: {
        color: '#000',
        fontSize: wScale(16),
        fontWeight: 'bold'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    leftColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',

    },
    column: {
        alignItems: 'center',

    },
    border: {
        height: '100%',
        width: wScale(1),
    },
    border2: {
        height: 1,
        width: '100%',
        marginVertical: hScale(2)
    },
    label: {
        fontSize: wScale(11),
        color: '#666666',
    },
    value: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: '#333333',
    },
    image: {
        height: wScale(38),
        width: wScale(40),
        borderRadius: wScale(10),
        marginRight:wScale(4)
    },



});

export default RToRReport;
