import { LightningElement, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getCurrentUserTasks from '@salesforce/apex/SP_FetchStudentDetailsController.getCurrentUserTasks';
import { NavigationMixin } from 'lightning/navigation';
import STUDENTPORTALICONS from '@salesforce/resourceUrl/SR_STUDENTPORTALASSETS';
import basePath from '@salesforce/community/basePath';
import userId from '@salesforce/user/Id';
import ACCOUNT_ID_FIELD from '@salesforce/schema/User.AccountId';

const baseImageUrl = `${STUDENTPORTALICONS}/StudentPortalAssests/Icons/Header-Icons/`;

export default class RevStdHomeStudentSubHeader extends NavigationMixin(LightningElement) {


    my360ImageUrl = `${baseImageUrl}my-360.png`;
    notificationImageUrl = `${baseImageUrl}notification.png`;
    settingsImageUrl = `${baseImageUrl}settings.png`;
    logOutImageUrl = `${baseImageUrl}logout.png`;
    my360PageUrl = `${basePath}/student360`;


    showSettings = false;
    showNotifications = false;
    showSearch = false;
    currentAccountId;
    settingsMenuItems;
    inputValue = '';
    tasks;





    @wire(getRecord, { recordId: userId, fields: [ACCOUNT_ID_FIELD] })
    wiredUser({ error, data }) {
        if (data) {
            this.currentAccountId = getFieldValue(data, ACCOUNT_ID_FIELD); //Accepts String ,i.e, Field Api Name 
            this.createSettingsMenuItems();

        } else if (error) {
            this.showErrorToast(error.body.message);

        }
    }

    @wire(getCurrentUserTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;


        } else if (error) {

            this.showErrorToast(error.body.message);
        }
    }

    createSettingsMenuItems() {
        this.settingsMenuItems = [
            {
                id: 1,
                name: 'Home',
                url: `${basePath}/`,
                target: '_self'
            },
            {
                id: 2,
                name: 'My Profile',
                url: `${basePath}/profile/${userId}`,
                target: '_self'
            },
            {
                id: 3,
                name: 'My Account',
                url: `${basePath}/account/${this.currentAccountId}`,
                target: '_self'
            }

        ];
    }


    get logOutPageUrl() {
        const sitePrefix = basePath.replace(/\/s$/i, "");
        const studentPortalLoginPageUrl = `${basePath}/login`;
        return `${sitePrefix}/secur/logout.jsp?retUrl=${encodeURIComponent(studentPortalLoginPageUrl)}`;
    }


    toggleSettingsHandler(event) {
        this.showSettings = !this.showSettings;
        if (this.showSettings) {
            this.adjustCaretPosition(event.currentTarget);
        }
        this.showNotifications = false; // Close settings when notifications are toggled
        this.manageListeners(event);

    }

    toggleNotificationHandler(event) {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {

            this.adjustCaretPosition(event.currentTarget);
        }
        this.showSettings = false; // Close settings when notifications are toggled
        this.manageListeners(event);

    }
    adjustCaretPosition(triggerElement) {

        window.requestAnimationFrame(() => {
            const menu = this.template.querySelector('.menu');
            const triggerRect = triggerElement.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            const triggerCenter = triggerRect.left + triggerRect.width / 2;
            const menuLeft = menuRect.left;
            const caretLeft = (triggerCenter - menuLeft) - 7;


            // Now apply the left position to the menu, which will move the ::before pseudo-element
            menu.style.setProperty('--caret-left', `${caretLeft}px`)
        });
    }
    searchDataHandler(event) {
        this.inputValue = event.target.value;

        if (this.inputValue.length >= 3) {
            this.showSearch = true;
        } else {
            this.showSearch = false;
        }
    }
    searchFocusHandler() {
        if (this.inputValue.length >= 3) {
            this.showSearch = true;
        }
    }
    searchBlurHandler() {

        setTimeout(() => {


            this.showSearch = false; // Hide the flyout
        }, 400);
    }
    handleSearchKeyUp(event) {
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.navigateToSearchPage();

        }
    }

    navigateToSearchPage() {
        this.searchBlurHandler();
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: `${basePath}/global-search/${this.inputValue}`
            }
        });

    }
    navigateToNotificationDetailHandler(event) {
        const recId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: `${basePath}/detail/${recId}`
            }
        });

    }




    manageListeners(event) {
        if (this.showSettings || this.showNotifications) {
            // Add an event listener to the document when any menu is open
            window.addEventListener('click', this.handleOutsideClick);
        } else {
            // Remove the event listener from the document when all menus are closed
            window.removeEventListener('click', this.handleOutsideClick);
        }

        // Stop the click from propagating to the document, which would immediately close the menu
        event.stopPropagation();
    }

    handleOutsideClick = (event) => {
        if (!this.template.contains(event.target)) {
            // Close both menus
            this.showSettings = false;
            this.showNotifications = false;

            // Clean up the event listener when both menus are closed
            window.removeEventListener('click', this.handleOutsideClick);
        }
    }

    disconnectedCallback() {
        // Always clean up listeners when the component is destroyed
        window.removeEventListener('click', this.handleOutsideClick);
    }

    //Error Notification
    showErrorToast(errorMessage) {
        const event = new ShowToastEvent({
            title: 'Error',
            message: errorMessage,
            variant: 'error',
            mode: 'dismissable' // or 'pester' or 'sticky'
        });
        this.dispatchEvent(event);
    }

}