import { LightningElement, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import USER_ID from '@salesforce/user/Id';
import CONTACT_ID_FIELD from '@salesforce/schema/User.ContactId';
import STUDENTPORTALICONS from '@salesforce/resourceUrl/SR_STUDENTPORTALASSETS';
import PROFILE_PIC_URL from '@salesforce/schema/User.SmallPhotoUrl';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import getAttendancePercent from '@salesforce/apex/ATT_StudentAttendance_Ctrl.DisplayAttendance';

const contactFields = ['Contact.Name', 'Contact.MailingStreet', 'Contact.MailingCity', 'Contact.MailingState', 'Contact.MailingCountry', 'Contact.MailingPostalCode', 'Contact.hed__Gender__c', 'Contact.SRN_No__c', 'Contact.MobilePhone', 'Contact.Marital_Status__c', 'Contact.Blood_Group__c', 'Contact.Father_Name__c', 'Contact.Mother_Name1__c', 'Contact.Nationality__c', 'Contact.Birthdate', 'Contact.Email', 'Contact.Mother_Tongue__c', 'Contact.Country_Code_Alumni__c','Contact.Year_Of_Graduation__c','Contact.Program__c','Contact.Company__c','Contact.Year_of_Expirence__c','Contact.Owner.SmallPhotoUrl'];
const userFields = ['User.ContactId','User.SmallPhotoUrl'];
const DATE_OPTIONS = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
const baseImageUrl = `${STUDENTPORTALICONS}/StudentPortalAssests/Icons/Profile-Menu-Icons/`;

export default class AluHomeProfileMenu extends NavigationMixin(LightningElement)  {

	@track profilePicUrl;
	@track userData;
	@track userId = USER_ID;
    currentDate;
	showMainMenuSection = true;
	showProfileSection = false;
	circumference = 2 * Math.PI * 15; // 2 * π * radius

	userContactId;
	contactRecord;


	showButtonIconUrl = `${baseImageUrl}show.png`;
	hideButtonIconUrl = `${baseImageUrl}hide.png`;

	@track totalClassesCompleted = 0;
	@track totalClassesAttended = 0;
	@track totalAttendancePercentage;

	connectedCallback() {
		this.currentDate = this.formattedCurrentDate();

	}
	/**
	 * Computes the current date and returns it in a user-friendly format.
	 * @returns {string} Formatted current date.
	 */
	formattedCurrentDate() {
		const now = new Date();
		const parts = new Intl.DateTimeFormat('en-US', DATE_OPTIONS).formatToParts(now);
		const day = parts.find(part => part.type === 'day').value;
		const month = parts.find(part => part.type === 'month').value;
		const year = parts.find(part => part.type === 'year').value;
		const weekday = parts.find(part => part.type === 'weekday').value;

		return `${weekday}, ${day} ${month}, ${year}`;
	}

	
	@wire(getRecord, { recordId: USER_ID, fields: CONTACT_ID_FIELD })
	wiredUser({ error, data }) {
		if (data) {
			this.userContactId = getFieldValue(data, CONTACT_ID_FIELD); //Accepts String ,i.e, Field Api Name 
			console.log('this.userContactId--->'+this.userContactId);
			console.log('this.Useeeer Id--->'+USER_ID);
		} else if (error) {
			this.showErrorToast(error.body.message);

		}
	}
	//get Profile Pic
	@wire(getRecord, { recordId: USER_ID, fields: PROFILE_PIC_URL })
	wiredUserProfilePic({ error, data }) {
		if (data) {
			this.profilePicUrl = getFieldValue(data, PROFILE_PIC_URL); //Accepts String ,i.e, Field Api Name 
			console.log('this.profilePicUrl---->'+this.profilePicUrl);

		} else if (error) {
			this.showErrorToast(error.body.message);
			console.log('this.profilePicUrl error---->'+error);
		}
	}

	// Retrieve the Contact record based on the ContactId retrieved from the User record
	@wire(getRecord, { recordId: '$userContactId', fields: contactFields })
	wiredContactRecord({ error, data }) {
		if (data) {
			this.contactRecord = data;
            console.log('this.contactRecord--->'+JSON.stringify(this.contactRecord));

		} else if (error) {
			this.showErrorToast(error.body.message);

		}
	}

	

	// get calculatePercentage() {
	// 	if (this.totalClassesCompleted > 0) {
	// 		const percentage = (this.totalClassesAttended / this.totalClassesCompleted) * 100;
	// 		return Math.floor(percentage);
	// 	}
	// 	return 0;
	// }
	// get determineAttendanceCategory() {
	// 	if (this.totalAttendancePercentage >= 90) {
	// 		return 'Excellent';
	// 	} else if (this.totalAttendancePercentage >= 75) {
	// 		return 'Good';
	// 	} else if (this.totalAttendancePercentage >= 50) {
	// 		return 'Average';
	// 	} else {
	// 		return 'Below Average';
	// 	}
	// }

	handleProfileSection() {
		//this.getAttendenceData();
		console.log('1 handle profile section invoked on click');
		this.showMainMenuSection = false;
		this.showProfileSection = true;
		console.log('2 handle profile section invoked on click---->'+this.showProfileSection);

	}
	// getAttendenceData() {
	// 	getAttendancePercent()
	// 		.then(data => {
	// 			let classCompleted = 0;
	// 			let classAttended = 0;
	// 			if (data.map_Faculty) {
	// 				Object.keys(data.map_Faculty).forEach(key => {
	// 					const facultyValue = data.map_Faculty[key];
	// 					classCompleted += facultyValue.TotalClassCom || 0;
	// 					classAttended += facultyValue.TotalClassAtt || 0;
	// 				});
	// 			}
	// 			this.totalClassesCompleted = classCompleted;
	// 			this.totalClassesAttended = classAttended;
	// 			this.totalAttendancePercentage = this.calculatePercentage; //getter Method
	// 		})
	// 		.catch(error => {

	// 			this.showErrorToast(error.body.message);
	// 		});
	// }
	handleMenuSection() {
		this.showProfileSection = false;
		this.showMainMenuSection = true;
	}
	get strokeOffset() {
		return this.circumference * (1 - (this.totalAttendancePercentage / 100));
	}

	//Getters

	get profilePictureUrl(){
		return (getFieldValue(this.contactRecord, 'Contact.Owner.SmallPhotoUrl'));
	}
	
	get userIconUrl() {
		const genderValue = getFieldValue(this.contactRecord, 'Contact.hed__Gender__c');
		if (genderValue && genderValue.toLowerCase() === 'male') {
			return `${baseImageUrl}male.png`;

		}
		return `${baseImageUrl}female.png`;

	}
	get name() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Name'));
	}

	get mailingStreet() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.MailingStreet'));
	}

	get mailingCity() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.MailingCity'));
	}

	get mailingState() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.MailingState'));
	}

	get mailingCountry() {
		const countryValue = getFieldValue(this.contactRecord, 'Contact.MailingCountry');
		return this.capitalizeFirstLetter(countryValue);
	}

	get mailingPostalCode() {
		return getFieldValue(this.contactRecord, 'Contact.MailingPostalCode') || 'N/A';
	}

	get gender() {
		const genderValue = getFieldValue(this.contactRecord, 'Contact.hed__Gender__c');
		return this.capitalizeFirstLetter(genderValue);
	}

	get srnNumber() {
		return getFieldValue(this.contactRecord, 'Contact.SRN_No__c') || 'N/A';
	}

	get mobilePhone() {
		return getFieldValue(this.contactRecord, 'Contact.MobilePhone') || 'N/A';
	}

	get maritalStatus() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Marital_Status__c'));
	}
	get bloodGroup() {
		return getFieldValue(this.contactRecord, 'Contact.Blood_Group__c') || 'N/A';
	}
	// get parentName() {
	// 	const fatherName = getFieldValue(this.contactRecord, 'Contact.Father_Name__c');
	// 	const motherName = getFieldValue(this.contactRecord, 'Contact.Mother_Name1__c');

	// 	// First, check if father's name is present and return it capitalized
	// 	if (fatherName) {
	// 		return this.capitalizeFirstLetterOfEachWord(fatherName);
	// 	}
	// 	// If father's name is not present, check mother's name
	// 	if (motherName) {
	// 		return this.capitalizeFirstLetterOfEachWord(motherName);
	// 	}
	// 	// If neither name is present, return 'N/A'
	// 	return 'N/A';
	// }

	// get nationality() {
	// 	const nationalityValue = getFieldValue(this.contactRecord, 'Contact.Nationality__c');
	// 	return this.capitalizeFirstLetter(nationalityValue);
	// }
	get graduationYear() {
		const graduationYear = getFieldValue(this.contactRecord, 'Contact.Year_Of_Graduation__c');
		return this.capitalizeFirstLetter(graduationYear);
	}
	get program() {
		const programValue = getFieldValue(this.contactRecord, 'Contact.Program__c');
		return this.capitalizeFirstLetter(programValue);
	}

	get birthdate() {
		return getFieldValue(this.contactRecord, 'Contact.Birthdate') || 'N/A';
	}
	// get age() {
	// 	const birthdate = getFieldValue(this.contactRecord, 'Contact.Birthdate');
	// 	if (birthdate) {
	// 		const today = new Date();
	// 		const birthDate = new Date(birthdate);
	// 		let age = today.getFullYear() - birthDate.getFullYear();
	// 		const m = today.getMonth() - birthDate.getMonth();

	// 		// If the current month is before the birth month or
	// 		// if it's the same month but the current day is before the birth day,
	// 		// then the person hasn't had their birthday yet this year, so subtract one year.
	// 		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	// 			age--;
	// 		}

	// 		return age;
	// 	}

	// 	return 'N/A'; // or appropriate default value/message if birthdate is not available
	// }

	get company() {
		const company = getFieldValue(this.contactRecord, 'Contact.Company__c');
		return company ? company.toLowerCase() : 'N/A';
	}

	get personalEmail() {
		const emailValue = getFieldValue(this.contactRecord, 'Contact.Email');
		return emailValue ? emailValue.toLowerCase() : 'N/A';
	}

	// get motherTongue() {
	// 	return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Mother_Tongue__c'));
	// }
	get experience() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Year_of_Expirence__c'));
	}
	get countryCode() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Country_Code_Alumni__c'));
	}


	// Helper method to capitalize the first letter of each word in a string
	capitalizeFirstLetterOfEachWord(value) {
		// Check if the value is null or undefined, return 'N/A'
		if (value === null || value === undefined) {
			return 'N/A';
		}

		const stringValue = typeof value === 'string' ? value : String(value);
		return stringValue
			.split(' ')
			.map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
			.join(' ');
	}
	// Helper method to capitalize the first letter of a value and ensure the rest are lowercase
	capitalizeFirstLetter(value) {
		// If the value is null or undefined, return 'N/A'
		if (value === null || value === undefined) {
			return 'N/A';
		}
		const stringValue = typeof value === 'string' ? value : String(value);
		return stringValue.charAt(0).toUpperCase() + stringValue.slice(1).toLowerCase();
	}


	//Error Notification
	showErrorToast(errorMessage) {
		const event = new ShowToastEvent({
			title: 'Error',
			message: errorMessage,
			variant: 'error',
			mode: 'dismissable'
		});
		this.dispatchEvent(event);
	}
}