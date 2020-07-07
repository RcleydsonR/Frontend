import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Linking,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';
import Button from '../../../components/UI/button';
import moment from 'moment';
import { HelpContext } from '../../../store/contexts/helpContext';
import { UserContext } from '../../../store/contexts/userContext';
import HelpService from '../../../services/Help';
import ConfirmationModal from '../../../components/modals/confirmationModal';
import ListHelpers from './ListHelpers/index';
import actions from '../../../store/actions';
import { alertError, alertSuccess } from '../../../utils/Alert';
import { showWarningFor } from '../../../utils/warningPopUp';
import { offeringHelpMessage } from '../../../docs/warning';

export default function HelpDescription({ route, navigation }) {
    const { user } = useContext(UserContext);
    const { helpList, dispatch } = useContext(HelpContext);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(
        false,
    );
    const [clickPossibleHelpers, setClickPossibleHelpers] = useState(false);
    const [modalAction, setModalAction] = useState(() => {});
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        helpDescription,
        categoryName,
        helpId,
        userName,
        birthday,
        city,
        profilePhoto,
        ownerId,
        helperId,
        userPhone,
        userLocation,
        helpStatus,
        possibleHelpers,
    } = route.params;

    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const photo = profilePhoto || user.photo;
    const photoFormated = photo.includes('http') //photo from web
        ? { uri: photo }
        : { uri: `data:image/png;base64,${photo}` }; // base 64

    useEffect(() => {
        showWarningFor('offeringHelp', offeringHelpMessage);
    }, []);

    async function chooseHelp() {
        try {
            await HelpService.chooseHelp(helpId, user._id);
            let helpListArray = helpList.filter((help) => {
                return help._id != helpId;
            });
            dispatch({ type: actions.help.storeList, helps: helpListArray });
            navigation.goBack();
            alertSuccess(
                'Oferta enviada com sucesso e estará no aguardo para ser aceita',
            );
        } catch (error) {
            navigation.goBack();
            alertError(error);
        }
    }

    async function finishHelp() {
        try {
            await HelpService.finishHelpByHelper(helpId, user._id);
            navigation.goBack();
            alertSuccess(
                'Você finalizou sua ajuda! Aguarde o dono do pedido finalizar para concluí-la',
            );
        } catch (error) {
            navigation.goBack();
            alertError(error);
        }
    }

    function openModal(action) {
        switch (action) {
            case 'finish':
                setModalAction(() => () => {
                    finishHelp();
                    setIsLoading(true);
                });
                setModalMessage(
                    'Você tem certeza que deseja finalizar essa ajuda?',
                );
                break;
            case 'offer':
                setModalAction(() => () => {
                    chooseHelp();
                    setIsLoading(true);
                });
                setModalMessage('Você deseja confirmar a sua ajuda?');
                break;
            default:
                return;
        }
        setConfirmationModalVisible(true);
    }

    function openMaps() {
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        });
        const latLng = `${userLocation[1]},${userLocation[0]}`;
        const label = 'Pedido de Ajuda de ' + userName;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });
        Linking.openURL(url);
    }

    function openWhatsapp() {
        Linking.openURL(
            `whatsapp://send?phone=${userPhone}&text=${'Olá, precisa de ajuda?'}`,
        );
    }

    function calculateAge(birthday) {
        let age = moment().diff(moment(birthday), 'years');
        return age;
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <ConfirmationModal
                    visible={confirmationModalVisible}
                    setVisible={setConfirmationModalVisible}
                    action={modalAction}
                    message={modalMessage}
                    isLoading={isLoading}
                />
                {!clickPossibleHelpers && (
                    <>
                        <View style={styles.userInfo}>
                            <Image
                                source={photoFormated}
                                style={styles.profileImage}
                            />
                            <View style={styles.infoTextView}>
                                <Text
                                    style={[
                                        styles.infoText,
                                        styles.infoTextFont,
                                    ]}>
                                    {userName || user.name}
                                </Text>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoTextFont}>
                                        Idade:{' '}
                                    </Text>
                                    {age || calculateAge(user.birthday)}
                                </Text>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoTextFont}>
                                        Cidade:{' '}
                                    </Text>
                                    {city || user.address.city}
                                </Text>
                                {user._id == helperId && (
                                    <Text style={styles.infoText}>
                                        <Text style={styles.infoTextFont}>
                                            Telefone:
                                        </Text>
                                        {userPhone}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.helpInfo}>
                            <View style={styles.helpInfoText}>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoTextFont}>
                                        Categoria:{' '}
                                    </Text>
                                    {categoryName}
                                </Text>
                                <Text
                                    style={[
                                        styles.infoText,
                                        styles.infoTextDescription,
                                    ]}>
                                    Descrição:
                                </Text>
                                <Text
                                    style={[
                                        styles.infoText,
                                        styles.infoTextBottom,
                                    ]}>
                                    {helpDescription}
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {user._id == helperId && helpStatus != 'finished' && (
                    <View style={styles.ViewLink}>
                        <View style={styles.ViewLinkBox}>
                            <TouchableOpacity onPress={openWhatsapp}>
                                <Icon
                                    name="whatsapp"
                                    type="font-awesome"
                                    size={50}
                                    color="#25d366"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={openMaps}>
                                <Icon
                                    name="directions"
                                    type="font-awesome-5"
                                    size={50}
                                    color="#4285F4"
                                />
                            </TouchableOpacity>
                        </View>

                        <Button
                            title="Finalizar ajuda"
                            large
                            press={() => openModal('finish')}
                        />
                    </View>
                )}
                <View style={styles.helpButtons}>
                    {user._id === ownerId ? (
                        <ListHelpers
                            stateAction={clickPossibleHelpers}
                            clickAction={setClickPossibleHelpers}
                            helpId={helpId}
                            navigation={navigation}
                        />
                    ) : user._id !== helperId &&
                      helpStatus != 'finished' &&
                      (!possibleHelpers ||
                          !possibleHelpers.includes(user._id)) ? (
                        <>
                            <Text>{helpStatus}</Text>
                            <Button
                                title="Oferecer Ajuda"
                                large
                                press={() => openModal('offer')}
                            />
                        </>
                    ) : helpStatus === 'waiting' ? (
                        <Text style={styles.waitingToBeAccepted}>
                            Aguarde o dono da ajuda escolher seu ajudante.
                        </Text>
                    ) : null}
                </View>
            </View>
        </ScrollView>
    );
}
