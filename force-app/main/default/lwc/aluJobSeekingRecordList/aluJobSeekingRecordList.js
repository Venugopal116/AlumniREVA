import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getJobSeekingList from  '@salesforce/apex/ALU_RecordListController.getAlumniActivities';
import USER_ID from "@salesforce/user/Id";

import { loadStyle } from 'lightning/platformResourceLoader';
import FlowScreensCSS from '@salesforce/resourceUrl/FlowScreenCSS';
 


export default class AluJobSeekingRecordList extends NavigationMixin(LightningElement) {

    @track JobSeekingList;
    @track error;
    @track noRecordsData = false;
   
    @track isAllJobSeekingselected = true;
    @track isEnterJobSeekingSelected = false;
   
    @track JobSeekingRecType = 'Job Seeking';
    @track userId = USER_ID;

    connectedCallback() {
          
      console.log('style-------->',FlowScreensCSS);

      loadStyle(this, FlowScreensCSS)
      .then(() => console.log('Files loaded.'))
      .catch(error => console.log("Error " + error.body.message))

  }
    
@wire(getJobSeekingList , { fileterByRecordType : "$JobSeekingRecType"}) 
  wiredCases({ error, data }) {
    console.log('wire status passing ---->'+this.caseStatus);
    if (data) {
      this.JobSeekingList = data;
      this.error = undefined;
      if(this.JobSeekingList==''){
        this.noRecordsData = true;
      }
    } else if (error) {
      this.error = error;
      this.JobSeekingList = undefined;
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

// get allJobSeekingClass() {
//     return this.isCreateCaseSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
// }

// get enterJobSeekingClass() {
//     return this.isOpenCasesSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
// }



// handleTabClick(event) {
//     const selectedTab = event.target.dataset.tab;

//     this.isAllJobSeekingselected = selectedTab === 'allJobSeeking';
//     this.isEnterJobSeekingSelected = selectedTab === 'enterblog';
  
//  }

 handleStepClick(event){
  const stepNumber = event.target.dataset.step;
  
  if(stepNumber == 1){
      this.isAllJobSeekingselected = true;
      this.isEnterJobSeekingSelected = false;
      this.updateStyles(stepNumber);
  } 
  if(stepNumber == 2){
    this.isEnterJobSeekingSelected = true;
    this.isAllJobSeekingselected = false;
    this.updateStyles(stepNumber);
  }
}

updateStyles(stepNumber){
  const tabs = this.template.querySelectorAll('.tab');
  tabs.forEach(tab => {
      const tabStepNumber = tab.dataset.step;
      console.log(tabStepNumber);
      if(tabStepNumber!=stepNumber){
          tab.style.color = 'black';
          tab.style.backgroundColor = '#FEF3EA';
      }else{
          tab.style.color = 'white';
          tab.style.backgroundColor = '#F57F26';
      }
  })
}

}