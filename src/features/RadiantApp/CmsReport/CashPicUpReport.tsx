import { translate } from "../../../utils/languageUtils/I18n";
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import DateRangePicker from '../../../components/DateRange';
import { FlashList } from '@shopify/flash-list';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import NoDatafound from '../../drawer/svgimgcomponents/Nodatafound';
import ShowLoader from '../../../components/ShowLoder';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { useFocusEffect } from '@react-navigation/native';
import BorderLine from '../../../components/BorderLine';
import CheckSvg from '../../drawer/svgimgcomponents/CheckSvg';
import WalletCard from '../RadiantTrxn/WalletCard';
const CashPicUpReport = () => {
    const { colorConfig, } = useSelector((state: RootState) => state.userInfo);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const headers = ['500', '200', '100', '50', '20', '10', '5', 'Coins'];
    const [selectedStatus, setSelectedStatus] = useState('');

    const { post } = useAxiosHook();

    useFocusEffect(
        useCallback(() => {
            const today = new Date().toISOString().split('T')[0];
            const resetDate = { from: today, to: today };
            setSelectedDate(resetDate);
            fetchReport(resetDate.from, resetDate.to, selectedStatus);
        }, [])
    );

    const fetchReport = async (from, to, selectedStatus) => {
        setLoading(true);
        try {
            const formattedFrom = new Date(from).toISOString().split('T')[0];
            const formattedTo = new Date(to).toISOString().split('T')[0];

            const url = `${APP_URLS.CashpickupReport}from=${formattedFrom}&to=${formattedTo}&status=${selectedStatus}`;
            console.log("API URL:", url);

            const res = await post({
                url: url,
            });
            console.log(url, '///uuu');

            console.log("API Response:", res,);
            setReportData(res?.Content || []);
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelection = (from, to, selectedStatus) => {
        setSelectedDate({ from, to });
        fetchReport(from, to, selectedStatus);
    };
    const renderItem = ({ item, index }) => (
        <View style={[styles.card, {
            backgroundColor: item.Reqsts === 'Approved' ? '#e8f5e1' : item.Reqsts === 'Inprocess' ? `${colorConfig.secondaryColor}1A` : '#fcf2ed', borderColor: colorConfig.secondaryColor

        }]}>
            <View >
                <View style={[styles.row, {
                    backgroundColor: item.Reqsts === 'Approved' ? '#4b853e' : item.Reqsts === 'Inprocess' ? colorConfig.secondaryColor : '#fa783c', borderTopRightRadius: 10, borderTopLeftRadius: 10,
                    paddingVertical: hScale(5)
                }]}>

                    <View style={styles.item}>
                        <Text style={[styles.timeLabel,]}>{translate("Transaction_ID")}</Text>
                        <Text style={[styles.timeVabel, { letterSpacing: 1 }]}>{item.transId}</Text>
                    </View>
                    <View style={styles.item2}>
                        <Text style={[styles.timeLabel,]}>{translate("Pickup_Slip_Uploaded_Time")}</Text>
                        <Text style={[styles.timeVabel,]}>
                            {item.Insertdate}</Text>
                    </View>
                </View>

                <View style={[styles.rMargin, {
                    borderColor: item.Reqsts === 'Approved' ? '#4b853e' : item.Reqsts === 'Inprocess' ? colorConfig.secondaryColor : '#fa783c',

                }]}>
                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Text style={styles.label}>{translate("HCL_Slip_Number")}</Text>
                            <Text style={styles.label}>{translate("Reqsts_Status")}</Text>

                        </View>
                        <View style={styles.item2}>
                            <Text style={styles.value}>{item.hcl_no ?? 0.0}</Text>
                            <Text style={styles.value}>{item.Reqsts}</Text>
                        </View>
                    </View>

                    <View style={[styles.row, {
                        backgroundColor: '#f1f1f1',
                        borderRadius: 5, elevation: 2,
                        marginTop: hScale(2)
                    }]}>

                        <View style={styles.item}>
                            <Text style={styles.label}>{translate("PickUp_Amount")}</Text>
                            <Text style={styles.value}>{item.pickup_amount}</Text>
                        </View>
                        <BorderLine height='100%' width={.3} />

                        <View style={styles.item3}>
                            <Text style={styles.label}>{translate("Paid_Amount")}</Text>
                            <Text style={styles.value}>{item.Amountpaid === null ? 0 : item.Amountpaid}</Text>
                        </View>
                        <BorderLine height='100%' width={.3} />

                        <View style={styles.item2}>
                            <Text style={styles.label}>{translate("Remain_Amount")}</Text>
                            <Text style={styles.value}>{item.pickup_amount - item.Amountpaid}</Text>
                        </View>
                        {item.Cashsubmittype === 'FullPayment' ? <View style={[styles.check, { backgroundColor: 'green' }]}>
                            <CheckSvg size={15} />
                        </View> : null}

                    </View>
                    <View style={styles.row}>

                        <View style={styles.item}>
                            <Text style={[styles.value, { textAlign: 'center', fontWeight: 'normal', fontSize: wScale(14) }]}>{item.Cust_name}</Text>
                            <Text style={[styles.value, { textAlign: 'center', fontWeight: 'normal', fontSize: wScale(11) }]}>{item.Point_name}</Text>
                        </View>

                    </View>
                    <BorderLine height={.5} />

                    <Text style={styles.currencylabel}>{translate("indian_currency_denominations")}</Text>
                    <View style={[styles.table, { borderColor: colorConfig.secondaryColor }]}>

                        <View style={styles.row2}>
                            {headers.map((item, index) => (
                                <Text key={index} style={[styles.cell, {
                                    borderColor: colorConfig.secondaryColor,
                                    borderTopWidth: 0,
                                    borderLeftWidth: index === 0 ? 0 : .5,
                                },
                                styles.header,
                                ]}
                                >
                                    {item === 'Coins' ? item : `₹ ${item}`}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.row2}>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor, borderLeftWidth: 0 }]}>{item.s500}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.s200}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.s100}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.s50}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.s20}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.s10}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.s5}</Text>
                            <Text style={[styles.cell, { borderColor: colorConfig.secondaryColor }]}>{item.coins}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View >
    );

    return (
        <View style={styles.main}>
            <AppBarSecond title={'Cash PickUp Report'} />
            <DateRangePicker

                SearchPress={() => fetchReport(selectedDate.from, selectedDate.to, selectedStatus)}
                onDateSelected={(from, to) => handleDateSelection(from, to, selectedStatus)}
                isshowRetailer={false}
                status={selectedStatus}
                setStatus={setSelectedStatus}
                isStShow={true}
                cmsStatu={true}

            />
            <View style={styles.container}>
                {/* <WalletCard/> */}
                {loading ? (
                    <ShowLoader />
                ) : reportData.length > 0 ? (
                    <FlashList
                        data={reportData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) =>
                            item?.transRecId ? `${item.transRecId}-${index}` : `${index}`
                        }
                        estimatedItemSize={100}

                    />
                ) : (
                    <NoDatafound />
                )}
            </View>
        </View>
    );
};

export default CashPicUpReport;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        paddingVertical: hScale(15)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingVertical: hScale(2),
        alignItems: 'center',
        paddingHorizontal: wScale(4)
    },
    rMargin: {
        paddingHorizontal: wScale(8),
        borderWidth: wScale(1),
        borderBottomRightRadius: wScale(10),
        borderBottomLeftRadius: wScale(10),
        paddingBottom: hScale(10)
    },
    card: {
        marginBottom: hScale(15),
        borderRadius: wScale(10),

        backgroundColor: '#f9f9f9',
        marginHorizontal: wScale(10),
    },
    item: {
        flex: 1,
    },
    item2: {
        flex: 1,
        alignItems: 'flex-end'
    },
    item3: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        fontSize: wScale(14),
        color: '#000',

    },
    timeLabel: {
        fontSize: wScale(10),
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1

    },
    labelength: {
        fontSize: wScale(16),
        marginLeft: wScale(5),
        flex: 1,
        textAlign: 'left',
        color: '#fff',
    },
    value: {
        fontWeight: 'bold',
        fontSize: wScale(15),
        color: '#000',
        textTransform: 'capitalize'
    },
    timeVabel: {
        fontWeight: 'bold',
        fontSize: wScale(14),
        color: '#fff',
        textTransform: 'uppercase'
    },

    smspanding: {
        fontSize: wScale(12),
        marginBottom: hScale(4),
        backgroundColor: '#7cf7c8',
        paddingHorizontal: wScale(2),
        textAlign: 'center'
    },
    topbar: { marginHorizontal: hScale(10) },

    table: {
        borderWidth: .2,
        borderColor: '#ccc',
        overflow: 'hidden',
        marginBottom: hScale(10)
    },
    row2: {
        flexDirection: 'row',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        borderLeftWidth: 0.5,
        borderTopWidth: 0.5,
        color: '#000'
    },
    currencylabel: {
        flex: 1,
        textAlign: 'center',
        color: '#000',
        fontSize: wScale(18),
        letterSpacing: 2,
        textTransform: 'capitalize'
    },
    header: {
        fontWeight: 'bold',
        backgroundColor: '#eef6ff',
        color: '#000',
    },
    check: {
        height: wScale(25),
        width: wScale(25),
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: wScale(10)
    },
});
