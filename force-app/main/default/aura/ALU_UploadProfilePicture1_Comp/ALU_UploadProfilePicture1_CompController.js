({  
    // Load current profile picture
    onInit: function(component) {
        var action = component.get("c.getProfilePicture"); 
        action.setCallback(this, function(a) {
            var pictureSrc1 = $A.get('$Resource.ProfileLogo');
            component.set('v.pictureSrc', pictureSrc1);
            component.set("v.ContId",a.getReturnValue().ConId);
        });
        $A.enqueueAction(action); 
    },
    
    /* onDragOver: function(component, event) {
        event.preventDefault();
    },

    onDrop: function(component, event, helper) {
		event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        var files = event.dataTransfer.files;
        if (files.length>1) {
            return alert("You can only upload one profile picture");
        }
        helper.readFile(component, helper, files[0]);
	}*/
    handleFilesChange : function(component, event, helper) 
    {
        var fileName = 'No File Selected';
        if (event.getSource().get("v.files").length > 0)
        {
            fileName = event.getSource().get("v.files")[0]['name'];
        }
        component.set("v.fileName", fileName);
        
        var files = component.find('FileInput').get("v.files");
        if(files && files.length > 0)
        {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = $A.getCallback(function() {
                var dataURL = reader.result;
                component.set("v.pictureSrc", dataURL);
            });
            reader.readAsDataURL(file);
        }
        
    },
    Upload1 : function(component, event, helper)
    {
        var files = component.find('FileInput').get("v.files");
        if(files && files.length > 0)
        {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = $A.getCallback(function() {
                var dataURL = reader.result;
                component.set("v.pictureSrc", dataURL);
                var base64 = 'base64,';
                var dataStart = dataURL.indexOf(base64) + base64.length;
                dataURL = dataURL.substring(dataStart);
                helper.upload(component,event,  file,  dataURL);
            });
            reader.readAsDataURL(file);
        }
        
    },
    doRedirect: function(component, event, helper) 
    {
        helper.doRedirectHelper(component, event, helper)      
    },
    
})