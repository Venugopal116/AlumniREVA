import { LightningElement } from 'lwc';
import STUDENTPORTALICONS from '@salesforce/resourceUrl/SR_STUDENTPORTALASSETS';
import basePath from '@salesforce/community/basePath';

const baseImageUrl = `${STUDENTPORTALICONS}/StudentPortalAssests/Logos/`;


export default class RevStdHeader extends LightningElement {
    revaUniversityLogoUrl = `${baseImageUrl}reva-university.png`;
    revaElevenYearsLogoUrl = `${baseImageUrl}reva-eleven-years.png`;
    homeUrl = `${basePath}/`;

}