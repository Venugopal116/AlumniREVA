({
    getAluActDonation : function(component, event, helper) {
        component.set("v.Spinner",true);
        helper.getAluActivityDonation(component, event, helper);
        
    },
    
    OnDonation : function(component, event, helper) {
        var getAlActId = event.getSource().get("v.value");
        component.set("v.Spinner",true);
        helper.paymentMapHelper(component, event, helper);
        helper.getAlActRecord(component,event,helper);
        component.set("v.openModel", true);
    },
    OnDonateWithoutActivity : function(component, event, helper) {
        component.set("v.Spinner",true);
        helper.paymentMapHelper(component, event, helper);
        helper.onDonationWthoutActivityHelper(component, event, helper);
        component.set("v.openModel", true);
    },
    AfterPaynow : function(component, event, helper)
    {
        component.set("v.ModelSpinner", true);
        var mapBilldesk = '';
        var mapRazorpay = '';
        var mapEasypay = '';
        var mapPaytm = '';
        var paymap = component.get("v.PaymentMap");
        // alert('+++++'+component.get("v.PaymentGateway"));
        for (var key in paymap) 
        {            
            if(paymap[key].key == 'RazorPay'){
                mapRazorpay = paymap[key].key;
            }    
            // if(paymap[key].key == 'PayTM')
            //  mapPaytm = paymap[key].key;
            if(paymap[key].key == 'EazyPay'){
                mapEasypay = paymap[key].key;
            }    
            if(paymap[key].key == 'BillDesk'){
                mapBilldesk = paymap[key].key;                
            }             
        }        
        var rate_value;
        if(mapBilldesk == 'BillDesk')
        {            
            if (document.getElementById('radio-65').checked) {                
                rate_value = document.getElementById('radio-65').value;
                // alert('+++++'+rate_value);
            }
        }
        var EnteredAmount = component.get("v.EnteredAmount");
        var TotalPayamount ;
        if(rate_value == null || rate_value=='' || rate_value =='undefined')
        {
            helper.showToast(component,'dismissible','Failed','Please Select Paymnet Gateway','error');
            component.set("v.ModelSpinner", false);             
        }
        else
        {
            var feepayment = component.get("v.lstStuFeePayment");
            if(feepayment){
                for(var i=0;i<feepayment.length;i++)
                {
                    TotalPayamount = feepayment[i].Amount_Pending__c;
                    if(EnteredAmount >feepayment[i].Amount_Pending__c)
                    {
                        helper.showToast(component,'dismissible','Failed','Please Enter Correct Amount','error'); 
                        component.set("v.ModelSpinner", false); 
                    }
                }
            }    
            if(rate_value == 'RazorPay')
            {
                if(EnteredAmount != null || EnteredAmount != '')
                {                    
                    helper.rezorPayGeneratePaymentLink(component, event, helper,feepayment,EnteredAmount,'single');
                    component.set("v.ModelSpinner", false);
                }
                else
                {
                    helper.rezorPayGeneratePaymentLink(component, event, helper,feepayment,TotalPayamount,'single');
                    component.set("v.ModelSpinner", false);
                }
            }
            if(rate_value == 'BillDesk')
            {
                if(EnteredAmount != null || EnteredAmount != '')
                {                    
                    helper.billDeskGeneratePaymentLink(component, event, helper,EnteredAmount,'single');
                    component.set("v.ModelSpinner", false);
                }
                else
                {      
                    helper.showToast(component,'dismissible','Failed','Please Enter Amount','error');
                    component.set("v.ModelSpinner", false);
                }
            }
        }
    },
    closeMultiModel: function(component, event, helper) 
    {      
        component.set("v.openMultiModel", false);
    },
    
   /* closeModel: function(component, event, helper) 
    {      
        component.set("v.openModel", false);
    },*/
    handleChange: function (component, event, helper) {
        var changeValue = event.getParam("value");
        if(changeValue =='Activity Contribution'){
            component.set("v.Spinner",true);
            component.set("v.ActivityPage",true)
            helper.paymentMapHelper(component, event, helper);
            component.set("v.openModel", false);
            component.set("v.voluntarydonationbtn",false)
            component.set("v.Spinner",false);
        }
        if(changeValue =='Voluntary Contribution'){
            component.set("v.Spinner",true);
            helper.paymentMapHelper(component, event, helper);
            component.set("v.openModel", true);
            component.set("v.ActivityPage",false)
            component.set("v.voluntarydonationbtn",true)
            
            component.set("v.listAluActvitiesDon2",'');
            component.set("v.Spinner",false);
        }
    },
    getSelected : function(component,event,helper) 
    { 
        var Id = event.currentTarget.getAttribute("data-Id");  
        // alert('AluminiId'+Id);
        component.set("v.alumActivityId", Id);  //Activity Events Id   
        helper.getDocumentData(component,event,helper);
    },
    closeModel: function(component, event, helper) 
    {
        component.set("v.openModel", false);
        component.set("v.hasModalOpen", false);
        component.set("v.selectedDocumentId" , null);
       // component.set("v.voluntarydonationbtn",false)
    }, 
})