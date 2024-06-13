import { LightningElement,wire,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getEventRegistrations from  '@salesforce/apex/ALU_RecordListController.getEventRegistrations';
import USER_ID from "@salesforce/user/Id";

export default class AluEventsRegistered extends NavigationMixin(LightningElement) {

    userId = USER_ID;
    @track eventRegistrationsList;
    @track error;
    @track eventsRegistered = true;
    @track noRecordsData = false;

@wire(getEventRegistrations, { userId: '$userId'}) // 
  wiredEventRegistrations({ error, data }) {
    if (data) {
      this.eventRegistrationsList = data;
      if(this.eventRegistrationsList == ''){
        this.noRecordsData = true;
      }
      console.log('this.eventRegistrationsList--->'+JSON.stringify(this.eventRegistrationsList));
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.eventRegistrationsList = undefined;
      console.log('error registrationsData data--->'+this.error);
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



}