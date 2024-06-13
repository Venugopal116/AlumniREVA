({
	doInit : function(component, event, helper) {
        
		helper.doinithlpr(component,event,helper);       
    },
     handleGenderChange: function(component, event, helper) {
        var selectedValue = event.getSource().get("v.value");     
        component.set("v.genderVAl", selectedValue);
    },
    
    handleBloodGroupChange: function(component, event, helper) {
        var selectedValue = event.getSource().get("v.value");      
        component.set("v.bgVal", selectedValue);
    },
    
    handleMaritalStatusChange: function(component, event, helper) {       
        var selectedValue = event.getSource().get("v.value");       
        component.set("v.marStatus", selectedValue);
    },
    
    submitAlumniRegistration : function(component, event, helper) {
       helper.submitRegistaration(component, event, helper);
    },
    handleCountryCodeChange : function(component, event, helper) {
        var selectedValue = event.getSource().get("v.value");       
    },
    handlePpgramChange :function(component, event, helper) {
        
    }
	
})