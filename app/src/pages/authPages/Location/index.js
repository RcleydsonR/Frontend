import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import styles from './styles';
import {
    requestPermissionsAsync,
    getCurrentPositionAsync,
} from 'expo-location';
import Button from '../../../components/UI/button';
import ConfirmationModal from '../../../components/modals/confirmationModal';
import { Icon } from 'react-native-elements';

export default function Location({ route, navigation }) {
    const userData = route.params ? route.params.userData : {};

    const [currentRegion, setCurrentRegion] = useState(null);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(
        false,
    );
    const [descriptionShown, setDescriptionShow] = useState(true);

    useEffect(() => {
        async function getLocation() {
            const { granted } = await requestPermissionsAsync();
            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });
                const { latitude, longitude } = coords;
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0025,
                    longitudeDelta: 0.0025,
                });
            }
        }
        getLocation();
    }, []);

    function continueRegistration() {
        const { latitude, longitude } = currentRegion;
        const newUserData = {
            latitude,
            longitude,
            ...userData,
        };
        setConfirmationModalVisible(false);
        userData.email
            ? navigation.navigate('personalData', { userData: newUserData })
            : navigation.navigate('registrationData', {
                  userData: newUserData,
              });
    }

    return (
        <>
            <View style={styles.adjustPositionBox}>
                <Text style={styles.adjustPositionText}>
                    Arraste para ajustar sua posição
                </Text>
            </View>
            <View
                style={{
                    position: 'absolute',
                    zIndex: 5,
                    top: '43%',
                    left: '43%',
                }}>
                <Image
                    source={require('../../../../assets/images/blueCat.png')}
                    style={{ height: 50, width: 50, resizeMode: 'contain' }}
                />
            </View>
            <MapView
                initialRegion={currentRegion}
                style={styles.map}
                onRegionChangeComplete={(region) => setCurrentRegion(region)}
            />

            <ScrollView style={styles.description} scrollEnabled={false}>
                <TouchableOpacity
                    onPress={() => {
                        setDescriptionShow(!descriptionShown);
                    }}>
                    <Icon
                        name={descriptionShown ? 'sort-down' : 'sort-up'}
                        type="font-awesome"
                    />
                    <Text style={styles.descriptionTextTitle}>
                        Por que precisamos de sua posição?
                    </Text>
                    {descriptionShown && (
                        <Text style={styles.descriptionText}>
                            A posição escolhida será usada para definir a
                            localização das ajudas criadas por você. Por isso,
                            preste bastante atenção ao escolhê-la, pois ela{' '}
                            <Text
                                style={{
                                    fontFamily: 'montserrat-semibold',
                                    color: '#e47171',
                                }}>
                                não poderá ser alterada.
                            </Text>
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.buttons}>
                <Button
                    title="Voltar"
                    type="warning"
                    press={() => {
                        navigation.goBack();
                    }}
                />
                <Button
                    title="Confirmar"
                    type="primary"
                    press={() =>
                        setConfirmationModalVisible(!confirmationModalVisible)
                    }
                />
            </View>

            <ConfirmationModal
                message="Podemos confirmar sua posição atual?"
                visible={confirmationModalVisible}
                setVisible={setConfirmationModalVisible}
                action={continueRegistration}
            />
        </>
    );
}
