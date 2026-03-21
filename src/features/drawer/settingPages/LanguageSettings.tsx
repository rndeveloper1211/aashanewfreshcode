import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AppBarSecond from '../headerAppbar/AppBarSecond';
import LenguageSvg from '../svgimgcomponents/Lenguageimg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../button/DynamicButton';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { useDispatch } from 'react-redux';
import CheckSvg from '../svgimgcomponents/CheckSvg';
import { setLocale, translate } from '../../../utils/languageUtils/I18n';
import { setAppLanguage } from '../../../reduxUtils/store/userInfoSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSettings = () => {
    const { colorConfig, appLanguage } = useSelector((state: RootState) => state.userInfo);
    const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
    const dispatch = useDispatch();
    const saveRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const languages = [
      { title: 'English (India)', code: 'en' },
      { title: 'Hindi (हिंदी)', code: 'hi' },
      { title: 'Bengali (বাংলা)', code: 'bn' },
      { title: 'Gujarati (ગુજરાતી)', code: 'gj' },
      { title: 'Kannada (ಕನ್ನಡ)', code: 'kn' },
      { title: 'Marathi (मराठी)', code: 'mh' },
      { title: 'Tamil (தமிழ்)', code: 'tn' },
      { title: 'Telugu (తెలుగు)', code: 'tl' },
    ];
  
    // Load saved language on component mount
    useEffect(() => {
      const loadSavedLanguage = async () => {
        try {
          const savedLang = await AsyncStorage.getItem('@app_language');
          if (savedLang) {
            const index = languages.findIndex(lang => lang.code === savedLang);
            if (index !== -1) {
              setSelectedLanguageIndex(index);
            }
          }
        } catch (error) {
          console.error('Error loading language:', error);
        }
      };
      
      loadSavedLanguage();
    }, []);
  
    // Update when appLanguage changes
    useEffect(() => {
      if (appLanguage) {
        const index = languages.findIndex((language) => language.code === appLanguage);
        if (index !== -1) setSelectedLanguageIndex(index);
      }
    }, [appLanguage]);
  
    const changeLanguage = (index: number) => {
      setTimeout(() => {
        if (saveRef.current) {
          saveRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
      setSelectedLanguageIndex(index);
    };
  
    const BtnPress = async () => {
      setLoading(true);
      
      try {
        const selectedLang = languages[selectedLanguageIndex].code;
        
        // Save to AsyncStorage first
        await AsyncStorage.setItem('@app_language', selectedLang);
        
        // Then update i18n and Redux
        await setLocale(selectedLang);
        dispatch(setAppLanguage(selectedLang));
        
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'SUCCESS',
          textBody: 'Your Language Is Changed Successfully',
          button: 'OK',
          onPressButton: () => {
            Dialog.hide();
          },
        });
      } catch (error) {
        console.error('Error changing language:', error);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'ERROR',
          textBody: 'Failed to change language',
          button: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };
    
    return (
        <View style={styles.main}>
            <AppBarSecond
                title="Application {App} Language"
                actionButton={undefined}
                onActionPress={undefined}
                onPressBack={undefined}
                titlestyle={undefined}
            />
            <View style={styles.imgs1}>
                <LenguageSvg />
            </View>
            <View style={[styles.selectedLanguageContainer]}>
                <Text style={[styles.heading2,{}]}>{`${translate('Selected Language')}`} </Text>
                <Text style={[styles.heading2, { color: colorConfig.secondaryColor }]}>{languages[selectedLanguageIndex].title}</Text>
            </View>
            <ScrollView ref={saveRef}>
                <View style={styles.container}>
                    <View style={styles.languageContainer}>
                        <View style={styles.languageList}>
                            {languages.map((language, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    onPress={() => changeLanguage(index)}
                                    style={[styles.languageButton,]}
                                >
                                    <View style={[styles.languageEmojiContainer, index === selectedLanguageIndex && { backgroundColor: colorConfig.secondaryColor }]}>
                                        {index === selectedLanguageIndex && <CheckSvg />}
                                    </View>
                                    <Text style={[styles.languageText, language.title === 'Telugu (తెలుగు)' && styles.hideborder]}>
                                        {language.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <View style={{ marginBottom: 10 }} />
                            <DynamicButton 
                                title={loading ? <ActivityIndicator size={'large'} color={colorConfig.labelColor} /> : `${translate('Save')}`} 
                                onPress={BtnPress} 
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1 },
    container: {
        paddingHorizontal: wScale(10),
        flex: 1,
        marginBottom: hScale(0),
    },
    languageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: hScale(8),
    },
    heading: {
        fontSize: wScale(22),
        fontWeight: 'bold',
        color: '#fff',
        width: '100%',
        paddingVertical: hScale(8),
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    selectedLanguageContainer: {
        marginBottom: hScale(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: hScale(8),
        marginTop: hScale(8),
        borderRadius: 20
    },
    heading2: {
        fontSize: wScale(20),
        fontWeight: 'bold',
        color: '#000',
    },
    languageText: {
        textTransform: 'capitalize',
        fontSize: wScale(20),
        color: '#000',
        paddingTop: hScale(16),
        flex: 1,
        paddingBottom: hScale(18),
        borderBottomColor: "rgba(0,0,0,.4)",
        borderBottomWidth: wScale(.4),
    },
    hideborder: {
        borderBottomWidth: wScale(0),
    },
    languageList: {
        width: '100%',
        paddingHorizontal: wScale(8),
        paddingTop: hScale(8)
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageEmojiContainer: {
        marginRight: wScale(20),
        borderWidth: wScale(.5),
        borderRadius: 25,
        height: wScale(30),
        width: wScale(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageEmoji: {
        fontSize: wScale(19),
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#fff'
    },
    imgs1: {
        marginTop: hScale(10),
        alignSelf: 'center'
    }
});

export default LanguageSettings;