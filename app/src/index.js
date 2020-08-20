import React from 'react';
import Routes from './Navigation';
import { UserContextProvider } from './store/contexts/userContext';
import HelpContextProvider from './store/contexts/helpContext';
import CampaignContextProvider from './store/contexts/campaignContext';
import CategoryContextProvider from './store/contexts/categoryContext';
import DeviceInfoProvider from './store/contexts/deviceInformationContext';
import HelpOfferContextProvider from './store/contexts/helpOfferContext';

export default function Root() {
    return (
        <DeviceInfoProvider>
            <UserContextProvider>
                <CategoryContextProvider>
                    <CampaignContextProvider>
                        <HelpOfferContextProvider>
                            <HelpContextProvider>
                                <Routes />
                            </HelpContextProvider>
                        </HelpOfferContextProvider>
                    </CampaignContextProvider>
                </CategoryContextProvider>
            </UserContextProvider>
        </DeviceInfoProvider>
    );
}
