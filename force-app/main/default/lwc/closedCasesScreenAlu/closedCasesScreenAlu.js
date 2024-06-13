import { LightningElement,wire,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCaseList from  '@salesforce/apex/ALU_RecordListController.getCaseList';

export default class ClosedCasesScreenAlu extends NavigationMixin(LightningElement) {
    @track caseList;
    @track error;
    @track isClosedCases = true;
    @track noCaseData = false;

    @wire(getCaseList, { caseStatus: "Closed"})
  wiredCases({ error, data }) {
    if (data) {
      this.caseList = data;
      console.log(' closedcase this.caseList---->'+ this.caseList);
      if(this.caseList==''){
        this.noCaseData = true;
      }
      this.error = undefined;
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
}