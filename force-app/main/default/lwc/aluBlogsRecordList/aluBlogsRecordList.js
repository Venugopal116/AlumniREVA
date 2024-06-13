import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getBlogsList from  '@salesforce/apex/ALU_RecordListController.getAlumniActivities';
import { loadStyle } from 'lightning/platformResourceLoader';
import FlowScreensCSS from '@salesforce/resourceUrl/FlowScreenCSS';

export default class AluBlogsRecordList extends NavigationMixin(LightningElement) {

    @track blogsList;
    @track error;

    @track noRecordsData = false;
   
    @track isAllBlogselected = true;
    @track isEnterBlogSelected = false;
   
    @track blogsRecType = 'Blogs';
    
    connectedCallback() {
      console.log('style-------->',FlowScreensCSS);
 
       loadStyle(this, FlowScreensCSS)
       .then(() => console.log('Files loaded.'))
       .catch(error => console.log("Error " + error.body.message))
 
   }

@wire(getBlogsList , { fileterByRecordType : "$blogsRecType"}) 
  wiredCases({ error, data }) {
    console.log('wire status passing ---->'+this.caseStatus);
    if (data) {
      this.blogsList = data;
      this.error = undefined;
      if(this.blogsList==''){
        this.noRecordsData = true;
      }
    } else if (error) {
      this.error = error;
      this.blogsList = undefined;
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

// get allBlogsClass() {
//     return this.isCreateCaseSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
// }

// get enterBlogClass() {
//     return this.isOpenCasesSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
// }



// handleTabClick(event) {
//     const selectedTab = event.target.dataset.tab;

//     this.isAllBlogselected = selectedTab === 'allblogs';
//     this.isEnterBlogSelected = selectedTab === 'enterblog';
  
//  }

 handleStepClick(event){
  const stepNumber = event.target.dataset.step;
  
  if(stepNumber == 1){
      this.isAllBlogselected = true;
      this.isEnterBlogSelected = false;
      this.updateStyles(stepNumber);
  } 
  if(stepNumber == 2){
    this.isEnterBlogSelected = true;
    this.isAllBlogselected = false;
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