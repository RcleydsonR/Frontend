import api from "../services/Api";
import firebaseAuth from './firebaseAuth';
import { AsyncStorage } from 'react-native';

class UserService {
  constructor() {}

  async logIn(data) {    
    try {
      await firebaseAuth
        .auth()
        .signInWithEmailAndPassword(
          data.email,
          data.password
        );

      const idTokenUser = await firebaseAuth
        .auth()
        .currentUser
        .getIdToken(); 
              
      await AsyncStorage.setItem('tokenId', idTokenUser);
    } catch {
      throw { error: 'Não foi possível Deslogar!' };
    } 
    // return await this.requestUserData();
  }

  async logOut() {
    try {
      await firebase.auth().signOut();
      await AsyncStorage.clear();
    } catch {
      throw { error: 'Não foi possível Deslogar!' };
    }
  }
  signUp() {}

  isSignIn() {
    return this._token !== undefined;
  }

  async requestUserData() {
    const user = await api.get(`/user/${this._id}`);
    return user.data;
  }

  helpAnUser() {}
}

const userService = new UserService();
Object.freeze(userService);

export default userService;
