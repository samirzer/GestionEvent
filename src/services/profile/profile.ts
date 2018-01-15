import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ProfileProvider {

  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;

  constructor() {
    this.currentUser=firebase.auth().currentUser;
    this.userProfile = firebase.database().ref(`/userProfile/${this.currentUser.uid}`);
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  updateName(prenom: string, nom: string): Promise<any> {
    return this.userProfile.update({ prenom, nom });
  }

  updateDOB(dateNaissance:string): Promise<any> {
    return this.userProfile.update({ dateNaissance });
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, password );
    return this.currentUser.reauthenticateWithCredential(credential).then
      (user => {
        this.currentUser.updateEmail(newEmail).then(user => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth
      .EmailAuthProvider.credential(this.currentUser.email, oldPassword      );
    return this.currentUser.reauthenticateWithCredential(credential).then
    (user => {
        this.currentUser.updatePassword(newPassword).then(user => {
          console.log('Password Changed');
        });
      })
      .catch(error => {
        console.error(error);
      });
  }


}