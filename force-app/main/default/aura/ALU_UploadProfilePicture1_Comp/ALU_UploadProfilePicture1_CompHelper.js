({
    readFile: function(component, helper, file) {
        if (!file) return;
        if (!file.type.match(/(image.*)/)) {
            return alert('Image file not supported');
        }
        var reader = new FileReader();
        reader.onloadend = function() {
            var dataURL = reader.result;
            console.log(dataURL);
            component.set("v.pictureSrc", dataURL);
            helper.upload(component, file, dataURL.match(/,(.*)$/)[1]);
        };
        reader.readAsDataURL(file);
    },
    
    upload: function(component,event, file, base64Data) {
        component.set("v.Spinner", true);
        var action = component.get("c.saveAttachment"); 
        action.setParams({parentId: component.get("v.ContId"),fileName: component.get("v.fileName"),base64Data: base64Data});
        action.setCallback(this, function(a) 
                           {	
                               var state = a.getState();
                               if(state === "SUCCESS")
                               {
                                   if(a.getReturnValue() != undefined)
                                   {
                                       //this.Upload1(component, event, helper);
                                       this.showToast(component,'dismissible','Success','Profile Picture Uploaded successfully','Success');
                                       component.set("v.Spinner", false);
                                       $A.get('e.force:refreshView').fire();
                                       
                                   }
                                   else
                                   {
                                       component.set("v.Spinner", false);
                                       this.showToast(component,'dismissible','Failed',response.getError()[0].message,'error');
                                   }
                               }
                               else
                               {
                                   component.set("v.Spinner", false);
                                   this.showToast(component,'dismissible','Failed',response.getError()[0].message,'error');
                               }
                               //window.location.reload()
                               let RecrdId=event.getSource().get('v.ContId');        
                               var urlEvent = $A.get("e.force:navigateToURL");
                               urlEvent.setParams({
                                   "url": 'https://reva-university.my.site.com/AlumniPortal/s/digital-card'
                               });
                               urlEvent.fire();
                           }); 
        $A.enqueueAction(action); 
    },
    doRedirectHelper : function (component, event, helper) {
        
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