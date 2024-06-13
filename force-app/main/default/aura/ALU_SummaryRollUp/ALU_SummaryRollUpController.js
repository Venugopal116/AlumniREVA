({
	loadData : function(component, event, helper) {
		helper.loadData_Helper(component, event, helper);
	},

	navigateToCommPage : function(component, event, helper) {  
 
			 event.preventDefault(); 
			 var pageName = event.currentTarget.dataset.pagename;
			 console.log('pageName---->'+pageName); 
			 let navService = component.find( "navService" ); 
			 let pageReference = {  
				 type: "comm__namedPage",  
				 attributes: {  
					 name: pageName
				 },  
				 
			 };  
 
			 navService.navigate(pageReference);  
	   
		 }  
})


