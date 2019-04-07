import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging.service';
import { AuthService } from './services/auth.service';
import { filter, take } from 'rxjs/operators';

import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'push-messaging-firestore';
  message: Observable<any>;
  constructor(
    public msgService: MessagingService,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    this.auth.user
      .pipe(
        filter(user => !!user), take(1)
      )
      .subscribe(user => {
        if (user) {
          console.log(user);
          this.msgService.getPermission(user);
          this.msgService.receiveMessages();
          this.message = this.msgService.currentMessage;

          // firebase.messaging().
        }
      })
  }
}
