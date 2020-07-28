import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../../MyRequests/styles';
import ListCard from '../../../../components/ListCard';
import { UserContext } from '../../../../store/contexts/userContext';
import NoHelps from '../../../../components/NoHelps';
import colors from '../../../../../assets/styles/colorVariables';
import helpService from '../../../../services/Help';
import { ServiceContext } from '../../../../store/contexts/serviceContext';

export default function AskedHelps({ navigation }) {
    const { user } = useContext(UserContext);
    const [myOfferedHelps, setMyOfferedHelps] = useState([]);
    const [loadingOfferdHelps, setLoadingOfferdHelps] = useState(true);
    const { useService } = useContext(ServiceContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getHelps();
        });
        return unsubscribe;
    }, [navigation]);

    async function getHelps() {
        setLoadingOfferdHelps(true);
        const filteredHelps = await useService(
            helpService,
            'getHelpMultipleStatus',
            [user._id, ['on_going', 'owner_finished', 'waiting'], true],
        );
        if (!filteredHelps.message) {
            setMyOfferedHelps(filteredHelps);
        }
        setLoadingOfferdHelps(false);
    }

    const renderLoadingIndicator = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );

    const renderHelpRequestsList = () => {
        if (myOfferedHelps.length > 0) {
            return (
                <ScrollView>
                    {myOfferedHelps.map((help) => (
                        <ListCard
                            key={help._id}
                            profilePhoto={help.user.photo}
                            helpId={help._id}
                            helpTitle={help.title}
                            helpDescription={help.description}
                            helpStatus={help.status}
                            categoryName={help.category[0].name}
                            userName={help.user.name}
                            birthday={help.user.birthday}
                            city={help.user.address.city}
                            navigation={navigation}
                            helperId={help.helperId}
                            possibleHelpers={help.possibleHelpers.map(
                                (helper) => helper._id,
                            )}
                            userPhone={help.user.phone}
                            userLocation={help.user.location.coordinates}
                            pageName="OfferDescription"
                        />
                    ))}
                </ScrollView>
            );
        } else {
            return (
                <NoHelps title="Você não está ajudando ninguém até o momento" />
            );
        }
    };

    return (
        <View style={styles.helpList}>
            {loadingOfferdHelps
                ? renderLoadingIndicator()
                : renderHelpRequestsList()}
        </View>
    );
}
