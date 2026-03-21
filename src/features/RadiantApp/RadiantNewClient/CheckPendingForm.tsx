import { translate } from "../../../utils/languageUtils/I18n";
import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TeamReviewSvg from '../../drawer/svgimgcomponents/IMPSsvg copy';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';

const CheckPendingForm = () => {
    return (
        <View style={{ flex: 1 }} >
            <AppBarSecond />
            <View style={styles.container}>
                {/* ✅ Success Animation */}
                <LottieView
                    source={require('../../../utils/lottieIcons/Success.json')}
                    autoPlay
                    loop={true}
                    style={styles.animation}
                />

                {/* ✅ Success Message */}
                <Text style={styles.title}>{translate("key_yourinfor_168")}</Text>
                <Text style={styles.subtitle}>{translate("key_ourteami_169")}</Text>

                {/* ✅ Status Icon */}
                <MaterialIcons name="pending-actions" size={60} color="#FFA500" style={styles.icon} />

                {/* ✅ Decorative Image */}
                <TeamReviewSvg size={200}
                />
            </View>
        </View>
    );
};

export default CheckPendingForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        padding: 20,
    },
    animation: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    icon: {
        marginBottom: 20,
    },
    image: {
        width: 250,
        height: 150,
    },
});
