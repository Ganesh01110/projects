package com.parking.system.entryexit.processor;

public abstract class GateProcessor {
    
    // Template Method
    public final void process() {
        validateRequest();
        fetchContext();
        executeCoreLogic();
        postProcess();
    }

    protected abstract void validateRequest();
    protected abstract void fetchContext();
    protected abstract void executeCoreLogic();
    protected abstract void postProcess();
}
