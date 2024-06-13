import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getJobPostingList from  '@salesforce/apex/ALU_RecordListController.getAlumniActivities';
import USER_ID from "@salesforce/user/Id";
import { loadStyle } from 'lightning/platformResourceLoader';
import FlowScreensCSS from '@salesforce/resourceUrl/FlowScreenCSS';

 


export default class AluJobPostingRecordList extends NavigationMixin(LightningElement) {

    @track JobPostingList;
    @track error;
    @track noRecordsData = false;
   
    @track isAllJobPostingselected = true;
    @track isEnterJobPostingSelected = false;
   
    @track JobPostingRecType = 'Job Posting';
    @track userId = USER_ID;

    connectedCallback() {
      console.log('style-------->',FlowScreensCSS);
 
       loadStyle(this, FlowScreensCSS)
       .then(() => console.log('Files loaded.'))
       .catch(error => console.log("Error " + error.body.message))
 
   }
    
@wire(getJobPostingList , { fileterByRecordType : "$JobPostingRecType"}) 
  wiredCases({ error, data }) {
    console.log('wire status passing ---->'+this.caseStatus);
    if (data) {
      this.JobPostingList = data;
      this.error = undefined;
      if(this.JobPostingList==''){
        this.noRecordsData = true;
      }
    } else if (error) {
      this.error = error;
      this.JobPostingList = undefined;
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



 handleStepClick(event){
  const stepNumber = event.target.dataset.step;
  
  if(stepNumber == 1){
      this.isAllJobPostingselected = true;
      this.isEnterJobPostingSelected = false;
      this.updateStyles(stepNumber);
  } 
  if(stepNumber == 2){
    this.isEnterJobPostingSelected = true;
    this.isAllJobPostingselected = false;
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