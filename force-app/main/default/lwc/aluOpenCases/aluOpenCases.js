import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCaseList from  '@salesforce/apex/ALU_RecordListController.getCaseList';

export default class AluOpenCases  extends NavigationMixin(LightningElement) {

    @track caseList;
    @track error;
   
    @track isCreateCaseSelected = true;
    @track isOpenCasesSelected = false;
    @track isClosedCasesSelected = false;
    @track caseStatus = 'New';

@wire(getCaseList, { caseStatus: "$caseStatus"})
  wiredCases({ error, data }) {
    console.log('wire status passing ---->'+this.caseStatus);
    if (data) {
      this.caseList = data;
      this.error = undefined;
     // console.log('cases data--->'+JSON.stringify(this.caseList));
    } else if (error) {
      this.error = error;
      this.caseList = undefined;
      console.log('error cases data--->'+this.error);
    }
  }

  navigateToCaseRecord(event) {
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

get createCaseClass() {
    return this.isCreateCaseSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
}

get openCasesClass() {
    return this.isOpenCasesSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
}

get closedCasesClass() {
    return this.isClosedCasesSelected ? 'slds-tabs_default__item slds-is-active' : 'slds-tabs_default__item';
}

handleTabClick(event) {
    const selectedTab = event.target.dataset.tab;

    this.isCreateCaseSelected = selectedTab === 'createCase';
    this.isOpenCasesSelected = selectedTab === 'openCases';
    this.isClosedCasesSelected = selectedTab === 'closedCases';
    if(selectedTab === 'createCase'){
        console.log(' handle tab click this.caseStatus 1--->'+this.caseStatus);
        
    }else if(selectedTab === 'openCases'){
        this.caseStatus = 'New';
        console.log(' handle tab click this.caseStatus- 2-->'+this.caseStatus);
       // this.getCasesHandler(this.caseStatus);
    }else if(selectedTab === 'closedCases'){
        this.caseStatus = 'Closed';
        console.log(' handle tab click this.caseStatus- 3-->'+this.caseStatus);
       // this.getCasesHandler(this.caseStatus);
    }
}

 
        // getCasesHandler(caseStausValue) {
        //     console.log('case status value--->',caseStausValue);
        //     if (caseStausValue) {
        //         getCaseList({ caseStatus : caseStausValue })
        //            .then(result => {
        //             this.caseList = result;
        //             this.error = undefined;
        //             console.log('imprt cases data--->'+JSON.stringify(this.caseList));
        //             console.log('imprt rslt cases data--->'+JSON.stringify(result));
        //        })
        //            .catch(error => {
        //                // Error logic...
        //                this.error = error;
        //                 this.caseList = undefined;
        //                 console.log('imprt error cases data--->'+this.error);
        //             });
        //     }
        //  }
  


  

    
}