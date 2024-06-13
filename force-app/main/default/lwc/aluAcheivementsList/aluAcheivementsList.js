import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAcheivementsList from  '@salesforce/apex/ALU_RecordListController.getAlumniAchievements';
import { loadStyle } from 'lightning/platformResourceLoader';
import FlowScreensCSS from '@salesforce/resourceUrl/FlowScreenCSS';

export default class AluAcheivementsList extends NavigationMixin(LightningElement) {

    @track recordsList;
    @track error;
   
    @track isAllAcheivementsSelected = true;
    @track isEnterAcheivementsSelected = false;
   
    @track filter = 'Achievements';
    
  connectedCallback() {
     console.log('style-------->',FlowScreensCSS);

      loadStyle(this, FlowScreensCSS)
      .then(() => console.log('Files loaded.'))
      .catch(error => console.log("Error " + error.body.message))

  }

@wire(getAcheivementsList , { fileterByRecordType : "$filter"}) 
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

// get allAlumniAcheivementsBlogsClass() {
//     return this.isAllAcheivementsSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
// }
// get allAlumniAcheivementsBlogsClass() {
//     return this.isEnterAcheivementsSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
// }


// handleTabClick(event) {
//     const selectedTab = event.target.dataset.tab;

//     this.isAllAcheivementsSelected = selectedTab === 'allAlumniAcheivementsTab';
//     this.isEnterAcheivementsSelected = selectedTab === 'enterYourAhmntsTab';
  
//  }

 
 handleStepClick(event){
  const stepNumber = event.target.dataset.step;
  
  if(stepNumber == 1){
      this.isAllAcheivementsSelected = true;
      this.isEnterAcheivementsSelected = false;
      this.updateStyles(stepNumber);
  } 
  if(stepNumber == 2){
    this.isEnterAcheivementsSelected = true;
    this.isAllAcheivementsSelected = false;
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