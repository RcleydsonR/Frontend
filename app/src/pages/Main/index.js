import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from './styles';
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements';
import mapStyle from '../../../assets/styles/mapstyle';
import colors from '../../../assets/styles/colorVariables';
import CreateHelpButtons from '../../components/CreateHelpButtons';
import CategoryListModal from '../../components/modals/category/CategoryList';
import { HelpContext } from '../../store/contexts/helpContext';
import { CampaignContext } from '../../store/contexts/campaignContext';
import { UserContext } from '../../store/contexts/userContext';
import { HelpOfferContext } from '../../store/contexts/helpOfferContext';
import HelpList from '../../components/HelpList';
import UserMarker from './UserMarker';
import CampaignMarker from './CampaignMarker';
import HelpMarker from './HelpMarker';
import HelpOfferMarker from './HelpOfferMarker';

export default function Main({ navigation }) {
    const [region, setRegion] = useState(null);
    const [helpListVisible, setHelpListVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const { helpList } = useContext(HelpContext);
    const { userPosition, user } = useContext(UserContext);
    const { campaignList } = useContext(CampaignContext);
    const { helpOfferList } = useContext(HelpOfferContext);

    useEffect(() => {
        setRegion(null);
    }, [region]);

    const renderCampaignMarkers = () => {
        return campaignList.map((campaign) => {
            return <CampaignMarker key={campaign._id} campaign={campaign} />;
        });
    };

    const renderHelpMakers = () => {
        return helpList.map((help) => {
            const isRiskGroup = !!help.user.riskGroup.length;

            return (
                <HelpMarker
                    key={help._id}
                    isRiskGroup={isRiskGroup}
                    help={help}
                />
            );
        });
    };
    const renderHelpOfferMakers = () => {
        return helpOfferList.map((helpOffer) => (
            <HelpOfferMarker key={helpOffer._id} helpOffer={helpOffer} />
        ));
    };

    const renderFilterButton = () => (
        <TouchableOpacity
            style={styles.filter}
            onPress={() => {
                setFilterModalVisible(!filterModalVisible);
            }}>
            <Icon
                name="filter"
                type="font-awesome"
                color={colors.dark}
                size={20}
            />
        </TouchableOpacity>
    );

    const renderCreateRequestButton = () => {
        const isEntityUser = user.cnpj;
        if (isEntityUser) {
            return (
                <TouchableOpacity
                    style={styles.campaignButton}
                    onPress={() => {
                        navigation.navigate('createCampaign');
                    }}>
                    <Icon
                        name="plus"
                        type="font-awesome"
                        color={colors.light}
                        size={30}
                    />
                </TouchableOpacity>
            );
        } else return <CreateHelpButtons />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <CategoryListModal
                visible={filterModalVisible}
                setVisible={setFilterModalVisible}
            />
            <TouchableOpacity
                style={styles.recenter}
                onPress={() => {
                    setRegion(userPosition);
                }}>
                <Icon
                    name="target-two"
                    type="foundation"
                    color={colors.light}
                    size={35}
                />
            </TouchableOpacity>

            <MapView
                initialRegion={userPosition}
                style={styles.map}
                region={region}
                onRegionChange={() => setHelpListVisible(false)}
                onPress={() => {
                    setHelpListVisible(false);
                }}
                customMapStyle={mapStyle.day.map}>
                <UserMarker userPosition={userPosition} />
                {renderCampaignMarkers()}
                {renderHelpMakers()}
                {renderHelpOfferMakers()}
            </MapView>
            {renderCreateRequestButton()}
            {renderFilterButton()}

            <View style={styles.helpList}>
                <HelpList
                    helps={helpList}
                    campaigns={campaignList}
                    visible={helpListVisible}
                    setVisible={setHelpListVisible}
                    navigation={navigation}
                />
            </View>
        </SafeAreaView>
    );
}
