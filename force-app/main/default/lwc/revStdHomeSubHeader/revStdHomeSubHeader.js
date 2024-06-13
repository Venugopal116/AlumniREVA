import { LightningElement } from 'lwc';

import isGuest from '@salesforce/user/isGuest';

export default class RevStdHomeSubHeader extends LightningElement {

    get guestUser() {
        return isGuest;
    }



}