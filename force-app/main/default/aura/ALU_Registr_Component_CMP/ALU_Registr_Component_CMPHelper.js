({
    doinithlpr : function(component,event,helper) {
        
        var action = component.get("c.getPicklistOptions");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result =  response.getReturnValue();
                component.set("v.genderOptions",result.genderOptions);
                component.set("v.bloodGroupOptions",result.bloodGroupOptions);
                component.set("v.maritalStatusOptions",result.maritalStatusOptions);
                component.set("v.countryCodes",result.countryCodesOptions);
                component.set("v.programs",result.programOptions);
                //component.set("v.graduationYears",result.yogOptions);
                component.set("v.selectedCountryCode", 'India (+91)');
                
                 var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                var day = currentDate.getDate().toString().padStart(2, '0');
                var formattedDate = year + "-" + month + "-" + day;
                component.set("v.maxAllowedDate", formattedDate);
                
               var currentYear = new Date().getFullYear();
                var graduationYears = result.yogOptions.filter(function(year) {
                    return year <= currentYear;
                });
                component.set("v.graduationYears", graduationYears);
                
            }
            
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        // console.log("Error message: " + errors[0].message);
                    }
                } else {
                   // console.log("Unknown error");
                }
            }
        });
        
        
        $A.enqueueAction(action);
    },
    submitRegistaration : function(component, event, helper) {
        
        //component.set("v.Spinner", true);
        var errorCount = 0;
        var allReqFields = component.find('field');
        
        if(allReqFields)
        {
            if(allReqFields.length)
            {
                var allValid = allReqFields.reduce(function (validSoFar, inputCmp)
                                                   {
                                                       inputCmp.showHelpMessageIfInvalid();
                                                       return validSoFar && inputCmp.get('v.validity').valid;
                                                   }, true);
                if (!allValid)
                {
                    errorCount++;
                }
            }
            else
            {
                var allValid = allReqFields;
                if (!allValid.get('v.validity').valid)
                {
                    errorCount++;
                }
            }
        }
        if(errorCount > 0)
        {
            //alert('Please Select Mandatory fields..')  
            component.set("v.message", 'Please fill all Mandatory fields..');
            component.set("v.isError", true)
        }
        else{
            
            var name = component.get('v.Name');
            var Email = component.get('v.Email');
            var mobile = phone;
            var DOB = component.get('v.Dob');
            var Gender = component.get('v.genderVal');
            var Bg = component.get('v.bgVal');
            var Yog = component.get('v.selectedGraduationYear');
            var MS = component.get('v.marStatus');
            var SRN = component.get('v.SRNNumber'); 
            var PRG = component.get('v.ProgramVal');
            var countrycode = component.get('v.selectedCountryCode');
            var valueInBracket = countrycode.substring(countrycode.indexOf("(") + 1, countrycode.indexOf(")"))
            var phone = component.get('v.Mobile');
            //var mobile = valueInBracket+phone;
            var mobile = phone;
            
            var action = component.get('c.createAlumniRegistration'); 
            action.setParams({
                Name: name,
                Email: Email,
                Mobile: mobile,
                DOB: DOB,
                Gender: Gender,
                MaritalStatus: MS,
                YearOfGrad: Yog,
                countryCode:countrycode,
                Bg: Bg,
                SRNno:SRN,
                program:PRG
            });
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log('result '+JSON.stringify(result))
                    if (result.isSuccess) {
                        // Record created successfully
                        component.set("v.message", result.message);
                        
                        //alert(result.message);
                        component.set("v.isError", false);
                        component.set("v.Name", "");
                        component.set("v.Email", "");
                        component.set("v.Mobile", "");
                        component.set("v.Dob", "");
                        component.set("v.marStatus", "");
                        component.set("v.bgVal", "");
                        component.set("v.genderVal", "");
                        component.set("v.selectedGraduationYear", "");
                        component.set("v.SRNNumber", "");
                        component.set("v.ProgramVal", "");
                        component.set("v.formsubimitted",true);
                    } else {
                        // Record creation failed, display error message
                        component.set("v.message", result.message);
                        component.set("v.isError", true);
                        //alert('Error Registarion Could Not Be completed.'+result.message);
                        
                    }
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // Display error message
                            component.set("v.message", errors[0].message);
                            component.set("v.isError", true);
                            //alert( errors[0].message);
                            
                        }
                    } else {
                        // Display generic error message
                        component.set("v.message", "An unknown error occurred.");
                        component.set("v.isError", true);
                        //alert( 'An unknown error occurred.');
                    }
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    
})