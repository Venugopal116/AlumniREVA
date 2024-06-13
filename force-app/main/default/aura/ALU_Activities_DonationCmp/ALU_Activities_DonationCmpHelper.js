({
    getAluActivityDonation : function(component, event, helper) {
        var action = component.get("c.getAluActivitieslist");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log("result "+result)
                console.log("result "+JSON.stringify(result))
                component.set("v.listAluActvitiesDon",result)
                component.set("v.Spinner",false);
            }
            else if (state === "INCOMPLETE") {
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        
        $A.enqueueAction(action);
    },
    
    getAlActRecord : function(component, event, helper) {
        var getAlActId = event.getSource().get("v.value");
        component.set("v.AluactivityId",getAlActId);
        var amountpay = component.get("v.EnteredAmount");
        var action = component.get("c.getAluActivitiySingle");
        action.setParams({ alId : getAlActId});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log("result "+result)
                console.log("result "+JSON.stringify(result))
                component.set("v.listAluActvitiesDon2",result)
                component.set("v.Spinner",false);
            }
            else if (state === "INCOMPLETE") {
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);
    },
    paymentMapHelper :function(component, event, helper) {
        var action = component.get("c.getMapDetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log("result "+result)
                console.log("result "+JSON.stringify(result))
                var mapPayment = [];
                var result = response.getReturnValue().map_PaymentGateway;
                for(var key in result){
                    mapPayment.push({key: key, value: result[key]});
                }    
                component.set("v.PaymentMap",mapPayment)
            }
            else if (state === "INCOMPLETE") {
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);
    },
    onDonationWthoutActivityHelper : function(component, event, helper) {
        component.set("v.Spinner",false);
        component.set("v.listAluActvitiesDon2",'');
    },
    billDeskGeneratePaymentLink : function(component, event, helper,EnteredAmount,type) {
        var getAlActId = component.get("v.listAluActvitiesDon2");
        var action = component.get("c.BillDeskPayGenratePaymentLink");
        var isVolentary = component.get("v.voluntarydonationbtn");
      alert('+++++++'+getAlActId);
      alert('+++++++'+isVolentary);
        if(isVolentary){
            getAlActId = null;
            
        }
      
        action.setParams({ lstActivity : getAlActId,
                          PartialAmount : EnteredAmount, 
                          feeType : type
                         }); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            //alert(state);
            if (state === "SUCCESS") {
               component.set("v.isPayNow",true); 
               if(response.getReturnValue().statusCode == 200){
                   window.open(response.getReturnValue().short_url,"_self");
               }
                else {                        
                    helper.showToast(component,'dismissible','Failed','Payment Link Generation Failed','error');
                    component.set("v.ModelSpinner", false);
                } 
            }
        });
        $A.enqueueAction(action);	        
    },  
    getDocumentData : function(component,event,helper)
    {
        var strId = component.get("v.alumActivityId"); 
      //  alert ("===Ids ==="+strId);
        var action = component.get("c.GetDocument");        
        action.setParams({"alumActivityId": strId});
        action.setCallback(this, function(response){            
            var state = response.getState();
           // alert('Helper' + state);
            if(state == "SUCCESS")
            {      
                if(response.getReturnValue() != undefined)               
                {  
                    var lstRecords = response.getReturnValue();
                    component.set("v.hasModalOpen" , true);
                    component.set("v.ContentWrap",lstRecords);
                }
                else
                {
                    this.showToast(component,'dismissible','Failed',response.getError()[0].message,'error');
                }
            }
            else
            {
                this.showToast(component,'dismissible','Failed',response.getError()[0].message,'error');
            }
        });
        $A.enqueueAction(action);  
    },
    showToast : function(component, mode, title, message, type)
    {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "mode": mode,
            "title": title,
            "message": message,
            "type": type,
            "duration":'2'
        });
        toastEvent.fire();
    }
})