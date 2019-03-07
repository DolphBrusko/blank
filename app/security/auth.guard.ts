/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5c7f8a03568681581952d253
*
* You will get 10% discount for each one of your friends
* 
*/
import { AuthenticationService } from '../security/authentication.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { config } from "../../config/properties";
import 'rxjs/add/operator/map';

/**
 * This class intercept route change and check for security
 */
@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(
        private router: Router,
        private http: Http,
        private authenticationService: AuthenticationService
    ){ }

    /**
     * Check route permission
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {

        let that = this;

        // Get authorized roles for route
        let roles:Array<string> = [];
        for (let i in route.data) {
            roles.push(route.data[i]);
        }

        return new Observable<boolean>((ob:any ) => {

            // Get logged user
            this.authenticationService.getUser().subscribe(user => {
                if (!user) {
                    // Not logged
                    ob.next(false);
                    that.router.navigate(['/login']);
                } else {
                    // Check roles
                    if(roles && roles.length > 0) {
                        if(user.hasRole(roles)) {
                            ob.next(true);
                        } else {
                            // Not authorized
                            ob.next(false);
                            that.router.navigate(['/login']);
                        }
                    }
                    ob.next(true);
                }       
            })
        });
    }
}