import { Router } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { UserService } from 'src/app/core/user/user.service';
import { environment } from 'src/environments/environment';
import { ServerLogService } from './server-global.service';
import * as StackTrace from 'stacktrace-js'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector){ }

  handleError(error: any): void {
    const location = this.injector.get(LocationStrategy);
    const userService = this.injector.get(UserService);
    const serverLogService = this.injector.get(ServerLogService);
    const router = this.injector.get(Router)

    const url = location instanceof PathLocationStrategy
      ? location.path()
      : '';

    console.log('Passei pelo handler');

    const message = error.message
      ? error.message
      : error.toString();

    if(environment.production) router.navigate(['/error'])

    StackTrace
        .fromError(error)
        .then(stackFrames =>{

          const stackAsString = stackFrames
                .map(sf => sf.toString())
                .join('\n');

                console.log(message);
                console.log(stackAsString);
                console.log("o que vai para o servidor");
                // console.log({ message, url,userName: userService.getUserName(), stack: stackAsString });
                serverLogService.log({
                  message,
                  url,
                  userName: userService.getUserName(),
                  stack: stackAsString}
                ).subscribe(
                    () => console.log('Error logged on server'),
                    err => {
                        console.log(err);
                        console.log('Fail to send error log to server');
                    }
                )
        })
      }
}
