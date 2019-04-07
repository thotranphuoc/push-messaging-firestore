import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import 'firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  messaging = firebase.messaging();
  messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();
  constructor(private afs: AngularFirestore) { }

  // get permission to send messages
  getPermission(user: iUser) {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notificaion permission granted');
        return this.messaging.getToken();
      })
      .then((token) => {
        console.log(token);
        this.saveToken(user, token);
      })
      .catch(err => {
        console.log('Usable to get permission to notify.', err);
      })
  }

  // save the permission token in firestore
  saveToken(user: iUser, token): void {
    const currentTokens = user.fcmTokens || {};
    console.log(currentTokens, token);

    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.afs.collection('users').doc(user.uid);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }
  }

  // used to show message when app is open
  receiveMessages() {
    this.messaging.onMessage(payload => {
      console.log('Message received.', payload);
      this.messageSource.next(payload);
    })
  }

  // listen for token refresh
  monitorRefresh(user: iUser) {
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken()
        .then(refreshedToken => {
          console.log('Token refreshed.');
          this.saveToken(user, refreshedToken);
        })
        .catch(err => {
          console.log(err, 'Unable to retrieve new token');
        })
    })
  }

  sendMessage(){
    // firebase.messaging().s
  }


}
