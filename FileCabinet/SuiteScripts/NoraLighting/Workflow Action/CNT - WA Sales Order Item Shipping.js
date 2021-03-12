/*
ID                  : customscript_cnt_wa_so_item_shipping
Name                : CNT - WA Sales Order Item Shipping
Purpose             : Checking the Line Item Location, if Line Item Location has a one different value.
                        Get the (Ship to Select, Shipping Carrier and Shipping Method)
                        then set to true the Enable Line Item Shipping and
                        set the Line Item Shipping (Ship To, Shipping Carrier and Ship Via)
Created On          : March 03, 2021
Author              : Ceana Technology
Script Type         : Workflow Action Script
Saved Searches      : NONE
*/

/**
 * @NApiVersion 2.x
 * @NScriptType workflowactionscript
 */
define(['N/record', '../Library/library_enableLineItem'],

function(record, lib) {
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @Since 2016.1
     */
    function onAction(scriptContext) {
        lib.enableLineItemShipping(scriptContext.newRecord);
    }

    return {
        onAction : onAction
    };
    
});
