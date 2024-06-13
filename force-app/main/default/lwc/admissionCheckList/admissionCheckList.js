import { LightningElement, wire, api } from 'lwc';
import getApplicationCheckListValues from '@salesforce/apex/AdmissionsProcessUtility.getApplicationCheckListValues';



export default class AdmissionCheckList extends LightningElement {
    @api recordId;
    application;
    additionalDocumentsRequired;
    feeStructureDefined
    provAdmissionFee
    concessionStat
    concessionStatus
    sclStatus
    error;
    @wire(getApplicationCheckListValues, { appId: '$recordId' })
    getApplicationCheckListValues({ data, error }) {

        if (data) {
            console.log('data', data);
            this.application = data;
            this.additionalDocumentsRequired = this.application.Additional_Documents_Required__c === true ? true : false;
            this.feeStructureDefined = this.application.Fee_Structure_Defined__c === true ? true : false;
            this.provAdmissionFee = this.application.Provisional_Admission_Fee_Paid__c === true ? true : false;
            this.concessionStat = (this.application.Concession_Status__c === 'Approved' || this.application.Concession_Status__c === 'Not Applicable') ? true : false;
            this.concessionStatus = this.application.Concession_Status__c;
            this.sclStatus = this.application.hed_Scholarship__c ? true : false;
        }
        else {
            console.log('error', error);
            this.error = error;
        }
    }
}