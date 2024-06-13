import { LightningElement, api,wire,track } from 'lwc';
import getAlumniConversations from "@salesforce/apex/AlumniConversationsController.getAlumniConversations";

export default class AluCarousalChildCmp extends LightningElement {
   
    @api autoScroll = false;
    @api customHeight = '';
    @api customWidth = '100%';
    @api hideNavigationButtons = false;
    @api hideNavigationDots = false;
    @api hideSlideNumber = false;
    @api hideSlideText = false;
    @api scrollDuration = 3000;
   
    @track slides = [];
    slideIndex = 1;
    timer;

    alumni_Conversations = [];
    error;  

  @wire(getAlumniConversations)
  wiredAlumniConversations({ error, data }) {
    if (data) {
      this.alumni_Conversations = data;
     // this.slidesData();
     this.alumni_Conversations.forEach(element => {
        let value = {
      
           "Alumni_Message__c":  element.Alumni_Message__c,
           "Alumni_Name__c": element.Alumni_Name__c,
           "Degree_Stream__c": element.Degree_Stream__c,
           "Year__c": element.Year__c,
           }
           this.slides.push(value);
    });

   console.log('get this.slidesDatachild 2 prepared ----->'+JSON.stringify(this.slides));
   
   this.slides =  this.slides.map((slide, i) => {
    if (i === 0) {
        return {
            ...slide,
            index: i + 1,
            slideClass: 'fade slds-show',
            dotClass: 'dot active'
        };
    }
    return {
        ...slide,
        index: i + 1,
        slideClass: 'fade slds-hide',
        dotClass: 'dot'
    };
});
console.log('@@@@ final listdata ----->'+JSON.stringify(this.slides));
      this.error = undefined;
      console.log('## wire this.slides childdd the convo data-->'+ JSON.stringify(this.alumni_Conversations ));
    } else if (error) {
      this.error = error;
      this.alumni_Conversations = undefined;
      console.log('##the this.slides childdd convo Errorrr-->'+JSON.stringify(this.error ) );
    }
  }


    get maxWidth() {
        return `width: ${this.customWidth}`;
    }
    get maxHeight() {
        return `height: ${this.customHeight}; width:100%`;
    }
   
    @api
    get slidesData() {
        console.log('this.slidesData cjild 1 ----->'+this.slides);
        return this.slides;
    }

    connectedCallback() {
        if (this.autoScroll) {
            this.timer = window.setInterval(() => {
                this.handleSlideSelection(this.slideIndex + 1);
            }, Number(this.scrollDuration));
        }
    }
    handleMouseOver() {
        if (this.autoScroll) {
            window.clearInterval(this.timer);
        }
    }
    handleMouseOut() {
        if (this.autoScroll) {
            this.timer = window.setInterval(() => {
                this.handleSlideSelection(this.slideIndex + 1);
            }, Number(this.scrollDuration));
        }
    }
    disconnectedCallback() {
        if (this.autoScroll) {
            window.clearInterval(this.timer);
        }
    }
    showSlide(event) {
        const slideIndex = Number(event.target.dataset.id);
        this.handleSlideSelection(slideIndex);
    }
    slideBackward() {
        const slideIndex = this.slideIndex - 1;
        this.handleSlideSelection(slideIndex);
    }
    slideForward() {
        const slideIndex = this.slideIndex + 1;
        this.handleSlideSelection(slideIndex);
    }
    handleSlideSelection(index) {
        if (index > this.slides.length) {
            this.slideIndex = 1;
        } else if (index < 1) {
            this.slideIndex = this.slides.length;
        } else {
            this.slideIndex = index;
        }
        this.slides = this.slides.map((slide) => {
            if (this.slideIndex === slide.index) {
                return {
                    ...slide,
                    slideClass: 'fade slds-show',
                    dotClass: 'dot active'
                };
            }
            return {
                ...slide,
                slideClass: 'fade slds-hide',
                dotClass: 'dot'
            };
        });
    } 
}