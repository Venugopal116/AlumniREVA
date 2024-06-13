({
    getEventActivitesHelper : function(component, event, helper) 
    {
        var action = component.get("c.getEventDetails");
        //component.set("v.Spinner",true);
        action.setCallback(this,function(response) 
                           {
                               var State = response.getState();
                               console.log('State*********',State);
                               if(State === "SUCCESS")
                               {
                                   if(response.getReturnValue() != undefined)
                                   { 
                                       var resultData = response.getReturnValue();
                                       component.set("v.listEventActvities", resultData); 
                                       //alert(JSON.stringify(resultData));
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
    submitActivitiesHelper : function(component, event, helper)
    {
        component.set("v.disableActivity",false);
        var getEmp = event.getSource().get("v.value");
        var action = component.get("c.sibmitedRegistration");
        action.setParams({"str_RegtrId": getEmp}); 
        action.setCallback(this, function(response) 
                           {	
                               var state = response.getState();
                               if(state === "SUCCESS")
                               {
                                   if(response.getReturnValue() != undefined)
                                   {
                                       if(response.getReturnValue().strMsg === 'Success')
                                       {
                                           this.getEventActivitesHelper(component, event, helper);
                                           this.showToast(component,'dismissible','Success','successfully registered for the event','Success');
                                           $A.get('e.force:refreshView').fire();
                                       }
                                       else
                                       {
                                           this.showToast(component,'dismissible','Failed',response.getReturnValue().strMsg,'error');
                                       }
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
    calcleActivitiesHelper : function(component, event, helper)
    {
        component.set("v.disableActivity",true);
        var getEmp = event.getSource().get("v.value");
        var action = component.get("c.cancleRegistration");
        action.setParams({"str_RegtrId": getEmp}); 
        action.setCallback(this, function(response) 
                           {	
                               var state = response.getState();
                               if(state === "SUCCESS")
                               {
                                   if(response.getReturnValue() != undefined)
                                   {
                                       if(response.getReturnValue().strMsg === 'Success')
                                       {
                                           this.getEventActivitesHelper(component, event, helper);
                                           this.showToast(component,'dismissible','Success','Registration for the event is cancelled','Success');
                                           $A.get('e.force:refreshView').fire();
                                       }
                                       else
                                       {
                                           this.showToast(component,'dismissible','Failed',response.getReturnValue().strMsg,'error');
                                       }
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
    getDocumentData : function(component,event,helper)
    {
        var strId = component.get("v.alumActivityId");        
        var action = component.get("c.GetDocument");        
        action.setParams({"alumActivityId": strId});         
        action.setCallback(this, function(response){            
            var state = response.getState();
            //alert('Helper' + state);
            if(state == "SUCCESS")
            {                   
                if(response.getReturnValue() != undefined)
                {  
                    var lstRecords = response.getReturnValue();
                    component.set("v.ContentWrap",lstRecords);
                    component.set("v.hasModalOpen" , true);
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
            "duration":'0.5'
        });
        toastEvent.fire();
    },
})