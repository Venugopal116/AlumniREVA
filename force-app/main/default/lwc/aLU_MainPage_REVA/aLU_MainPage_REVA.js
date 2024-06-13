import { LightningElement, track, wire, api } from 'lwc';

import { NavigationMixin } from 'lightning/navigation';


import ALU_HOMEPAGE_TILE_ICONS from '@salesforce/resourceUrl/ALU_HomePage_TileIconsZIP';
const TILE_ICONS = `${ALU_HOMEPAGE_TILE_ICONS}/ALU_HomePage_TileIconsZIP`;
export default class ALU_MainPage_REVA extends NavigationMixin(LightningElement) {


    //new Icons Updated
    @track happeningsIcon = TILE_ICONS + '/happeningsAtReva.png';
    @track stayConnectedIcon = TILE_ICONS + '/stayConnected.png';
    @track accomplishmentsIocn = TILE_ICONS + '/accomplishments.png';
    @track seekEmploymentIocn = TILE_ICONS + '/seekJob.png';
    @track jobAdsIcon = TILE_ICONS + '/jobAd.png';
    @track digitalCardsIcon = TILE_ICONS + '/digitalCards.png';
    @track eventRegIcon = TILE_ICONS + '/eventReg.png';
    @track blogsIocn = TILE_ICONS + '/blogs.png';
    @track volunteerIcon = TILE_ICONS + '/alumnivolunteer1.png';
    @track aluAssitIcon = TILE_ICONS + '/alumniAssist.png';
    @track feedbackIcon = TILE_ICONS + '/feedback.png';
    @track contributionsIocn = TILE_ICONS + '/contributions.png';
    @track aboutMe = TILE_ICONS + '/aboutMe.png';



    get getTopBannerBg() {
        return `background-image:url("${this.topBannerBg}") ;`;
    }
    get getMiddleBannerBg() {
        return `background-image:url("${this.middleBannerBg}") ; `;
    }
    get getBottomBannerBg() {
        return `background-image:url("${this.bottomBannerBg}") ; `;
    }
    get getConnectWithAlumniTileBg() {
        return `background-image:url("${this.connectWithAlumniTileBg}") ; `;
    }
    get getJoinRevaEventsTileBg() {
        return `background-image:url("${this.joinRevaEventsTileBg}") ; `;
    }
    get getHandSakeIcon() {
        return `background-image:url("${this.joinRevaEventsTileBg}") ; `;
    }


    //navigate(Dynamic) to different community pages
    navigateTo_CommPage(event) {
        const pageName = event.currentTarget.dataset.pagename;
        console.log('pageName--->' + pageName);

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageName   //'Achievements__c'
            }
        });
    }
    //navigateToAlumniAssistPage

    navigateToAlumniAssistPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/case/Case/Default'
            },
        });
    }


}