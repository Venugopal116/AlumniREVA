import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getJobPostingsList from  '@salesforce/apex/ALU_RecordListController.getAlumniActivities';

export default class AluJobPostingsList extends NavigationMixin(LightningElement) {

    @track recordsList;
    @track error;
   
    @track isOpenJobsSelected = true;
    @track isPostJobSelected = false;
   
    @track filter = 'Job Posting';

@wire(getJobPostingsList , { fileterByRecordType : "$filter"}) 
  wiredCases({ error, data }) {
    console.log('wire status passing ---->'+this.filter);
    if (data) {
      this.recordsList = data;
      this.error = undefined;
     // console.log('cases data--->'+JSON.stringify(this.caseList));
    } else if (error) {
      this.error = error;
      this.recordsList = undefined;
      console.log('error cases data--->'+this.error);
    }
  }

  navigateToRecord(event) {
    const recordId = event.currentTarget.dataset.id;
    console.log('recordId--->'+recordId);
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: recordId,
            actionName: 'view'
        }
    });
}

get openJobsClass() {
    return this.isOpenJobsSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
}
get postJobClass() {
    return this.isPostJobSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
}


handleTabClick(event) {
    const selectedTab = event.target.dataset.tab;

    this.isOpenJobsSelected = selectedTab === 'openJobsTab';
    this.isPostJobSelected = selectedTab === 'postAjobTab';
  
 }

}