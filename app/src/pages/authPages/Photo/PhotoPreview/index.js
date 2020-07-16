import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

import TermsModal from '../../../../components/modals/conditionTermsModal';
import PrivacyPolicyModal from '../../../../components/modals/privacyPolicyModal';
import Buttom from '../../../../components/UI/button';

import styles from './styles';

export default function PhotoPreview({ route, navigation }) {
    const { userDataFromAddressPage, selectedPhoto } = route.params;

    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [checked, setChecked] = useState(false);
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
    const navigateBackToPhotoPage = () => navigation.goBack();

    async function continueHandler() {
        const userDataFromPhotoPage = {
            photo: selectedPhoto,
            ...userDataFromAddressPage,
        };
        navigation.navigate('riskGroup', { userDataFromPhotoPage });
    }

    const titleCheckBox = (
        <View style={styles.checkBoxTitle}>
            <View style={styles.checkBoxContent}>
                <Text style={styles.checkBoxText}> Li e concordo com os </Text>
                <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                    <Text style={styles.hyperLink}> Termos de Uso </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.checkBoxContent}>
                <Text style={styles.checkBoxText}>e as </Text>
                <TouchableOpacity onPress={() => setPrivacyModalVisible(true)}>
                    <Text style={styles.hyperLink}>
                        Políticas de privacidade
                    </Text>
                </TouchableOpacity>
                <Text style={styles.checkBoxText}>.</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: `data:image/png;base64,${selectedPhoto}` }}
                style={styles.thumbnail}
            />
            <View style={styles.selectText}>
                <Text style={styles.text}>
                    Clique em continuar para prosseguir com o cadastro, ou
                    voltar para escolher outra foto.
                </Text>
            </View>
            <View style={styles.checkBox}>
                <CheckBox
                    title={titleCheckBox}
                    style={styles.checkbox}
                    iconRight
                    size={28}
                    checked={checked}
                    onPress={() => setChecked(!checked)}
                    onIconPress={() => setChecked(!checked)}
                />
            </View>

            <View style={styles.buttonPreview}>
                <Buttom
                    title="Voltar"
                    type="notSelected"
                    press={() => {
                        navigateBackToPhotoPage();
                    }}
                />
                <Buttom
                    disabled={!checked}
                    title="Continuar"
                    press={() => {
                        continueHandler();
                    }}
                />
            </View>
            <TermsModal
                visible={termsModalVisible}
                setVisible={setTermsModalVisible}
            />
            <PrivacyPolicyModal
                visible={privacyModalVisible}
                setVisible={setPrivacyModalVisible}
            />
        </View>
    );
}
