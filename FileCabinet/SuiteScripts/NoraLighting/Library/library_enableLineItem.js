define(['N/record'],
/**
 * @param{record} record
 */
function(record) {
    var func = {};

    func.enableLineItemShipping = function (scriptContext) {
        var arrResult = [];

        log.debug('Start Script');

        var recSalesOrder = scriptContext;

        var inItem = recSalesOrder.getLineCount({
            sublistId: 'item'
        });

        for (var indxLoc = 0; indxLoc < inItem; indxLoc++) {
            var inLineLocation = recSalesOrder.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: indxLoc
            });

            arrResult.push(inLineLocation);
        }

        // log.debug('arrResult', arrResult);
        // log.debug('arr', checkingOfLocation(arrResult));

        if(!checkingOfLocation(arrResult)){
            var inLineShipGroup = getLineShipGroup(recSalesOrder);

            recSalesOrder.setValue({
                fieldId: 'ismultishipto',
                value: true
            });

            if (!inLineShipGroup.shipTo) {
                var inShipAddress = createLine1ShipAddress(recSalesOrder);

                for (var indxShip = 0; indxShip < inItem; indxShip++) {
                    recSalesOrder.selectLine({
                        sublistId: 'item',
                        line: indxShip
                    });
                    recSalesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'shipaddress',
                        value: inShipAddress,
                        ignoreFieldChange: true
                    });
                    recSalesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'shipcarrier',
                        value: inLineShipGroup.shipCarrier,
                        ignoreFieldChange: true
                    });
                    recSalesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'shipmethod',
                        value: inLineShipGroup.shipMethod,
                        ignoreFieldChange: true
                    });
                    recSalesOrder.commitLine({
                        sublistId: 'item'
                    });
                }
            } else {
                for (var indxShip = 0; indxShip < inItem; indxShip++) {
                    recSalesOrder.selectLine({
                        sublistId: 'item',
                        line: indxShip
                    });
                    recSalesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'shipaddress',
                        value: inLineShipGroup.shipTo,
                        ignoreFieldChange: true
                    });
                    recSalesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'shipcarrier',
                        value: inLineShipGroup.shipCarrier,
                        ignoreFieldChange: true
                    });
                    recSalesOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'shipmethod',
                        value: inLineShipGroup.shipMethod,
                        ignoreFieldChange: true
                    });
                    recSalesOrder.commitLine({
                        sublistId: 'item'
                    });
                }
            }
        } else {
            recSalesOrder.setValue({
                fieldId: 'ismultishipto',
                value: false
            });
        }

        log.debug('End Script');
    }

    function checkingOfLocation(arr) {
        var inArr = arr[0];
        return arr.every(function (location){
            return location === inArr;
        });
    }
    
    function getLineShipGroup(recSalesOrder) {
        var inShipTo = recSalesOrder.getSublistValue({
            sublistId: 'shipgroup',
            fieldId: 'destinationaddressref',
            line: 0
        });
        var inShipCarrier = recSalesOrder.getSublistValue({
            sublistId: 'shipgroup',
            fieldId: 'shippingcarrier',
            line: 0
        });
        var inShipMethod = recSalesOrder.getSublistValue({
            sublistId: 'shipgroup',
            fieldId: 'shippingmethodref',
            line: 0
        });

        var objShipGroup = {
            shipTo : inShipTo,
            shipCarrier : inShipCarrier,
            shipMethod : inShipMethod
        };

        log.debug('getLineShipGroup', objShipGroup);
        return objShipGroup;
    }
    
    function getCustomShipTo(recSalesOrder) {
        var subRecordShipTo = recSalesOrder.getSubrecord({
            fieldId: 'shippingaddress'
        });

        var isShipResidential = recSalesOrder.getValue({
            fieldId : 'shipisresidential'
        });
        var stShipCountry = subRecordShipTo.getValue({
            fieldId : 'country'
        });
        var stShipAttention = subRecordShipTo.getValue({
            fieldId : 'attention'
        });
        var stShipAddressee = subRecordShipTo.getValue({
            fieldId : 'addressee'
        });
        var stShipPhone = subRecordShipTo.getValue({
            fieldId : 'addrphone'
        });
        var stShipAddress1 = subRecordShipTo.getValue({
            fieldId : 'addr1'
        });
        var stShipAddress2 = subRecordShipTo.getValue({
            fieldId : 'addr2'
        });
        var stShipCity = subRecordShipTo.getValue({
            fieldId : 'city'
        });
        var stShipState = subRecordShipTo.getValue({
            fieldId : 'state'
        });
        var stShipZip = subRecordShipTo.getValue({
            fieldId : 'zip'
        });

        var objCustomShipTo = {
            Residential : isShipResidential,
            Country : stShipCountry,
            Attention : stShipAttention,
            Addressee : stShipAddressee,
            Phone : stShipPhone,
            Address1 : stShipAddress1,
            Address2 : stShipAddress2,
            City : stShipCity,
            State : stShipState,
            Zip : stShipZip
        };

        log.debug('objCustomShipTo', objCustomShipTo);
        return objCustomShipTo;
    }
    
    function createLine1ShipAddress(recSalesOrder) {
        var stCustomShipTo = getCustomShipTo(recSalesOrder);

        recSalesOrder.selectLine({
            sublistId: 'item',
            line: 0
        });

        var subRecShipAddress = recSalesOrder.getCurrentSublistSubrecord({
            sublistId : 'item',
            fieldId : 'shippingaddress'
        });
        subRecShipAddress.setValue({
            fieldId: 'isresidential',
            value: stCustomShipTo.Residential
        });
        subRecShipAddress.setValue({
            fieldId: 'country',
            value: stCustomShipTo.Country
        });
        subRecShipAddress.setValue({
            fieldId: 'attention',
            value: stCustomShipTo.Attention
        });
        subRecShipAddress.setValue({
            fieldId: 'addressee',
            value: stCustomShipTo.Addressee
        });
        subRecShipAddress.setValue({
            fieldId: 'addrphone',
            value: stCustomShipTo.Phone
        });
        subRecShipAddress.setValue({
            fieldId: 'addr1',
            value: stCustomShipTo.Address1
        });
        subRecShipAddress.setValue({
            fieldId: 'addr2',
            value: stCustomShipTo.Address2
        });
        subRecShipAddress.setValue({
            fieldId: 'city',
            value: stCustomShipTo.City
        });
        subRecShipAddress.setValue({
            fieldId: 'state',
            value: stCustomShipTo.State
        });
        subRecShipAddress.setValue({
            fieldId: 'zip',
            value: stCustomShipTo.Zip
        });

        recSalesOrder.commitLine({
            sublistId : 'item'
        });
        var inShipAddress = recSalesOrder.getSublistValue({
            sublistId : 'item',
            fieldId : 'shipaddress',
            line : 0
        });
        return inShipAddress;
    }

    return func;
});
