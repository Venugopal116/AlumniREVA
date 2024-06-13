import { LightningElement ,track} from 'lwc';
import STUDENTPORTALICONS from '@salesforce/resourceUrl/SR_STUDENTPORTALASSETS';
import basePath from '@salesforce/community/basePath';

import FORM_FACTOR from '@salesforce/client/formFactor';

const baseImageUrl = `${STUDENTPORTALICONS}/StudentPortalAssests/Logos/`;

export default class AluHeader extends LightningElement {

   
    @track  deviceType;
    @track isMobile = false;
    @track isDesktop = false;
    @track isTablet = false;

    revaUniversityLogoUrl = `${baseImageUrl}reva-university.png`;
    revaElevenYearsLogoUrl = `${baseImageUrl}reva-eleven-years.png`;
    homeUrl = `${basePath}/`;

    connectedCallback() {
        console.log('FORM_FACTOR---------->',FORM_FACTOR);
        if (FORM_FACTOR === "Large") {
          this.deviceType = "Desktop/Laptop";
          this.isDesktop = true;
        } else if (FORM_FACTOR === "Medium") {
          this.deviceType = "Tablet";
          this.isTablet = true;
        } else if (FORM_FACTOR === "Small") {
          this.deviceType = "Mobile";
          this.isMobile = true;
        }
      }

    // handleFormFactor() {
    //     console.log('FORM_FACTOR---------->',FORM_FACTOR);
    //     if (FORM_FACTOR === "Large") {
    //         this.deviceType = "Desktop/Laptop";
    //     } else if (FORM_FACTOR === "Medium") {
    //         this.deviceType = "Tablet";
    //     } else if (FORM_FACTOR === "Small") {
    //         this.deviceType = "Mobile";
    //     }
    // }

}