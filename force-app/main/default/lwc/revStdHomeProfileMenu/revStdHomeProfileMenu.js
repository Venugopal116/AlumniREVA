import { LightningElement, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import USER_ID from '@salesforce/user/Id';
import CONTACT_ID_FIELD from '@salesforce/schema/User.ContactId';
import STUDENTPORTALICONS from '@salesforce/resourceUrl/SR_STUDENTPORTALASSETS';
import getAttendancePercent from '@salesforce/apex/ATT_StudentAttendance_Ctrl.DisplayAttendance';


const contactFields = ['Contact.Name', 'Contact.MailingStreet', 'Contact.MailingCity', 'Contact.MailingState', 'Contact.MailingCountry', 'Contact.MailingPostalCode', 'Contact.hed__Gender__c', 'Contact.SRN_Number__c', 'Contact.MobilePhone', 'Contact.Course__c', 'Contact.Application_Number__c', 'Contact.Father_Name__c', 'Contact.Mother_Name1__c', 'Contact.Nationality__c', 'Contact.Birthdate', 'Contact.Personal_Email__c', 'Contact.Mother_Tongue__c', 'Contact.School_Name__c'];
const DATE_OPTIONS = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
const baseImageUrl = `${STUDENTPORTALICONS}/StudentPortalAssests/Icons/Profile-Menu-Icons/`;

export default class RevStdHomeProfileMenu extends NavigationMixin(LightningElement) {

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

		} else if (error) {
			this.showErrorToast(error.body.message);

		}
	}

	// Retrieve the Contact record based on the ContactId retrieved from the User record
	@wire(getRecord, { recordId: '$userContactId', fields: contactFields })
	wiredContactRecord({ error, data }) {
		if (data) {
			this.contactRecord = data;

		} else if (error) {
			this.showErrorToast(error.body.message);

		}
	}

	get calculatePercentage() {
		if (this.totalClassesCompleted > 0) {
			const percentage = (this.totalClassesAttended / this.totalClassesCompleted) * 100;
			return Math.floor(percentage);
		}
		return 0;
	}
	get determineAttendanceCategory() {
		if (this.totalAttendancePercentage >= 90) {
			return 'Excellent';
		} else if (this.totalAttendancePercentage >= 75) {
			return 'Good';
		} else if (this.totalAttendancePercentage >= 50) {
			return 'Average';
		} else {
			return 'Below Average';
		}
	}

	handleProfileSection() {
		this.getAttendenceData();
		this.showMainMenuSection = false;
		this.showProfileSection = true;

	}
	getAttendenceData() {
		getAttendancePercent()
			.then(data => {
				let classCompleted = 0;
				let classAttended = 0;
				if (data.map_Faculty) {
					Object.keys(data.map_Faculty).forEach(key => {
						const facultyValue = data.map_Faculty[key];
						classCompleted += facultyValue.TotalClassCom || 0;
						classAttended += facultyValue.TotalClassAtt || 0;
					});
				}
				this.totalClassesCompleted = classCompleted;
				this.totalClassesAttended = classAttended;
				this.totalAttendancePercentage = this.calculatePercentage; //getter Method
			})
			.catch(error => {

				this.showErrorToast(error.body.message);
			});
	}
	handleMenuSection() {
		this.showProfileSection = false;
		this.showMainMenuSection = true;
	}
	get strokeOffset() {
		return this.circumference * (1 - (this.totalAttendancePercentage / 100));
	}

	//Getters
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
		return getFieldValue(this.contactRecord, 'Contact.SRN_Number__c') || 'N/A';
	}

	get mobilePhone() {
		return getFieldValue(this.contactRecord, 'Contact.MobilePhone') || 'N/A';
	}

	get course() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Course__c'));
	}
	get applicationNumber() {
		return getFieldValue(this.contactRecord, 'Contact.Application_Number__c') || 'N/A';
	}
	get parentName() {
		const fatherName = getFieldValue(this.contactRecord, 'Contact.Father_Name__c');
		const motherName = getFieldValue(this.contactRecord, 'Contact.Mother_Name1__c');

		// First, check if father's name is present and return it capitalized
		if (fatherName) {
			return this.capitalizeFirstLetterOfEachWord(fatherName);
		}
		// If father's name is not present, check mother's name
		if (motherName) {
			return this.capitalizeFirstLetterOfEachWord(motherName);
		}
		// If neither name is present, return 'N/A'
		return 'N/A';
	}

	get nationality() {
		const nationalityValue = getFieldValue(this.contactRecord, 'Contact.Nationality__c');
		return this.capitalizeFirstLetter(nationalityValue);
	}

	get birthdate() {
		return getFieldValue(this.contactRecord, 'Contact.Birthdate') || 'N/A';
	}
	get age() {
		const birthdate = getFieldValue(this.contactRecord, 'Contact.Birthdate');
		if (birthdate) {
			const today = new Date();
			const birthDate = new Date(birthdate);
			let age = today.getFullYear() - birthDate.getFullYear();
			const m = today.getMonth() - birthDate.getMonth();

			// If the current month is before the birth month or
			// if it's the same month but the current day is before the birth day,
			// then the person hasn't had their birthday yet this year, so subtract one year.
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}

			return age;
		}

		return 'N/A'; // or appropriate default value/message if birthdate is not available
	}

	get personalEmail() {
		const emailValue = getFieldValue(this.contactRecord, 'Contact.Personal_Email__c');
		return emailValue ? emailValue.toLowerCase() : 'N/A';
	}

	get motherTongue() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.Mother_Tongue__c'));
	}
	get schoolName() {
		return this.capitalizeFirstLetterOfEachWord(getFieldValue(this.contactRecord, 'Contact.School_Name__c'));
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