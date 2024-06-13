import { LightningElement } from 'lwc';
import PersonIconAlumniRegistration from '@salesforce/resourceUrl/PersonIconAlumniRegistration';
import FORM_FACTOR from '@salesforce/client/formFactor';
export default class AlumniRegistrationUpdated extends LightningElement {

    image = PersonIconAlumniRegistration;
    desktopCheck;
    mobileCheck;

    connectedCallback(){
        console.log('FormFactor: '+FORM_FACTOR)
        if (FORM_FACTOR === 'Large') {
            this.desktopCheck = true
        }
        if(FORM_FACTOR === 'Small'){
            this.mobileCheck = true
        }
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }

}