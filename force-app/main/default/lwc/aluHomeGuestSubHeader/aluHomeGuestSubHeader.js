import { LightningElement } from 'lwc';
import basePath from '@salesforce/community/basePath';

export default class AluHomeGuestSubHeader extends LightningElement {
    loginUrl = `${basePath}/login`;
}
