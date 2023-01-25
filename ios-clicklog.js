function interceptActionWithTarget(actionSelector, target) {
    console.log("\tSet hook on: " + target.$className + "." + actionSelector.readCString() + "()")
    var impl = target.methodForSelector_(actionSelector)
    Interceptor.attach(impl, {
        onEnter: function(a) {
            this.log = []
            this.log.push("Called " + target.$className + "." + actionSelector.readCString() + "()")
        },
        onLeave: function(r) {
            console.log(this.log.join('\n') + '\n')
        }})
}


function setInteceptionRegistredActions(uiControl) {
    console.log("Get callbacks of " + uiControl.$className + " " + uiControl.handle)
    var targetActions = uiControl.$ivars._targetActions
    if (targetActions == null) {
        console.log("\tNo callbacks found")
        return
    }

    var count = targetActions.count().valueOf()
    
    for (let i = 0; i !== count; i++) {
        var action = targetActions.objectAtIndex_(i)
        // First case when UIAction specified
        if (action.$ivars._actionHandler != null) {
            var uiAction = action.$ivars._actionHandler
        } else if (action.$ivars._action != null && 
                    action.$ivars._action != "0x0" &&
                    action.$ivars._target != null) {
            var actionSelector = action.$ivars._action
            var actionTarget = action.$ivars._target
            interceptActionWithTarget(actionSelector, actionTarget)
        }
        else if (action.$ivars._action != null && 
            action.$ivars._action != "0x0"){
            var actionSelector = action.$ivars._action
            var uiApp = ObjC.classes.UIApplication.sharedApplication()
            // frida bug? anyway we can't call this 
            // var actionTarget = uiApp._targetInChainForAction_sender_(actionSelector, uiControl)
            // but we can 
            var targetInChainForActionPrototype = new NativeFunction(ObjC.api.objc_msgSend, "pointer", ["pointer","pointer","pointer", "pointer"])
            var actionTargetPtr = targetInChainForActionPrototype(uiApp, ObjC.selector("_targetInChainForAction:sender:"), actionSelector, uiControl)
            var actionTarget = new ObjC.Object(actionTargetPtr) 
            if (actionTarget != null) {
                interceptActionWithTarget(actionSelector, actionTarget)
            } else {
                console.warn("Can't get target for selector: " + actionSelector.readCString())
            }
        }
        else {
            console.error("Invalid UIControlTargetAction with actionHandler and action seted to null")
            continue
        }
    }
}

function hookAllUIControlsAction() {
    console.log("Getting all UIControl's")
    uiControls = ObjC.chooseSync(ObjC.classes.UIControl)
    uiControls.forEach(control => {setInteceptionRegistredActions(control)})
}
