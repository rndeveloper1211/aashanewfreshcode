import { translate } from "../../../utils/languageUtils/I18n";
import React from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import Success from '../../drawer/svgimgcomponents/Success';
import CloseCameraSvg from '../../drawer/svgimgcomponents/CloseCameraSvg';
import RefreshSvg from '../../drawer/svgimgcomponents/RefreshSvg';

interface ImagePreviewModalProps {
  visible: boolean;
  reUploadBtn: boolean;
  imageUri: string;
  onClose: () => void;
  saveClose: () => void;
  reUpload: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ visible, imageUri, onClose, reUpload, saveClose, reUploadBtn = (true) }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const secondaryColorWithOpacity = `${colorConfig.secondaryColor}40`;
  const primaryColorWithOpacity = `${colorConfig.primaryColor}40`;
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback >
        <View style={styles.imageModalBackdrop}>
          <View style={[styles.imageModalContainer,]}>
            <View style={[{ backgroundColor: secondaryColorWithOpacity, width: '100%', height: '100%', padding: wScale(2) }]}>
              <View style={[styles.closeButton,]}>
                {reUploadBtn &&
                  <TouchableOpacity
                    onPress={saveClose}
                  >
                    <CloseCameraSvg />
                  </TouchableOpacity>}
                {reUploadBtn &&

                  <TouchableOpacity
                    style={[styles.reUploadButton, { backgroundColor: '#000' }]}
                    onPress={reUpload}
                  >
                    <RefreshSvg size={'20'} />
                    <Text style={styles.closeButtonText}>{translate("Image_ReUpload")}</Text>
                  </TouchableOpacity>

                }

                <TouchableOpacity onPress={onClose}>
                  <Success />
                </TouchableOpacity>
              </View>
              <ImageViewer
                imageUrls={[{ url: imageUri }]}
                enableSwipeDown
                onCancel={saveClose}
                onSwipeDown={onClose}
                enableImageZoom={true}
                style={{ borderRadius: 10 }}

              />

            </View>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  imageModalContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  closeButton: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hScale(5),
    paddingHorizontal: wScale(10),
  },
  reUploadButton: {
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(2.5),
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hScale(40)
  },
  closeButtonText: {
    color: 'white',
    fontSize: wScale(16),
    fontWeight: 'bold',
    paddingLeft: wScale(5)
  },
});

export default ImagePreviewModal;
