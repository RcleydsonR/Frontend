import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OnGoingHelps from '../../../pages/HelpPages/MyRequests/OnGoingHelps';
import HelpsFinished from '../../../pages/HelpPages/MyRequests/HelpsFinished';
import MyRequestHelpDescrition from '../../../pages/HelpPages/MyRequestHelpDescrition';
import headerStyle from '../MainNavigationStyles/MainStackHeaderStyle';
import tabTopBarOptions from './tabTopBarMyHelp.options';
import ListPossibleHelpers from '../../../pages/HelpPages/MyRequestHelpDescrition/ListPossibleHelpers';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const NavigationAskedHelps = () => (
    <TopTab.Navigator
        initialRouteName="em andamento"
        tabBarOptions={tabTopBarOptions}>
        <TopTab.Screen name="em andamento" component={OnGoingHelps} />
        <TopTab.Screen name="finalizados" component={HelpsFinished} />
    </TopTab.Navigator>
);

const MyRequestsNavigation = () => (
    <Stack.Navigator screenOptions={headerStyle}>
        <Stack.Screen name="Meus pedidos" component={NavigationAskedHelps} />
        <Stack.Screen
            name="MyRequestHelpDescrition"
            component={MyRequestHelpDescrition}
            options={({ route }) => ({
                title: route.params.help.title,
            })}
        />
        <Stack.Screen
            name="listPossibleHelpers"
            component={ListPossibleHelpers}
            options={({ route }) => ({
                title: route.params.help.title,
            })}
        />
    </Stack.Navigator>
);

export default MyRequestsNavigation;
