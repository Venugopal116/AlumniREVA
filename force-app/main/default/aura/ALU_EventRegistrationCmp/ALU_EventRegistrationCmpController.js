({
    getEvntActivities : function(component, event, helper)
    {
        helper.getEventActivitesHelper(component, event, helper);
    },
    OnRegistration : function(component, event, helper)
    {
        helper.submitActivitiesHelper(component, event, helper);
        $A.get('e.force:refreshView').fire();
    },
    OnCancel : function(component, event, helper)
    {
        helper.calcleActivitiesHelper(component, event, helper);
    },
    getSelected : function(component,event,helper) 
    { 
        var AluminiId = event.currentTarget.getAttribute("data-Id");   
        //alert('=='+event.currentTarget.getAttribute("data-Id"))
        component.set("v.alumActivityId" , AluminiId);  //Activity Events Id        
        helper.getDocumentData(component,event,helper);
    },
    closeModel: function(component, event, helper) 
    {
        component.set("v.hasModalOpen", false);
        component.set("v.selectedDocumentId" , null);
    }, 
    
})