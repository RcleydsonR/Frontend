import api from '../services/Api';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

class EntityService {
    async requestLoggedEntityData() {
        try {
            const entity = await api.get('/entity/getEntity');
            return entity.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async requestEntityDataById(id) {
        try {
            const entity = await api.get(`/entity/getEntity/${id}`);
            return entity.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async editEntityAdress(data) {
        const entity = await api.put('/entity/address', data);
        return entity.data;
    }

    async verifyEntityInfo(value) {
        const response = await api.get(`/checkEntityExistence/${value}`);
        return !!response.data;
    }

    async editEntity(data, complement = '') {
        const entity = await api.put(`/entity${complement}`, data);
        return entity.data;
    }

    async setEntityDeviceId() {
        try {
            if (Constants.isDevice) {
                const { status: existingStatus } = await Permissions.getAsync(
                    Permissions.NOTIFICATIONS,
                );
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Permissions.askAsync(
                        Permissions.NOTIFICATIONS,
                    );
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    throw 'Failed to get push token for push notification!';
                }
            }

            Notifications.getExpoPushTokenAsync()
                .then(async (pushToken) => {
                    await api.put('/entity', { deviceId: pushToken });
                })
                .catch((error) => {
                    console.log(error);
                    console.log('Tente rodar "expo login"');
                });
        } catch {
            throw { error: 'Não foi possível recuperar Push Token!' };
        }
    }
}

const entityService = new EntityService();
Object.freeze(entityService);

export default entityService;
