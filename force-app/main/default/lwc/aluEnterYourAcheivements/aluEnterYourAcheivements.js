import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from "@salesforce/user/Id";
import createAchievements from  '@salesforce/apex/ALU_RecordListController.createAchievements';

export default class AluEnterYourAcheivements extends LightningElement {

@track userId = USER_ID;
@track achievement = '';
@track dateVal = '';   
@track organization = '';
@track designation = '';
@track image;
@track description;
@track file;

@track isSaveBtnDisabled = true;


acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg'];

// handleInputChange(event) {
//     const fieldName = event.target.name;
//     console.log('fieldName:--->1', fieldName);
//     this[fieldName] = event.target.value;
//     console.log('fieldName:--->2', fieldName);
// }

handleAchievement(event){
    this.achievement = event.target.value;
    console.log('this.achievement----->'+this.achievement);
}
handleDateChange(event){
    this.dateVal = event.target.value;
    console.log('this.date----->'+this.dateVal);
}
handleOrganizationChange(event){
    this.organization = event.target.value;
    console.log('this.organization----->'+this.organization);
}
handleDesignationChange(event){
    this.designation = event.target.value;
    console.log('this.designation----->'+this.designation);
}
handleImageChange(event){
    this.image = event.target.value;
    console.log('this.image----->'+this.image);
}
handleDescriptionChange(event){
    this.description = event.target.value;
    console.log('this.description----->'+this.description);
}

handleUploadFinished(event) {
    this.file = event.detail.files[0].documentId;
    console.log('file uploaded--->1', this.file);
    if(this.file){
        this.isSaveBtnDisabled = false;
    }
}

handleSave() {
    const fields = {
        userId : this.userId,
        achievement: this.achievement,
        dateVal: this.dateVal,
        organization : this.organization,
        designation : this.designation,
        image : this.image,
        description: this.description,
        file: this.file,
    };
    console.log('fields obj--->', fields);

        createAchievements({ achmntDetails: fields })
                .then(result => {
                    // Success logic...
                    console.log('result-->'+result);

                    if(result){
                        this.isSaveBtnDisabled = true;
                        this.ShowToast('Success', 'Record Created SuccessFully', 'success', 'dismissable');
                      //  this.clearFields();   
                        
                    }
                })
                .catch(error => {
                    // Error logic...
                    console.log('Error-->'+Error);
                    this.ShowToast('Error', 'Error While Creating Record', 'error', 'dismissable');
                    this.isSaveBtnDisabled = false;

                });
        
        }

        ShowToast(title, message, variant, mode){
            const evt = new ShowToastEvent({
                    title: title,
                    message:message,
                    variant: variant,
                    mode: mode
                });
                this.dispatchEvent(evt);
            }

        clearFields(){
             // Reset all fields after successful save
             this.userId = '';
             this.achievement = '';
             this.dateVal = null; // Assuming dateVal is a Date field
             this.organization = '';
             this.designation = '';
             this.image = '';
             this.description = '';
             this.file = null; // Assuming file is an object or a string
        }
}