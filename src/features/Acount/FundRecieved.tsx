import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { hScale, wScale } from '../../utils/styles/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Calendarsvg from '../drawer/svgimgcomponents/Calendarsvg';
import SearchIcon from '../drawer/svgimgcomponents/Searchicon';
import DateRangePicker from '../../components/DateRange';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import { translate } from '../../utils/languageUtils/I18n';
import { Tab, TabView, } from "@rneui/themed";
import TabBar from "../Recharge/TabView/TabBarView";
import ShowLoader from '../../components/ShowLoder';

const FundReceivedReport = () => {
    const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const [inforeport, setInforeport] = useState([]);
    const [inforeportAdmin, setInforeportAdmin] = useState([]);
    const [inforeportDealer, setInforeportDealer] = useState([]);
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchnumber, setSearchnumber] = useState('');
    const [isAdmin, setIsAdmin] = useState(true);
    const [loading, setLoading] = useState(true);
    const { get, post } = useAxiosHook();
    const [selectedOption, setSelectedOption] = useState("IsDealer");

    useEffect(() => {

        if (!IsDealer) {
            FundRecReport(selectedDate.from, selectedDate.to, selectedStatus, '');

        } else {
            FundRecReport(selectedDate.from, selectedDate.to, selectedStatus, selectedOption);

        }
    }, []);


    const FundRecReport = async (from, to, status, fromm) => {
        setLoading(true)
        const formattedFrom = new Date(from).toISOString().split('T')[0];
        const formattedTo = new Date(to).toISOString().split('T')[0];

        const url = `${APP_URLS.retailerBalRecRep}from=${formattedFrom}&to=${formattedTo}&remid=ALL`;
        const url2 = `${APP_URLS.ReceiveFund_by_master}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`;
        const url3 = `${APP_URLS.ReceiveFund_by_admin}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`;

        let selectedUrl;

        switch (fromm) {
            case 'IsDealer':
                selectedUrl = url2;
                break;
            case 'isAdmin':
                selectedUrl = url3;
                break;
            default:
                selectedUrl = url;
                break;
        }

        try {
            const response = await get({ url: selectedUrl });
            console.log(selectedUrl);
            console.log(response)
            if (!response) {
                throw new Error('Network response was not ok');
            }

            if (fromm === 'isAdmin') {
                if (response.Report === 'No Data Found') {
                    ToastAndroid.show(response.Report, ToastAndroid.SHORT);
                } else {
                    setInforeportAdmin(response.Report);
                }

            } else if (fromm === 'IsDealer') {
                //setInforeport(response);
                if (response.Report === 'No Data Found') {
                    ToastAndroid.show(response.Report, ToastAndroid.SHORT);
                } else {
                    setInforeportDealer(response.Report);
                }
            } else {
                if (response.Report === 'No Data Found') {
                    ToastAndroid.show(response.Report , ToastAndroid.SHORT);
                } else {
                    setInforeport(response);
                }
            }

            setLoading(false)

        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to load data, showing demo data');
        } finally {
            setLoading(false);
        }
    };

    const renderItemMaster = ({ item }) => {
        return (
            <View>
                <View style={[styles.itemContainer, { backgroundColor: color1 }]}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>{translate('Name')}</Text>
                            <Text style={styles.value}>{item.SuperstokistName || '.....'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>{translate('Date')}</Text>
                            <Text style={styles.value}>{item.date_dlm || '0 0 0'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>{translate('Pre Balance')}</Text>
                            <Text style={styles.value}>{`\u20B9 ${item.dealer_prebal || ''}`}</Text>
                        </View>
                        <View style={[styles.column,]}>
                            <View >
                                <Text style={styles.label}>{translate('Post Balance')}</Text>
                                <Text style={styles.value}>{`\u20B9 ${item.dealer_postbal || ''}`}</Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>{translate('Amount')}</Text>
                            <Text style={styles.value}>{`\u20B9 ${item.balance || ''}`}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>{'Transfer'}</Text>
                            <Text style={styles.value}>{`\u20B9 ${item.Newbalance || ''}`}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>{'Type'}</Text>
                            <Text style={styles.value}>{item.bal_type || ''}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    const renderItemAdmin = ({ item }) => (

        <View style={[styles.innerview]}>

            <View style={[styles.itemContainer, { backgroundColor: color1 }]}>

                <View style={[styles.row, { paddingBottom: hScale(5) }]}>

                    <View style={styles.column}>

                        <Text style={styles.label}>{translate('Name')}</Text>

                        <Text style={styles.value}>{item.Name || "....."}</Text>

                    </View>

                    <View style={styles.column}>

                        <Text style={styles.label}>{translate('Date')}</Text>

                        <Text style={styles.value}>{item.date_dlm || "0 0 0"}</Text>

                    </View>

                </View>


                <View style={styles.row}>

                    <View style={styles.balanceColumn}>

                        <Text style={styles.label}>{translate('Pre Balance')}</Text>

                        <Text style={styles.value}>{"\u{20B9} " + (item.dealer_prebal || "")}</Text>

                    </View>

                    <View style={styles.balanceColumn}>

                        <Text style={styles.label}>{translate('Post Balance')}</Text>

                        <Text style={styles.value}>{"\u{20B9} " + (item.dealer_postbal || "")}</Text>

                    </View>

                    <View style={styles.balanceColumn}>

                        <Text style={styles.label}>{translate('Amount')}</Text>

                        <Text style={styles.value}>{"\u{20B9} " + (item.balance || "")}</Text>

                    </View>

                    <View style={styles.balanceColumn}>

                        <Text style={styles.label}>{translate('Type')}</Text>

                        <Text style={styles.value}>{item.bal_type || ""}</Text>

                    </View>

                </View>

            </View>

        </View>

    );
    const renderItem = ({ item }) => (
        <View >
            <View style={[styles.itemContainer, { backgroundColor: color1 }]}>
                <View style={styles.row}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.label}>{'Name'}</Text>
                        <Text style={styles.value}>{item.SenderId === '' ? '....' : item.SenderId}</Text>
                    </View>
                    <View style={styles.rightColumn}>
                        <Text style={styles.label}>{'Date'}</Text>
                        <Text style={styles.value}>{item.Date}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Pre Balance'}</Text>
                        <Text style={styles.value}>₹ {item.OldBal}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Post Balance'}</Text>
                        <Text style={styles.value}>₹ {item.CurrentBal}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Amount'}</Text>
                        <Text style={styles.value}>₹ {item.Amount}</Text>
                    </View>
                </View>
            </View>
        </View>
    );




    return (

        <View style={styles.main}>

            <AppBarSecond
                title="Fund Recieved Report"
                onActionPress={undefined}
                actionButton={undefined}
                onPressBack={undefined}
            />
            <DateRangePicker
                onDateSelected={(from, to) => setSelectedDate({ from, to })}
                SearchPress={(from, to, status) => FundRecReport(from, to, status, IsDealer ? selectedOption : '')}
                status={selectedStatus}
                setStatus={setSelectedStatus}
                isStShow={false}
                isshowRetailer={false}
                retailerID={(id) => { console.log(id) }}

            />
            <View style={styles.container}>
                {IsDealer === false && <>{inforeport ? <FlatList
                    data={inforeport}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                /> : <NoDatafound />}</>}
                {IsDealer && <View style={styles.tabview}>
                    <TabBar
                        tabButtonstyle={styles.tabButtonstyle}
                        Unselected="from Admin"
                        Selected="from Master"
                        onPress2={() => {
                            FundRecReport(selectedDate.from, selectedDate.to, selectedStatus, 'isAdmin');
                            setSelectedOption('isAdmin')
                            // setViewPlans(false);
                            // getopertaorlist('Postpaid');
                            // setispost(true);
                        }}
                        onPress1={() => {
                            FundRecReport(selectedDate.from, selectedDate.to, selectedStatus, 'IsDealer');
                            setSelectedOption('IsDealer')

                            // setViewPlans(true);
                            // getopertaorlist('Prepaid');
                            // setispost(false);
                        }}
                    />
                </View>}

                {
                    selectedOption === 'IsDealer' ? (
                        inforeportDealer ? (
                            <FlatList
                                data={inforeportDealer}
                                renderItem={renderItemMaster}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        ) : (
                            <NoDatafound />
                        )
                    ) : (
                        inforeportAdmin ? (
                            <FlatList
                                data={inforeportAdmin}
                                renderItem={renderItemAdmin}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        ) : (
                            <NoDatafound />
                        )
                    )
                }






             
            </View>

               {loading && <ShowLoader />}
        </View>


    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(5),
        marginVertical: hScale(5),
    },
    itemContainer: {
        marginBottom: hScale(5),
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        paddingVertical: hScale(5)
    },

    innerview: {
        backgroundColor: '#fff',

    },


    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: wScale(10),
        borderRadius: 5,
    },
    datePickerButton: {
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: wScale(1),
        borderColor: '#000'

    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wScale(15),
        backgroundColor: '#007bff',
        borderRadius: 5,
        borderWidth: wScale(1),
        borderColor: '#000'
    },
    buttonText: {
        color: '#fff',
        fontSize: wScale(14),
    },
    dateText: {
        color: '#fff',
        fontSize: wScale(14),
    },
    timetext: {
        color: '#000',
        fontSize: wScale(14),
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
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',

    },
    column: {
        alignItems: 'center',
        borderWidth: wScale(.5),
        paddingHorizontal: wScale(5),
        paddingVertical: hScale(2),
        marginTop: hScale(5),
        borderRadius: 5

    },
    label: {
        fontSize: wScale(12),
        color: '#666666',
    },
    value: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: '#333333',
    },
    tabview: {
        paddingTop: hScale(5),
        paddingBottom: hScale(10),
    },
    ///////////////////////////
    listContainer: {
        padding: 10,
    },

    innerContainer: {
        margin: 0.5,
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    separator: {
        marginVertical: 2,
        height: 1,
        backgroundColor: '#ccc',
    },
    borderBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    tabButtonstyle: {
        width: '42%',
        paddingVertical: hScale(7),

    }
});

export default FundReceivedReport;
