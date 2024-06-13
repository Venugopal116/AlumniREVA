({

    doInit: function (component, event, helper) {
        var action = component.get("c.getProfileSpecificNavigationMenuItems");
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var menuItems = response.getReturnValue();
                // Process the returned items to set the image URLs
                menuItems.forEach(function (item) {
                    item.imageUrl = component.get("v.baseResourceURL") + helper.formatLabelToFilename(item.Label);
                    item.isActive = (item.Label === "Fees & Payments");
                    //item.isActive = false;
                });
                component.set("v.navigationMenuItems", menuItems);
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    handleToggleMenu: function (component, event, helper) {
        // Get the current state of the menu button
        var currentStatus = component.get("v.isMenuButtonActive");
        // Toggle the state
        component.set("v.isMenuButtonActive", !currentStatus);

        var menuItems = component.get("v.navigationMenuItems");

        menuItems.forEach(function (item) {
            item.isActive = (item.Label === "Fees & Payments");

        });
        component.set("v.navigationMenuItems", menuItems);
        component.set("v.selectedMenuLabel", "Fees & Payments");
    },

    handleButtonClick: function (component, event, helper) {

        var selectedValue = event.currentTarget.dataset.value;
        var menuItems = component.get("v.navigationMenuItems");

        menuItems.forEach(function (item) {
            item.isActive = (item.Label === selectedValue);

        });
        component.set("v.navigationMenuItems", menuItems);
        component.set("v.selectedMenuLabel", selectedValue);
    },


})