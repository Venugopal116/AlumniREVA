({
    doInitHelper: function (component, event, helper) {
        component.set("v.Spinner", true);
        let action = component.get('c.fetchSubCatDetails');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.map_CaseManagement', response.getReturnValue());
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },
    RecTypeHelper: function (component, event, helper) {
        component.set("v.Spinner", true);
        let action = component.get('c.DisplayRecType');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                console.log('response---->' + response.getReturnValue());
                if (response.getReturnValue() != null) {
                    component.set('v.caseRecTypeID', response.getReturnValue().split('=>')[0]);
                    component.set("v.filerequired", response.getReturnValue().split('=>')[1]);
                }
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },
    onSubCatChangeHelper: function (component, event, helper) {
        var subCatvalue = event.getSource().get("v.value");
        var map_case = component.get('v.map_CaseManagement');
        if (map_case[subCatvalue]) {
            component.set("v.fileVisible", true);
            component.set("v.Remarks", map_case[subCatvalue].Remarks__c);
            component.set("v.docRequired", map_case[subCatvalue].Document_Required__c);
        }
        else {
            component.set("v.fileVisible", false);
        }
    },
    saveCaseHelper: function (component, event, helper) {
        component.set("v.Spinner", true);
        component.set("v.buttonDisable", true);
        var map_case = component.get('v.map_CaseManagement');
        var Case = component.get('v.objCase');
        var files = component.find('FileInput').get("v.files");
        if (Case.Category__c == '' || Case.Category__c == undefined) {
            this.showToast(component, 'dismissible', 'Failed', 'Category Should Not Be Empty', 'error');
            component.set("v.Spinner", false);
            component.set("v.buttonDisable", false);
        }
        else if (Case.Sub_Category__c == '' || Case.Sub_Category__c == undefined) {
            this.showToast(component, 'dismissible', 'Failed', 'Sub Category Should Not Be Empty', 'error');
            component.set("v.Spinner", false);
            component.set("v.buttonDisable", false);
        }
        else if (Case.Subject == '' || Case.Subject == undefined) {
            this.showToast(component, 'dismissible', 'Failed', 'Subject Should Not Be Empty', 'error');
            component.set("v.Spinner", false);
            component.set("v.buttonDisable", false);
        }
        else if (Case.Description == '' || Case.Description == undefined) {
            this.showToast(component, 'dismissible', 'Failed', 'Description Should Not Be Empty', 'error');
            component.set("v.Spinner", false);
            component.set("v.buttonDisable", false);
        }
        else if (Case.Case_Status__c == '' || Case.Case_Status__c == undefined) {
            this.showToast(component, 'dismissible', 'Failed', 'Case Status Should Not Be Empty', 'error');
            component.set("v.Spinner", false);
            component.set("v.buttonDisable", false);
        }
        else if ((Case.Old_Case_Number__c == '' || Case.Old_Case_Number__c == undefined) && Case.Case_Status__c == 'Reopened') {
            this.showToast(component, 'dismissible', 'Failed', 'Old Case Number Should Not Be Empty', 'error');
            component.set("v.Spinner", false);
            component.set("v.buttonDisable", false);
        }
        else if (map_case[Case.Sub_Category__c] && component.get("v.filerequired") == 'true') {
            if (files && files.length > 0) {
                var file = files[0];
                var reader = new FileReader();
                reader.onload = $A.getCallback(function () {
                    var dataURL = reader.result;
                    var base64 = 'base64,';
                    var dataStart = dataURL.indexOf(base64) + base64.length;
                    dataURL = dataURL.substring(dataStart);
                    helper.UploadHelper(component, event, helper, dataURL, component.get("v.fileName"), Case);
                });
                reader.readAsDataURL(file);
            }
            else {
                this.showToast(component, 'dismissible', 'Failed', 'Attachment Should Not Be Empty', 'error');
                component.set("v.Spinner", false);
                component.set("v.buttonDisable", false);
            }
        }
        else if (map_case[Case.Sub_Category__c] && component.get('v.filerequired') == 'false' && files && files.length > 0) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = $A.getCallback(function () {
                var dataURL = reader.result;
                var base64 = 'base64,';
                var dataStart = dataURL.indexOf(base64) + base64.length;
                dataURL = dataURL.substring(dataStart);
                helper.UploadHelper(component, event, helper, dataURL, component.get("v.fileName"), Case);
            });
            reader.readAsDataURL(file);
        }
        else {
            helper.UploadHelper(component, event, helper, null, null, Case);
        }
    },
    UploadHelper: function (component, event, helper, file, fileName, Case) {
        console.log('I am inside the method');
        var action = component.get("c.CreateCaseWithFile");
        action.setParams({
            'file': file,
            'fileName': fileName,
            objCase: Case
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            console.log('I am inside the method1');
            if (state === 'SUCCESS') {
                console.log('I am inside the method2');
                if (response.getReturnValue() != undefined) {
                    if (response.getReturnValue().strMessage === 'Success') {
                        this.showToast(component, 'dismissible', 'Success', 'Record Created Successfully!', 'success');
                        component.set("v.Spinner", false);
                        component.set("v.buttonDisable", false);
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": response.getReturnValue().CaseId,
                            "slideDevName": "detail"
                        });
                        navEvt.fire();
                    }
                    else {
                        this.showToast(component, 'dismissible', 'Failed', response.getReturnValue().strMessage, 'error');
                        component.set("v.Spinner", false);
                        component.set("v.buttonDisable", false);
                        console.log('I am inside error1');
                    }
                }
                else {
                    this.showToast(component, 'dismissible', 'Failed', response.getError()[0].message, 'error');
                    component.set("v.Spinner", false);
                    component.set("v.buttonDisable", false);
                    console.log('I am inside error2');
                }
            }
            else {
                this.showToast(component, 'dismissible', 'Failed', response.getError()[0].message, 'error');
                component.set("v.Spinner", false);
                component.set("v.buttonDisable", false);
                console.log('I am inside error3');
            }
        });
        $A.enqueueAction(action);
    },
    showToast: function (component, mode, title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "mode": mode,
            "title": title,
            "message": message,
            "type": type,
            "duration": '1'
        });
        toastEvent.fire();
    },
})