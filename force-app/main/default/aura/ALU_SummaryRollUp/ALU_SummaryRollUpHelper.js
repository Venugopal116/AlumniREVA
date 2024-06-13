({
	loadData_Helper: function(component,event,helper) {
        console.log('i am inside helper');
        var action=component.get('c.getMethod1') ;
		 action.setCallback(this, function(response) {
        //store state of response
        var state = response.getState();
             console.log('state==>'+state);
        if (state === "SUCCESS") {
          //set response value in wrapperList attribute on component.
          component.set('v.wrapperList', response.getReturnValue());
        }
      });
      $A.enqueueAction(action);
	},
})

