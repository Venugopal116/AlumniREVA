import { LightningElement ,track, wire, api } from 'lwc';

import { NavigationMixin } from 'lightning/navigation';
import ALU_SOCIAL_MEDIA_ICONS from '@salesforce/resourceUrl/ALU_SocialMediaIcons';//
import REVA_VICE_CHANCELLOR from '@salesforce/resourceUrl/RevaViceChancellor';


export default class AluHomeFooterCard extends NavigationMixin(LightningElement) {

    @track fbIcon = ALU_SOCIAL_MEDIA_ICONS + '/facebook.png';
    @track instaIcon = ALU_SOCIAL_MEDIA_ICONS + '/instaLogo.svg';
    @track youtubeIcon = ALU_SOCIAL_MEDIA_ICONS + '/youtubeLogo.png';
    @track twitterIcon = ALU_SOCIAL_MEDIA_ICONS + '/twitterLogo.svg';
    @track linkedInIcon = ALU_SOCIAL_MEDIA_ICONS + '/lnLogo.png';

    @track vcPic = REVA_VICE_CHANCELLOR;
}