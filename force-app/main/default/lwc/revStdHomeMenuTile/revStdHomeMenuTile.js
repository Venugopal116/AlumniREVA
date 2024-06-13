import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import getStudentFeeRecords from '@salesforce/apex/FEE_StudentPayment_Ctrl.DisplayStudentFeeRecords';
import getMentorMenteeDetails from '@salesforce/apex/SP_FetchStudentDetailsController.getMenteeLatestCase';
import getSupportRequestDetails from '@salesforce/apex/SP_FetchStudentDetailsController.getSupportRequestLatestCase';
import getStudentPortalTileMenuVisibility from '@salesforce/apex/SP_FetchStudentDetailsController.getStudentPortalTileMenuVisibility';
import getNextExamDates from '@salesforce/apex/SP_FetchStudentDetailsController.getNextExamDates';
import getPlacementSummaryDetails from '@salesforce/apex/RPL_StudentRegisterDriveController.getPlacementSummaryDetails';

import STUDENTPORTALICONS from '@salesforce/resourceUrl/SR_STUDENTPORTALASSETS';


const baseImageUrl = `${STUDENTPORTALICONS}/StudentPortalAssests/Icons/Tile-Menu-Icons/`;


export default class RevStdHomeMenuTile extends NavigationMixin(LightningElement) {


    tileVisibility;
    @track menuList = [
        {
            Id: 'FeesAndPayments',
            isVisible: false,  //Default Visible
            headingName: 'FEES & PAYMENTS',

            url: `${basePath}/student-fee`,
            imageUrl: `${baseImageUrl}fees-payments.png`,
            body: {
                item1: {
                    headingText: 'Total Amount',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'Total Paid Amount',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Total Pending Amount',
                    headingValue: 'N/A'
                },
            }

        },
        {
            Id: 'MentorOrMentee',
            isVisible: false,  //Default Visible
            headingName: 'MENTOR-MENTEE',
            imageUrl: `${baseImageUrl}mentor-mentee.png`,
            url: '',
            body: {
                item1: {
                    headingText: 'Subject',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'Mentor Name',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Mentor Mobile',
                    headingValue: 'N/A'
                },
            }

        },
        {
            Id: 'SupportRequest',
            isVisible: false,  //Default Visible
            headingName: 'SUPPORT REQUEST',

            url: `${basePath}/support-request-page`,
            imageUrl: `${baseImageUrl}support-request.png`,
            body: {
                item1: {
                    headingText: 'Support Id',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'Support Category',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Request Type',
                    headingValue: 'N/A'
                },
            }

        },
        {
            Id: 'TimeTable',
            isVisible: false,  //Default Visible
            headingName: 'TIME TABLE',
            url: `${basePath}/my-time-table`,
            imageUrl: `${baseImageUrl}time-table.png`,
            body: {
                item1: {
                    headingText: 'IA-1 Date',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'IA-2 Date',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Final Exam Date',
                    headingValue: 'N/A'
                },
            }

        },
        {
            Id: 'Placement',
            isVisible: false,  //Default Visible
            headingName: 'PLACEMENT',
            url: `${basePath}/placement`,
            imageUrl: `${baseImageUrl}placement.png`,
            body: {
                item1: {
                    headingText: 'Upcoming Drive',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'Eligible Drives',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Offer Count',
                    headingValue: 'N/A'
                },

            }

        },
        {
            Id: 'Examination',
            isVisible: false,  //Default Visible
            headingName: 'EXAMINATION',
            url: `${basePath}/examination`,
            imageUrl: `${baseImageUrl}examination.png`,
            body: {
                item1: {
                    headingText: 'Examination H1',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'Examination H2',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Examination H3',
                    headingValue: 'N/A'
                },
            }

        },
        {
            Id: 'Assessment',
            isVisible: false,  //Default Visible
            headingName: 'ASSESSMENT',
            url: `${basePath}/assessment`,
            imageUrl: `${baseImageUrl}assesment.png`,
            body: {
                item1: {
                    headingText: 'Assessment H1',
                    headingValue: 'N/A'
                },
                item2: {
                    headingText: 'Assessment H2',
                    headingValue: 'N/A'
                },
                item3: {
                    headingText: 'Assessment H3',
                    headingValue: 'N/A'
                },
            }

        },

    ];

    @wire(getStudentPortalTileMenuVisibility)
    WiredTileVisiblity({ error, data }) {
        if (error) {
            this.showErrorToast(error.body.message);

        } else if (data) {

            this.tileVisibility = data;

            //set the visibility for all tiles based on the data from the wire service
            this.menuList.forEach(tile => {
                tile.isVisible = !!this.tileVisibility[tile.Id]; // Convert to boolean for safety
            });


            const visibleTiles = this.menuList.filter(tile => tile.isVisible);

            // If more than four tiles are visible, limit the visibility to the first four
            if (visibleTiles.length > 4) {

                const firstFourVisibleTiles = visibleTiles.slice(0, 4);

                // Set isVisible to false for all tiles, then set to true for the first four visible
                this.menuList = this.menuList.map(tile => ({
                    ...tile,
                    isVisible: firstFourVisibleTiles.includes(tile)
                }));

            }

            this.fetchDataForVisibleTiles();
        }
    }

    fetchDataForVisibleTiles() {
        // Fetch data for Fees & Payments if visible
        if (this.menuList[0].isVisible) {
            getStudentFeeRecords()
                .then(data => {
                    // Set the data for Fees & Payments tile
                    if (data) {
                        this.menuList[0].body.item1.headingValue = this.formatCurrency(data.TotalAmount);
                        this.menuList[0].body.item2.headingValue = this.formatCurrency(data.TotalPaidAmount);
                        this.menuList[0].body.item3.headingValue = this.formatCurrency(data.TotalPendingAmount);

                    }
                })
                .catch(error => {
                    this.showErrorToast(error.body.message);
                });
        }

        // Fetch data for Mentor or Mentee if visible
        if (this.menuList[1].isVisible) {
            getMentorMenteeDetails()
                .then(data => {
                    // Set the data for Mentor or Mentee tile
                    if (data) {
                        this.menuList[1].url = data.Id ? `${basePath}/case/${data.Id}` : '';
                        this.menuList[1].body.item1.headingValue = data.Subject ? data.Subject : 'N/A';
                        this.menuList[1].body.item2.headingValue = data.Mentor_Name__c ? data.Mentor_Name__c : 'N/A';
                        this.menuList[1].body.item3.headingValue = data.Mentor_Mobile__c ? data.Mentor_Mobile__c : 'N/A';

                    }

                })
                .catch(error => {
                    this.showErrorToast(error.body.message);
                });
        }

        // Fetch data for Support Request if visible
        if (this.menuList[2].isVisible) {
            getSupportRequestDetails()
                .then(data => {
                    // Set the data for Support Request tile
                    if (data) {
                        this.menuList[2].url = data.Id ? `${basePath}/case/${data.Id}` : '';
                        this.menuList[2].body.item1.headingValue = data.CaseNumber ? data.CaseNumber : 'N/A';
                        this.menuList[2].body.item2.headingValue = data.Category__c ? data.Category__c : 'N/A';
                        this.menuList[2].body.item3.headingValue = data.Case_Status__c ? data.Case_Status__c : 'N/A';

                    }
                })
                .catch(error => {
                    this.showErrorToast(error.body.message);
                });
        }

        // Fetch data for Time Table if visible
        if (this.menuList[3].isVisible) {
            getNextExamDates()
                .then(data => {
                    // Set the data for Time Table tile
                    if (data) {
                        this.menuList[3].body.item1.headingValue = data.IA_1_Start_date__c ? data.IA_1_Start_date__c : 'N/A';
                        this.menuList[3].body.item2.headingValue = data.IA_2_Start_date__c ? data.IA_2_Start_date__c : 'N/A';
                        this.menuList[3].body.item3.headingValue = data.Exam_Start_Date__c ? data.Exam_Start_Date__c : 'N/A';

                    }

                })
                .catch(error => {
                    //this.showErrorToast(error.body.message);
                });
        }

        // Fetch data for Placement  if visible
        if (this.menuList[4].isVisible) {

            getPlacementSummaryDetails()
                .then(data => {

                    if (data) {

                        this.menuList[4].body.item1.headingValue = data.upcomingDriveDate;
                        this.menuList[4].body.item2.headingValue = data.totalDrives;
                        this.menuList[4].body.item3.headingValue = data.offerCount;

                    }

                })
                .catch(error => {

                    this.showErrorToast(error.body.message);
                });
        }
    }

    // Helper method to format the currency
    formatCurrency(value) {
        if (value !== null && value !== undefined) {
            // Formatter for Indian Rupee currency
            const formatter = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2
            });
            return formatter.format(value);
        } else {
            return 'N/A';
        }
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