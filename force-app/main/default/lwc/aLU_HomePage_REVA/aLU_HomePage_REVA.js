import { LightningElement ,track, wire, api } from 'lwc';
// import ALU_HOMEPAGE_BANNERS from '@salesforce/resourceUrl/ALU_HomePage_Banners'; //testDelete  //ALU_TopBanner
// import testDelete from '@salesforce/resourceUrl/testDelete';

import TOP_BANNER from '@salesforce/resourceUrl/ALU_TopBanner';
import MIDDLE_BANNER from '@salesforce/resourceUrl/ALU_MiddleBanner';
import BOTTOM_BANNER from '@salesforce/resourceUrl/ALU_BottomBanner';  //ALU_iconFiles
import TILE_1 from '@salesforce/resourceUrl/ALU_ConnectWithAlumni_Tile'; 
import TILE_2 from '@salesforce/resourceUrl/ALU_JoinRevaEvent_Tile';

import ALU_ICONS from '@salesforce/resourceUrl/ALU_iconFiles';
export default class ALU_HomePage_REVA extends LightningElement {

    @track topBannerBg  = TOP_BANNER;
    @track middleBannerBg = MIDDLE_BANNER ;
    @track bottomBannerBg = BOTTOM_BANNER;
    @track connectWithAlumniTileBg = TILE_1;
    @track joinRevaEventsTileBg = TILE_2;

    @track handSakeIcon = ALU_ICONS + '/handSake.png';
    @track allHandsJoinIcon = ALU_ICONS + '/allHands.png';
    @track givingHandsIcon = ALU_ICONS + '/givingHands.png';
    @track contactBookIcon = ALU_ICONS + '/contactBook.png';
    @track folderIcon = ALU_ICONS + '/folder.png';
    

    get getTopBannerBg(){
        
        return `background-image:url("${this.topBannerBg}") ;   `;
    }
    get getMiddleBannerBg(){
        return `background-image:url("${this.middleBannerBg}") ; `;
    }
    get getBottomBannerBg(){
        return `background-image:url("${this.bottomBannerBg}") ; `;
    }
    get getConnectWithAlumniTileBg(){
        return `background-image:url("${this.connectWithAlumniTileBg}") ; `;
    }
    get getJoinRevaEventsTileBg(){
        return `background-image:url("${this.joinRevaEventsTileBg}") ; `;
    }
    get getHandSakeIcon(){
        return `background-image:url("${this.joinRevaEventsTileBg}") ; `;
    }
    



    // @track topBanner  = ALU_HOMEPAGE_BANNERS + '/testZipfolder/testDeletesnap.png'; //testDelete; //testZipfolder
    // @track middleBanner = ALU_HOMEPAGE_BANNERS + '/PassPic_Venu.jfif';
    // @track bottomBanner = ALU_HOMEPAGE_BANNERS + '/2023-08-14 (1).png';


// get topBanner() {
//     return `height:50rem;background-image:url(${topBanner})`;
// }


}