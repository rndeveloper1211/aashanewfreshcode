import { translate } from "../../../utils/languageUtils/I18n";
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
    ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import useAxiosHook from '../../../utils/network/AxiosClient';
import AppBar from '../../drawer/headerAppbar/AppBar';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { FontSize } from '../../../utils/styles/theme';
import LottieView from 'lottie-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MultiImageModal from './MultiImageModal';
import { FlashList } from '@shopify/flash-list';
import { APP_URLS } from '../../../utils/network/urls';
import DynamicButton from '../../drawer/button/DynamicButton';
import { Image } from 'react-native-compressor';
import { useNavigation } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS, openSettings, request, requestMultiple } from 'react-native-permissions';

interface DocumentItem {
    id: string;
    title2: string;
    title: string;
    apiEndpoint: string;
    images: string[];
    isLoading?: boolean;
    isImageLoading?: boolean;
    isDownloaded?: boolean;
    maxImages?: number; // 👈 New Field
}


const DownloadDocRadiant = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const { post, get } = useAxiosHook();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<string | null>(null);
    const [isCameraSessionActive, setIsCameraSessionActive] = useState(false);
    const [tempCameraPhotos, setTempCameraPhotos] = useState<string[]>([]);
    const [documents, setDocuments] = useState<DocumentItem[]>([
        {
            id: '1',
            title2: 'Candidate Application & Evaluation Form',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/RadiantRcmsCandidateFormPDF',
            images: [],
            isLoading: false,
            isImageLoading: false,
            isDownloaded: false,
            maxImages: 2,
        },
        {
            id: '2',
            title2: 'Background Verification Form',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/RadiantPreEmploymentVerificationFormPDF',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 2,
        },
        {
            id: '3',
            title2: 'Reference Check & Finger Impression Form',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/RadiantReferenceCheckPDF',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 1,
        },
        {
            id: '4',
            title2: 'Pre-Employment Verification Form',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/RadiantPreEmploymentVerificationFormPDF',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 2,
        },
        {
            id: '5',
            title2: 'Code of Conduct & non-disclosure Agreement',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/RadiantCodeofConductPDF',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 1,
        },
        {
            id: '6',
            title2: 'Induction Training Form - CE',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/InductionTrainingForm',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 1,
        },

        {
            id: '7',
            title2: 'Checklist for Cash Executives',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/ChecklistforCashExecutives',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 1,
        },
        {
            id: '8',
            title2: 'Photo List',
            title: 'Download Doc',
            apiEndpoint: 'api/Radiant/RadiantCMSPhotoList',
            images: [],
            isLoading: false,
            isImageLoading: false,
            maxImages: 1,
        },
    ]);

    const currentItem = documents.find(item => item.id === currentItemId) || null;

    const downloadAndOpenPDF = async (itemId: string, apiEndpoint: string, title2: string) => {
        try {
            setDocuments(prev => prev.map(doc =>
                doc.id === itemId ? { ...doc, isLoading: true } : doc
            ));

            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Storage permission is required.');
                setDocuments(prev => prev.map(doc =>
                    doc.id === itemId ? { ...doc, isLoading: false } : doc
                ));
                return;
            }

            const downloadDir = Platform.select({
                android: RNFS.DownloadDirectoryPath,
                ios: RNFS.DocumentDirectoryPath,
            });

            const fileName = `${title2.replace(/[/\\?%*:|"<>]/g, '-')}_${Date.now()}.pdf`;
            const filePath = `${downloadDir}/${fileName}`;

            const response = await post({
                url: apiEndpoint,
                config: {
                    responseType: 'blob',
                }
            });

            if (!response) throw new Error('No PDF received from server');

            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    const base64String = reader.result?.toString().split(',')[1];
                    if (base64String) {
                        resolve(base64String);
                    } else {
                        reject(new Error('Failed to convert blob to base64'));
                    }
                };
                reader.onerror = reject;
            });

            await RNFS.writeFile(filePath, base64Data, 'base64');
            await FileViewer.open(filePath, { showOpenWithDialog: true });
            setDocuments(prev => prev.map(doc =>
                doc.id === itemId ? { ...doc, isDownloaded: true, isLoading: false } : doc
            ));
            ToastAndroid.show('PDF downloaded successfully!', ToastAndroid.SHORT);
        } catch (error) {
            console.error('PDF Error:', error);
            Alert.alert('Error', `Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setDocuments(prev => prev.map(doc =>
                doc.id === itemId ? { ...doc, isLoading: false } : doc
            ));
        }
    };


const requestPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    // ✅ Android 13+ pe sirf CAMERA chahiye
    // launchImageLibrary Photo Picker use karta hai — koi permission nahi chahiye
    if (apiLevel >= 33) {
      const status = await check(PERMISSIONS.ANDROID.CAMERA);

      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Required',
          'Please allow camera access from settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings().catch(() => {}) },
          ]
        );
        return false;
      }

      if (status !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        return result === RESULTS.GRANTED;
      }

      return true;
    }

    // ✅ Android 12 aur below
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]);

    const denied = Object.values(results).some(
      status => status !== RESULTS.GRANTED
    );

    if (denied) {
      ToastAndroid.show('Some permissions were denied', ToastAndroid.SHORT);
    }

    return !denied;

  } catch (err) {
    console.error('Permission error:', err);
    return false;
  }
};



    const handleImageSelection = async (itemId: string) => {
        setCurrentItemId(itemId);
        const item = documents.find(doc => doc.id === itemId);

        if (!item) return;

        if (item.images.length > 0) {
            setPreviewVisible(true);
            return;
        }

        // Show action sheet with options
        Alert.alert(
            'Select Option',
            'Choose how to add photos',
            [
                {
                    text: 'Gallery',
                    onPress: () => handleImageSourceSelection(itemId, 'gallery')
                },
                {
                    text: 'Camera',
                    onPress: () => handleImageSourceSelection(itemId, 'camera')
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            { cancelable: true }
        );
    };
    const handleImageSourceSelection = async (itemId: string, source: 'gallery' | 'camera') => {
        setDocuments(prev => prev.map(doc =>
            doc.id === itemId ? { ...doc, isImageLoading: true } : doc
        ));

        try {
            if (source === 'gallery') {
                await openImageGallery(itemId);
            } else {
                await openCamera(itemId);
            }
        } finally {
            setDocuments(prev => prev.map(doc =>
                doc.id === itemId ? { ...doc, isImageLoading: false } : doc
            ));
        }
    };
    const compressImage = async (uri: string): Promise<string> => {
        try {
            // Get original file size
            const fileInfo = await RNFS.stat(uri);
            const fileSizeKB = fileInfo.size / 1024;

            if (fileSizeKB <= 800) {
                return uri; // No compression needed
            }

            // First compression attempt (moderate)
            let compressedUri = await Image.compress(uri, {
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7,
                compressionMethod: 'auto',
            });

            // Verify first compression result
            let compressedInfo = await RNFS.stat(compressedUri);
            let compressedSizeKB = compressedInfo.size / 1024;

            // If still too large, try more aggressive compression
            if (compressedSizeKB > 800) {
                compressedUri = await Image.compress(uri, {
                    maxWidth: 800,
                    maxHeight: 800,
                    quality: 0.5,
                    compressionMethod: 'auto',
                });

                compressedInfo = await RNFS.stat(compressedUri);
                compressedSizeKB = compressedInfo.size / 1024;
            }

            // Final check
            if (compressedSizeKB > 800) {
                throw new Error(`Image could not be compressed below 800KB`);
            }

            return compressedUri;
        } catch (error) {
            console.error('Compression error:', error);
            throw error;
        }
    };

    const openCamera = (itemId: string): Promise<void> => {
        return new Promise(async (resolve) => {
            try {
                const hasPermission = await requestPermissions();
                if (!hasPermission) {
                    ToastAndroid.show('Camera permission required', ToastAndroid.LONG);
                    return resolve();
                }

                const response = await new Promise<any>((innerResolve) => {
                    launchCamera(
                        {
                            mediaType: 'photo',
                            includeBase64: false,
                            quality: 1,
                            saveToPhotos: false,
                            cameraType: 'back',
                        },
                        (response) => innerResolve(response)
                    );
                });

                if (response.didCancel) {
                    ToastAndroid.show('Camera cancelled', ToastAndroid.SHORT);
                    return resolve();
                }

                if (response.errorCode) {
                    ToastAndroid.show(`Error: ${response.errorMessage || 'Camera error'}`, ToastAndroid.LONG);
                    return resolve();
                }

                if (response.assets?.[0]?.uri) {
                    const compressedUri = await compressImage(response.assets[0].uri);
                    const currentDoc = documents.find(doc => doc.id === itemId);

                    if (currentDoc && currentDoc.images.length >= (currentDoc.maxImages || 5)) {
                        ToastAndroid.show(`Max ${currentDoc.maxImages} images allowed`, ToastAndroid.LONG);
                        return resolve();
                    }

                    setDocuments(prevDocs =>
                        prevDocs.map(doc =>
                            doc.id === itemId
                                ? { ...doc, images: [...doc.images, compressedUri] }
                                : doc
                        )
                    );
                    setCurrentItemId(itemId);
                    setPreviewVisible(true);
                    ToastAndroid.show('Photo added!', ToastAndroid.SHORT);
                }

            } catch (error) {
                console.error('Camera error:', error);
                ToastAndroid.show('Camera error occurred', ToastAndroid.LONG);
            } finally {
                resolve();
            }
        });
    };


    const openImageGallery = (itemId: string): Promise<void> => {
        return new Promise(async (resolve) => {
            try {
                const hasPermission = await requestPermissions();
                if (!hasPermission) {
                    ToastAndroid.show('Storage permission required', ToastAndroid.LONG);
                    return resolve();
                }

                const response = await new Promise<any>((innerResolve) => {
                    launchImageLibrary(
                        {
                            mediaType: 'photo',
                            includeBase64: false,
                            quality: 1,
                            selectionLimit: 5,
                        },
                        (response) => innerResolve(response)
                    );
                });

                if (response.didCancel) {
                    return resolve();
                }

                if (response.errorCode) {
                    ToastAndroid.show(`Error: ${response.errorMessage || 'Gallery error'}`, ToastAndroid.LONG);
                    return resolve();
                }

                if (response.assets && response.assets.length > 0) {
                    const validImages: string[] = [];

                    for (const asset of response.assets) {
                        if (!asset.uri) continue;

                        try {
                            const compressedUri = await compressImage(asset.uri);
                            validImages.push(compressedUri);
                        } catch (error) {
                            console.error('Error processing image:', asset.uri, error);
                        }
                    }

                    if (validImages.length > 0) {
                        const currentDoc = documents.find(doc => doc.id === itemId);
                        if (!currentDoc) return resolve();

                        const remaining = (currentDoc.maxImages || 5) - currentDoc.images.length;

                        if (remaining <= 0) {
                            ToastAndroid.show(`Max ${currentDoc.maxImages} images allowed`, ToastAndroid.LONG);
                            return resolve();
                        }

                        const imagesToAdd = validImages.slice(0, remaining); // Respect limit

                        setDocuments(prevDocs =>
                            prevDocs.map(doc =>
                                doc.id === itemId
                                    ? { ...doc, images: [...doc.images, ...imagesToAdd] }
                                    : doc
                            )
                        );
                        ToastAndroid.show(`${imagesToAdd.length} photo(s) added`, ToastAndroid.SHORT);
                    }

                }
            } catch (error) {
                console.error('Gallery error:', error);
                ToastAndroid.show('Failed to select images', ToastAndroid.LONG);
            } finally {
                resolve();
            }
        });
    };

    const handleReupload = async () => {
        if (!currentItemId) return;

        Alert.alert(
            'Select Option',
            'Choose how to add photos',
            [
                {
                    text: 'Gallery',
                    onPress: () => handleImageSourceSelection(currentItemId, 'gallery')
                },
                {
                    text: 'Camera',
                    onPress: () => handleImageSourceSelection(currentItemId, 'camera')
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            { cancelable: true }
        );
    };
    const validateAllItems = () => {
        // Check if all documents have at least 1 image
        const allItemsValid = documents.every(doc => doc.images.length >= 1);

        if (!allItemsValid) {
            const invalidItems = documents.filter(doc => doc.images.length === 0);

            ToastAndroid.show(
                `Please upload at least 1 image for all documents`,
                ToastAndroid.LONG
            );

            setDocuments(docs =>
                docs.map(doc => ({
                    ...doc,
                    isValid: doc.images.length > 0
                }))
            );

            return false;
        }
        return true;
    };

    const uploadRadiant = async () => {
        if (!validateAllItems()) {
            return;
        }

        setIsLoading2(true);
        try {
            const uploadData = await Promise.all(
                documents.map(async (doc) => {
                    const files = await Promise.all(
                        doc.images.map(async (uri) => ({
                            Base64Content: await RNFS.readFile(uri, 'base64')
                        }))
                    );

                    return {
                        MobileNumber: "USER_MOBILE_NUMBER",
                        FileName: doc.title2,
                        Files: files
                    };
                })
            );

            const responses = await Promise.all(
                uploadData.map(data =>
                    post({
                        url: APP_URLS.uploadRadiant,
                        data,
                        config: { headers: { 'Content-Type': 'application/json' } }
                    })
                )
            );

            ToastAndroid.show('All documents uploaded successfully!', ToastAndroid.LONG);
        } catch (error) {
            console.error('Upload failed:', error);
            ToastAndroid.show('Upload failed. Please try again.', ToastAndroid.LONG);
        } finally {
            setIsLoading2(false);
        }
    };

    useEffect(() => {
        return () => {
            tempCameraPhotos.forEach(uri => {
                RNFS.unlink(uri).catch(e => console.warn('Failed to delete temp file:', e));
            });
        };
    }, [tempCameraPhotos]);
    const navigation = useNavigation<any>();

    return (
        <View style={styles.main}>
            <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor]} style={styles.gradientContainer}>
             <AppBar title={'Download Document'}
                    onPressBack={() => {
                        navigation.navigate('DashboardScreen');
                    }}
                />
                <Text style={[styles.toptxt, { backgroundColor: colorConfig.secondaryColor }]}>{translate("key_easilydow_174")}</Text>
                <View style={styles.container}>

                    <FlashList
                        data={documents}
                        renderItem={({ item }) => (
                            <View style={styles.listview}>
                                <Text style={[styles.header,]}>
                                    {item.title2}
                                </Text>
                                <View
                                    style={styles.rowview}
                                >


                                    <TouchableOpacity
                                        style={[styles.imageButton, {
                                            backgroundColor: colorConfig.secondaryColor,
                                            opacity: item.isLoading ? 0.7 : 1
                                        }]}
                                        onPress={() => downloadAndOpenPDF(item.id, item.apiEndpoint, item.title2)}
                                        disabled={item.isLoading || item.isImageLoading}
                                    >

                                        {item.isLoading ? (
                                            <ActivityIndicator
                                                size="large"
                                                color={colorConfig.labelColor}
                                                style={styles.loadingIndicator}
                                            />
                                        ) : (
                                            <Text style={[styles.buttonText, { color: colorConfig.labelColor }]}>
                                                {item.title}
                                            </Text>

                                        )}
                                        <View style={[styles.lotiview, { borderColor: colorConfig.secondaryColor, transform: [{ rotate: '180deg' }] }]}>

                                            <LottieView
                                                autoPlay
                                                loop
                                                colorFilters={[
                                                    { keypath: "LayerName", color: "#000" },
                                                ]}
                                                style={styles.lotiimg}
                                                source={item.images.length > 0
                                                    ? require('../../../utils/lottieIcons/View-Docs.json')
                                                    : require('../../../utils/lottieIcons/upload-file.json')}
                                            />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.imageButton, {

                                            backgroundColor: (!item.isDownloaded || item.isImageLoading)
                                                ? `${colorConfig.primaryColor}80` : colorConfig.primaryColor,
                                            // marginRight:wScale(120)
                                        }]}
                                        onPress={() => {
                                            if (!item.isDownloaded) {
                                                ToastAndroid.show('Please download the PDF first', ToastAndroid.SHORT);
                                            } else {
                                                handleImageSelection(item.id);
                                            }
                                        }}
                                    >
                                        {item.isImageLoading ? (
                                            <ActivityIndicator
                                                size="small"
                                                color={colorConfig.labelColor}
                                                style={styles.loadingIndicator}
                                            />
                                        ) : (
                                            <View style={styles.imageButtonContent}>
                                                <Text style={[styles.buttonText, { color: colorConfig.labelColor }]}>{translate("Upload_Doc")}</Text>


                                            </View>
                                        )}
                                        <View
                                            style={[styles.lotiview, { borderColor: colorConfig.primaryColor, opacity: 1 }]}
                                        >

                                            <LottieView
                                                autoPlay={!item.isDownloaded || item.isImageLoading ? false : true}
                                                loop
                                                colorFilters={[
                                                    { keypath: "LayerName", color: "#000" }, // Change specific layer color
                                                ]}
                                                style={styles.lotiimg}
                                                source={item.images.length > 0
                                                    ? require('../../../utils/lottieIcons/View-Docs.json')
                                                    : require('../../../utils/lottieIcons/upload-file.json')}
                                            />
                                        </View>
                                    </TouchableOpacity>


                                    {item.images.length > 0 && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{item.images.length}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                        estimatedItemSize={100}
                        ListFooterComponent={
                            <DynamicButton
                                title={isLoading2 ? <ActivityIndicator size={'large'} color={colorConfig.labelColor} /> : 'Submit'}
                                onPress={uploadRadiant}
                            />}
                        ListFooterComponentStyle={{ marginVertical: hScale(10) }}
                    />

                </View>
            </LinearGradient>

            <MultiImageModal
                visible={previewVisible}
                imageUris={isCameraSessionActive ? tempCameraPhotos : (currentItem?.images || [])}
                onClose={() => {
                    setPreviewVisible(false);
                    setIsCameraSessionActive(false);
                }}
                reUpload={() => {
                    if (isCameraSessionActive) {
                        openCamera(currentItemId!);
                    } else {
                        handleReupload();
                    }
                }}
                isCameraSession={isCameraSessionActive}
                onDone={() => {
                    if (currentItemId && tempCameraPhotos.length > 0) {
                        setDocuments(prevDocs =>
                            prevDocs.map(doc =>
                                doc.id === currentItemId
                                    ? { ...doc, images: [...doc.images, ...tempCameraPhotos] }
                                    : doc
                            )
                        );
                    }
                    setIsCameraSessionActive(false);
                    setPreviewVisible(false);
                }}
                onDeleteImage={(uri) => {
                    if (isCameraSessionActive) {
                        setTempCameraPhotos(prev => prev.filter(photo => photo !== uri));
                    } else if (currentItemId) {
                        setDocuments(prevDocs =>
                            prevDocs.map(doc =>
                                doc.id === currentItemId
                                    ? { ...doc, images: doc.images.filter(img => img !== uri) }
                                    : doc
                            )
                        );
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        paddingHorizontal: wScale(5),
        marginHorizontal: wScale(10),
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginTop: hScale(-5),
        paddingTop: hScale(20),
    },
    gradientContainer: {
        flex: 1,
    },
    downloadButton: {
        borderRadius: 5,
        height: hScale(40),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wScale(10),
        width: wScale(160)
    },
    imageButton: {
        borderRadius: 5,
        height: hScale(40),
        width: '44%',
        justifyContent: 'center',
        paddingHorizontal: wScale(7),
        backgroundColor: 'green'
    },
    imageButtonContent: {
        position: 'relative',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: FontSize.regular,
    },
    toptxt: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: FontSize.regular,
        borderRadius: 5,
        marginHorizontal: wScale(10),
        zIndex: 222,
        paddingVertical: hScale(10),
        paddingHorizontal: wScale(10),
    },
    listview: {
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: hScale(10),
        paddingHorizontal: wScale(5),
        paddingVertical: hScale(10),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    rowview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: wScale(12)
    },
    header: {
        color: '#000',
        textAlign: 'center',
        fontSize: FontSize.regular,
        fontWeight: 'bold',
        paddingBottom: hScale(10),
    },
    lotiimg: {
        height: hScale(30),
        width: wScale(30),
    },
    lotiview: {
        height: hScale(44),
        width: hScale(44),
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: wScale(-12),
        backgroundColor: 'white',
        borderWidth: wScale(.5),
        top: hScale(-2)
    },
    badge: {
        position: 'absolute',
        right: wScale(-5),
        top: hScale(-5),
        backgroundColor: 'red',
        borderRadius: 10,
        width: wScale(20),
        height: wScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    badgeText: {
        color: 'white',
        fontSize: wScale(12),
        fontWeight: 'bold',
    },
    loadingIndicator: {
        padding: wScale(5),
    },

});
export default DownloadDocRadiant;
