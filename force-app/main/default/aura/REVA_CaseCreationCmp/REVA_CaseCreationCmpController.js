({
    doInit: function (component, event, helper) {
        helper.doInitHelper(component, event, helper);
        helper.RecTypeHelper(component, event, helper);
    },
    onSubCatChange: function (component, event, helper) {
        helper.onSubCatChangeHelper(component, event, helper);
    },
    handleFilesChange: function (component, event, helper) {
        var fileName = 'No File Selected';
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
            component.set("v.Remarks", '');
            component.set("v.docRequired", '');
        }
        component.set("v.fileName", fileName);
    },
    saveCase: function (component, event, helper) {
        helper.saveCaseHelper(component, event, helper);
    },
})