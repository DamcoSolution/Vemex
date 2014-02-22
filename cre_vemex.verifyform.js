if (typeof (XRM) == "undefined")
{ XRM = {}; }

XRM = {

    //variables name
    Variables: {

        IsDirtyPass: ["stageid", "cre_aftervalidationdesc"],
        SupplierFields: [
            "cre_resignation_status",
            "cre_resignation_defeat_status",
            "cre_supplierchangerequest",
            "cre_currentstage",
            "processid",
            "id",
            "stageid"
        ],
        DistributorFields: ["cre_rssend", "cre_currentstage", "processid", "id", "stageid"],
        OteFields: ["cre_currentstage", "stageid", "processid", "id"],
        VerificationDisableFields: ["cre_status", "cre_verificationperson", "cre_verificationcomplete", "cre_verificationdate", "cre_firstverificationperson", "cre_currentstage", "cre_verification_is_ready"],
        ValidationDisableFields: ["cre_status", "cre_validationperson", "cre_validationcomplete", "cre_validationdate", "cre_firstvalidationperson", "cre_currentstage", "cre_validation_is_ready"],
        SupplierStageName: "Dodavatel",
        DistributorStageName: "Distributor",
        OteStageName: "Ote",
        VerificationStageName: "Verifikace",
        ValidationStageName: "Validace",
        VerifyFormValidateStatus: "cre_status",
        EANEICValidation: "cre_eaneicvalidation",
        PaymentTypeAdvances: "cre_paymenttypeadvances",
        ConnectionSIPO: "cre_siponumber",
        ConnectionSIPOValidate: "cre_connection_number_sipo",
        EIC: "cre_eic",
        EAN: "cre_eanopm",
        Email: "cre_email",
        EmailValidate: "cre_access_email_validation",
        PaymentType: "cre_paymenttype",
        AccountNumber1: "cre_accountnumberp1",
        AccountNumber2: "cre_accountnumberp2",
        AccountBank: "cre_bankcode",
        AccountNumberValidate: "cre_account_number_validation",
        ContractFromTerm: "cre_fromfixedtermcontract",
        FromIndefinitePeriodContract: "cre_fromindefiniteperiodcontract",
        ContractToTerm: "cre_tofixedtermcontract",
        ContractTermValidate: "cre_contractvalidation",
        DistributorElectricity: "cre_distributorelectricity",
        DistributorGas: "cre_distributorgas",
        DistributorEANEICValidate: "cre_distributorbyeaneic_validation",
        BirthDate: "cre_birthdate",
        AgeValidate: "cre_agevalidation",
        VerifyFormOpportunity: "cre_opportunity",
        VerifyFormContract: "cre_contractid",
        VerifyFormResignation: "cre_resignation",
        ContractTypeCode: "cre_contracttypecode",
        VerifyForm: "cre_verifyformSet",
        ValidateTabName: "tab_12",
        AdvancePayment: "cre_advancepayment",
        Contact: "cre_contact",
        AnnualGasConsume: "cre_annualconsumption_gas",
        AdvancePeriod: "cre_advanceperiod",
        AnnualConsumeVt: "cre_annualconsumptionvt",
        DistribtutionRate: "cre_distributionrate",
        ProcessStage: "ProcessStageSet",
        ReasonCancelContract: "cre_reason_of_cancel_contract",
        SaveAndMoveNext: "cre_saveandmovenext",
        SaveAndMoveToValidation: "cre_saveandmovetovalidation",
        CurrentStageValue: "",
        ValidationIsReady: "cre_validation_is_ready",
        VerificationIsReady: "cre_verification_is_ready",
        AfterVerification: "cre_afterverificationdesc",
        AfterValidation: "cre_aftervalidationdesc",
        UpdateStage: "true",
        CurrentStageField: "cre_currentstage",
        StageIdField: "stageid",
        SupplierResignationStatus: "cre_resignation_status"
    },

    Funcs: {

        // On load Event 
        //XRM.Funcs.OnLoad
        OnLoad: function () {

            var formType = Xrm.Page.ui.getFormType();

            //Update
            if (formType == 2) {

                //Get Current StageName from db
                if (Xrm.Page.getAttribute(XRM.Variables.StageIdField) != null) {
                    var stageid = Xrm.Page.getAttribute(XRM.Variables.StageIdField).getValue();
                    if (stageid != null)
                        XRM.Funcs.RetrieveRecordByID(stageid, XRM.Variables.ProcessStage, XRM.Funcs.ReadStageRecord);
                }
                else {
                    var currentid = Xrm.Page.data.entity.getId();
                    XRM.Funcs.RetrieveRecordByID(currentid, XRM.Variables.VerifyForm, XRM.Funcs.ReadVerifyFormRecord);
                }

                //Hide/Show and/or Expand/Collapse tabs     
                var tabs = Xrm.Page.ui.tabs.get();
                for (var i = 0; i < tabs.length; i++) {
                    var tab = tabs[i];
                    if (tab.getName() == XRM.Variables.ValidateTabName) {
                        tab.setVisible(true);
                        XRM.Funcs.OnEmailChange();

                        XRM.Funcs.OnContractTermChange();
                        XRM.Funcs.OnIndefiniteDateChange();

                        XRM.Funcs.OnSipoNumberChange();

                        XRM.Funcs.OnAccountNumber1Change();
                        XRM.Funcs.OnBirthDateChange();
                        XRM.Funcs.OnAccountNumber2Change();

                        tab.setVisible(false);
                        //tab.setDisplayState();
                    }
                }
                //duplicate check
                XRM.Funcs.CheckExistsEANEICCode();

                var ean = Xrm.Page.getAttribute(XRM.Variables.EAN).getValue();
                var cre_eic = Xrm.Page.getAttribute(XRM.Variables.EIC).getValue();

                //Electricity related function
                if (ean != null && ean != "") {
                    XRM.Funcs.OnEANChange();
                    XRM.Funcs.OnElectricAmountChange();
                    if (Xrm.Page.getAttribute(XRM.Variables.ContractTypeCode).getValue() != 171140000) {
                        Xrm.Page.getAttribute(XRM.Variables.ContractTypeCode).setValue(171140000); //EAN
                    }
                }

                    //Gas-Plyn Related functions
                else if (cre_eic != null && cre_eic != "") {
                    XRM.Funcs.OnEICChange();
                    XRM.Funcs.OnGasAmountChange();
                    if (Xrm.Page.getAttribute(XRM.Variables.ContractTypeCode).getValue() != 171140001) {
                        Xrm.Page.getAttribute(XRM.Variables.ContractTypeCode).setValue(171140001); //EIC
                    }
                }

                /// Set the value of Contract as per Opportunity Name
                var opportunity = Xrm.Page.getAttribute(XRM.Variables.VerifyFormOpportunity).getValue(); //Lookup for the Opportunity entity
                if (opportunity != null) {
                    var opportunityName = opportunity[0].name;
                    Xrm.Page.getAttribute(XRM.Variables.VerifyFormContract).setValue(opportunityName);
                }
            }
        },

        //Save Event
        ////XRM.Funcs.OnSave
        OnSave: function (econtext) {

            var eventArgs = econtext.getEventArgs();

            if (XRM.Variables.UpdateStage == "true" && eventArgs.getSaveMode() == 1) {

                Xrm.Page.ui.clearFormNotification("ValidationFailed");
                Xrm.Page.ui.clearFormNotification("VerificationStatusMessage");

                if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.VerificationStageName.toLowerCase()) {
                    Xrm.Page.getAttribute(XRM.Variables.AfterValidation).setValue(Xrm.Page.getAttribute(XRM.Variables.AfterVerification).getValue());

                    //to change stage id
                    if (Xrm.Page.getAttribute(XRM.Variables.StageIdField).getIsDirty() == false && Xrm.Page.getAttribute(XRM.Variables.VerificationIsReady).getValue() == true) {
                        $(".stageActionText").trigger('click');
                        return;
                    }
                }
                else if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.ValidationStageName.toLowerCase()) {
                    if (Xrm.Page.getAttribute(XRM.Variables.StageIdField).getIsDirty() == false) {

                        $(".stageActionText").trigger('click');
                        return;
                    }
                }
                if (Xrm.Page.getAttribute(XRM.Variables.StageIdField).getIsDirty() == true) {
                    if (XRM.Funcs.ValidateNextClick() == false) {
                        eventArgs.preventDefault();
                    }
                }
            }
        },

        //Change event
        ////XRM.Funcs.OnProcessStageChange
        OnProcessStageChange: function () {
        },

        ////XRM.Funcs.OnGasAmountChange
        OnGasAmountChange: function () {
            var DepositAmount = Xrm.Page.getAttribute(XRM.Variables.AdvancePayment).getValue();

            if (DepositAmount == null || parseInt(DepositAmount) < 1) {
                var contact = Xrm.Page.getAttribute(XRM.Variables.Contact);
                var HomeCheck = false;
                if (contact != null)
                    HomeCheck = true;

                var NewDistributor = Xrm.Page.getAttribute(XRM.Variables.DistributorGas).getText();
                var SubscriptionAmount = Xrm.Page.getAttribute(XRM.Variables.AnnualGasConsume).getValue();

                var Period = Xrm.Page.getAttribute(XRM.Variables.AdvancePeriod).getText();
                XRM.Funcs.CalculateDeposit(HomeCheck, NewDistributor, SubscriptionAmount, DepositAmount, Period);
            }
        },

        ////XRM.Funcs.OnElectricAmountChange
        OnElectricAmountChange: function () {

            var DepositAmount = Xrm.Page.getAttribute(XRM.Variables.AdvancePayment).getValue();

            if (DepositAmount == null || parseInt(DepositAmount) < 1) {

                var contact = Xrm.Page.getAttribute(XRM.Variables.Contact);
                var HomeCheck = false;
                if (contact != null)
                    HomeCheck = true;

                var NewDistributor = Xrm.Page.getAttribute(XRM.Variables.DistributorElectricity).getText();
                var SubscriptionAmountVT = Xrm.Page.getAttribute(XRM.Variables.AnnualConsumeVt).getValue();
                var SubscriptionAmountNT = Xrm.Page.getAttribute(XRM.Variables.AnnualConsumeVt).getValue();
                var DistributionRate = Xrm.Page.getAttribute(XRM.Variables.DistribtutionRate).getText();

                var Period = Xrm.Page.getAttribute(XRM.Variables.AdvancePeriod).getText();

                XRM.Funcs.CalculateDepositElectricity(NewDistributor, SubscriptionAmountVT, SubscriptionAmountNT, DistributionRate, DepositAmount, Period);
            }
        },

        ////XRM.Funcs.OnEICChange
        OnEICChange: function () {
            var eicNumber = Xrm.Page.getAttribute(XRM.Variables.EIC).getValue();
            if (eicNumber != null && eicNumber != "") {
                if (XRM.Funcs.IsValidEIC() == true) {
                    // XRM.Funcs.IsEICExists();
                    Xrm.Page.getAttribute(XRM.Variables.EANEICValidation).setValue(true);

                    if (XRM.Funcs.IsValidEICDistributor(eicNumber)) {
                        Xrm.Page.getAttribute(XRM.Variables.DistributorEANEICValidate).setValue(true);
                    }
                    else {
                        Xrm.Page.getAttribute(XRM.Variables.DistributorEANEICValidate).setValue(false);
                    }
                }
                else {
                    //XRM.Variables.EANEICValidation
                    Xrm.Page.getAttribute(XRM.Variables.EANEICValidation).setValue(false);
                    Xrm.Page.getAttribute(XRM.Variables.DistributorEANEICValidate).setValue(false);
                }
            }
        },

        ////XRM.Funcs.OnEANChange
        OnEANChange: function () {
            var eanNumber = Xrm.Page.getAttribute(XRM.Variables.EAN).getValue();
            if (eanNumber != null && eanNumber != "") {
                if (XRM.Funcs.IsValidEAN() == true) {

                    Xrm.Page.getAttribute(XRM.Variables.EANEICValidation).setValue(true);
                    if (XRM.Funcs.IsValidEANDistributor(eanNumber)) {
                        Xrm.Page.getAttribute(XRM.Variables.DistributorEANEICValidate).setValue(true);
                    }
                    else {
                        Xrm.Page.getAttribute(XRM.Variables.DistributorEANEICValidate).setValue(false);
                    }
                }
                else {
                    //XRM.Variables.EANEICValidation
                    Xrm.Page.getAttribute(XRM.Variables.EANEICValidation).setValue(false);
                    Xrm.Page.getAttribute(XRM.Variables.DistributorEANEICValidate).setValue(false);
                }
            }

        },

        //XRM.Funcs.IsValidDistributor
        IsValidEANDistributor: function (ean) {

            var distributorValue = Xrm.Page.getAttribute(XRM.Variables.DistributorElectricity).getValue();
            var ValidValue = 0;

            if (ean.length == 18) {
                var prefix = ean.substring(0, 9),
                    code = ean.substring(9, 10),
                    distributorName;

                if (prefix == "859182400") {
                    switch (code) {
                        case "1":
                        case "2":
                            //distributorName = "E.ON Distribuce";
                            ValidValue = 171140001;
                            break;
                        case "3":
                            //distributorName = "PRE Distribuce";
                            ValidValue = 171140002;
                            break;
                        case "4":
                        case "5":
                        case "6":
                        case "7":
                        case "8":
                            //distributorName = "ÄŒEZ Distribuce";
                            ValidValue = 171140000;
                            break;
                    }

                }
            }
            return distributorValue == ValidValue;
        },

        IsValidEICDistributor: function (eic) {

            var distributorValue = Xrm.Page.getAttribute(XRM.Variables.DistributorGas).getValue();
            var ValidValue = 0;

            if (eic.length == 16) {
                var prefix = eic.substring(0, 4),
                    code = eic.substring(4, 5);

                if (prefix == "27ZG") {
                    switch (code) {
                        case "1":
                            //distributorName = "PraÅ¾skÃ¡ plynÃ¡renskÃ¡ Distribuce";
                            ValidValue = 171140005;
                            break;
                        case "2":
                        case "3":
                        case "4":
                            //distributorName = "RWE GasNet";
                            ValidValue = 171140000;
                            break;
                        case "5":
                            //distributorName = "VÄŒP Net";
                            ValidValue = 171140004;
                            break;
                        case "6":
                            //distributorName = "JMP Net";
                            ValidValue = 171140002;
                            break;
                        case "7":
                            //distributorName = "SMP Net";
                            ValidValue = 171140003;
                            break;
                        case "9":
                            //distributorName = "E.ON Distribuce";
                            ValidValue = 171140001;
                            break;
                    }

                }
            }
            return distributorValue == ValidValue;
        },

        ///XRM.Funcs.OnEmailChange
        OnEmailChange: function () {
            if (XRM.Funcs.IsValidEmail() == true) {
                Xrm.Page.getAttribute(XRM.Variables.EmailValidate).setValue(true);
            }
            else {
                Xrm.Page.getAttribute(XRM.Variables.EmailValidate).setValue(false);
            }
        },

        ///XRM.Funcs.OnContractTermChange
        OnContractTermChange: function () {

            if (XRM.Funcs.IsValidContractTerm() == true) {
                Xrm.Page.getAttribute(XRM.Variables.ContractTermValidate).setValue(true);
            }
            else {
                Xrm.Page.getAttribute(XRM.Variables.ContractTermValidate).setValue(false);
            }
        },

        ///XRM.Funcs.OnIndefiniteDateChange
        OnIndefiniteDateChange: function () {
            var fromContract = Xrm.Page.getAttribute(XRM.Variables.ContractFromTerm).getValue();
            var FromIndefinitePeriodContract = Xrm.Page.getAttribute(XRM.Variables.FromIndefinitePeriodContract).getValue();
            var FromDate = null;
            if (fromContract != null) {

                FromDate = new Date(fromContract);
            }
            else if (FromIndefinitePeriodContract != null) {
                FromDate = new Date(FromIndefinitePeriodContract);
            }
            if (FromDate != null) {
                var expiryDate = new Date(FromDate.getFullYear(), FromDate.getMonth(), FromDate.getDate() - 1);
                Xrm.Page.getAttribute(XRM.Variables.VerifyFormResignation).setValue(expiryDate);
            }

        },

        ///XRM.Funcs.OnSIPONumberChange
        OnSipoNumberChange: function () {
            var connectionSIPO = Xrm.Page.getAttribute(XRM.Variables.ConnectionSIPO).getValue();

            if (connectionSIPO == null || connectionSIPO == "") {
                Xrm.Page.getAttribute(XRM.Variables.ConnectionSIPOValidate).setValue(false);
            }
            else {
                if (XRM.Funcs.IsValidSIPO(connectionSIPO) == true) {
                    Xrm.Page.getAttribute(XRM.Variables.ConnectionSIPOValidate).setValue(true);
                }
                else {
                    Xrm.Page.getAttribute(XRM.Variables.ConnectionSIPOValidate).setValue(false);
                }
            }
        },

        ///XRM.Funcs.OnAccountNumber1Change
        OnAccountNumber1Change: function () {
            //var paymentType = Xrm.Page.getAttribute(XRM.Variables.PaymentType).getValue();
            //var accountBank = Xrm.Page.getAttribute(XRM.Variables.AccountBank).getValue();
            var accountNumber1 = Xrm.Page.getAttribute(XRM.Variables.AccountNumber1).getValue();
            //var accountNumber2 = Xrm.Page.getAttribute(XRM.Variables.AccountNumber2).getValue();
            if (accountNumber1 == null || accountNumber1 == "") {
                Xrm.Page.getAttribute(XRM.Variables.AccountNumberValidate).setValue(false);
            }
            else {
                if (XRM.Funcs.IsValidPrefix(accountNumber1)) {
                    Xrm.Page.getAttribute(XRM.Variables.AccountNumberValidate).setValue(true);
                }
                else {
                    Xrm.Page.getAttribute(XRM.Variables.AccountNumberValidate).setValue(false);
                }
            }
        },

        ///XRM.Funcs.OnAccountNumber2Change
        OnAccountNumber2Change: function () {

            var accountNumber2 = Xrm.Page.getAttribute(XRM.Variables.AccountNumber2).getValue();

            if (accountNumber2 == null || accountNumber2 == "") {
                Xrm.Page.getAttribute(XRM.Variables.AccountNumberValidate).setValue(false);
            }
            else {
                if (XRM.Funcs.IsValidBasic(accountNumber2)) {
                    Xrm.Page.getAttribute(XRM.Variables.AccountNumberValidate).setValue(true);
                }
                else {
                    Xrm.Page.getAttribute(XRM.Variables.AccountNumberValidate).setValue(false);
                }
            }
        },

        ///XRM.Funcs.OnBirthDateChange
        OnBirthDateChange: function () {
            var birthDate = Xrm.Page.getAttribute(XRM.Variables.BirthDate).getValue();
            if (birthDate != null) {
                var dt = new Date(birthDate);

                if (XRM.Funcs.Is18YearsOld(dt)) {
                    Xrm.Page.getAttribute(XRM.Variables.AgeValidate).setValue(true);
                }
                else {
                    Xrm.Page.getAttribute(XRM.Variables.AgeValidate).setValue(false);
                }
            }
        },

        ///XRM.Funcs.OnAdvancePaymentChange
        OnAdvancePaymentChange: function () {
            var cre_eic = Xrm.Page.getAttribute(XRM.Variables.EIC).getValue();
            var ean = Xrm.Page.getAttribute(XRM.Variables.EAN).getValue();
            if (cre_eic != null && cre_eic != "") {
                XRM.Funcs.OnGasAmountChange();
            }
            if (ean != null && ean != "") {
                XRM.Funcs.OnElectricAmountChange();
            }
        },

        updateFormRecordVariables: function () {
            // Gets the record Guid
            var id = Xrm.Page.data.entity.getId();
            //alert(id);
            var verifyStatus = Xrm.Page.getAttribute(XRM.Variables.VerifyFormValidateStatus).getValue();
            if (verifyStatus == 171140003) {
                verifyStatus = 171140004
            }
            else {
                verifyStatus = 171140003;
            }
            var changes = {
                cre_status: { Value: verifyStatus }

            };

            XRM.Funcs.updateRecord(id, changes, XRM.Variables.VerifyForm, XRM.Funcs.updateVerifyFormCompleted, null);

        },

        //Called upon successful VerifyForm update.
        updateVerifyFormCompleted: function (data, textStatus, XmlHttpRequest) {

            //Get back the Account JSON object

            var verifyForm = data;
            Mscrm.ReadFormUtilities.openInSameFrame(window._etc, Xrm.Page.data.entity.getId());
            //alert(verifyForm.cre_status.value);

            //alert("Account updated: id = " + account.id);

        },

        //Internal Functions
        updateRecord: function (id, entityObject, odataSetName, successCallback, errorCallback) {

            var serverUrl = Xrm.Page.context.getClientUrl();

            //The XRM OData end-point
            var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
            //id is required
            if (!id) {
                alert("record id is required.");
                return;
            }
            //odataSetName is required, i.e. "VerfiyFormSet"

            if (!odataSetName) {
                alert("odataSetName is required.");
                return;
            }
            //Parse the entity object into JSON
            var jsonEntity = window.JSON.stringify(entityObject);
            //Asynchronous AJAX function to Update a CRM record using OData
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                data: jsonEntity,
                url: serverUrl + ODATA_ENDPOINT + "/" + odataSetName + "(guid'" + id + "')",
                beforeSend: function (XMLHttpRequest) {
                    //Specifying this header ensures that the results will be returned as JSON.  
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    //Specify the HTTP method MERGE to update just the changes you are submitting.             
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    //The MERGE does not return any data at all, so we'll add the id 
                    //onto the data object so it can be leveraged in a Callback. When data 
                    //is used in the callback function, the field will be named generically, "id"
                    data = new Object();
                    data.id = id;
                    if (successCallback) {
                        successCallback(data, textStatus, XmlHttpRequest);
                    }
                },
                error: function (XmlHttpRequest, textStatus, errorThrown) {
                    if (errorCallback)
                        errorCallback(XmlHttpRequest, textStatus, errorThrown);
                    else
                        XRM.Funcs.errorHandler(XmlHttpRequest, textStatus, errorThrown);
                }
            });
        },

        errorHandler: function (xmlHttpRequest, textStatus, errorThrow) {
            alert("Error : " + textStatus + ": " + xmlHttpRequest.statusText);
        },

        RetrieveRecordByID: function (id, odataSetName, readRecord) {

            // Get Server URL
            var serverUrl = Xrm.Page.context.getClientUrl();

            //The OData end-point
            var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";

            //Asynchronous AJAX function to Retrieve a CRM record using OData
            $.ajax({

                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serverUrl + ODATA_ENDPOINT + "/" + odataSetName + "(guid'" + id + "')",

                beforeSend: function (XMLHttpRequest) {
                    //Specifying this header ensures that the results will be returned as JSON.
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                success: function (data, textStatus, XMLHttpRequest) {

                    if (readRecord && typeof (readRecord) === "function") {
                        readRecord(data, textStatus, XMLHttpRequest);
                    }

                },
                error: function (XmlHttpRequest, textStatus, errorThrown) {
                    //alert("Error â€“ " + errorThrown)
                }
            });
        },

        ReadVerifyFormRecord: function (data, textStatus, XMLHttpRequest) {

            var VerifyForm = data.d;
            var stageid = VerifyForm.stageid;
            if (stageid != null)
                XRM.Funcs.RetrieveRecordByID(stageid, XRM.Variables.ProcessStage, XRM.Funcs.ReadStageRecord);
        },

        ReadStageRecord: function (data, textStatus, XMLHttpRequest) {
            var StageProcess = data.d;

            XRM.Variables.CurrentStageValue = StageProcess.StageName;

            if (StageProcess.StageName.toLowerCase() == XRM.Variables.SupplierStageName.toLowerCase()) {

                XRM.Funcs.disableFormFields(true, XRM.Variables.SupplierFields);
            }
            else if (StageProcess.StageName.toLowerCase() == XRM.Variables.DistributorStageName.toLowerCase()) {
                XRM.Funcs.disableFormFields(true, XRM.Variables.DistributorFields);
            }
            else if (StageProcess.StageName.toLowerCase() == XRM.Variables.OteStageName.toLowerCase()) {
                XRM.Funcs.disableFormFields(true, XRM.Variables.OteFields);
            }
            else if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.ValidationStageName.toLowerCase()) {
                //var afterVerification = Xrm.Page.getAttribute(XRM.Variables.AfterVerification).getValue();
                //var afterValidation = Xrm.Page.getAttribute(XRM.Variables.AfterValidation).getValue();

                //if (afterVerification != null) {
                //    if (afterValidation != afterVerification) {
                //        Xrm.Page.getAttribute(XRM.Variables.AfterValidation).setValue(afterVerification);
                //    }
                //}
                //Disabling the verification stage required fields on validation stage
                var allAttributes = Xrm.Page.data.entity.attributes.get();
                var fields = XRM.Variables.VerificationDisableFields;
                for (var i in allAttributes) {
                    var myattribute = allAttributes[i];
                    var attrName = myattribute.getName();
                    if (fields.indexOf(attrName) > -1) {
                        if (Xrm.Page.getControl(attrName) != null) {
                            Xrm.Page.getControl(attrName).setDisabled(true);
                        }
                    }
                }



                //XRM.Funcs.disableFormFields(true, XRM.Variables.VerificationDisableFields); 
            }
            //else if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.VerificationStageName.toLocaleLowerCase()) {
            //    XRM.Funcs.disableFormFields(false, XRM.Variables.ValidationDisableFields); //Disabling the validation stage required fields on verification stage
            //}
        },

        doesControlHaveAttribute: function (control) {

            var controlType = control.getControlType();
            // console.log(controlType);
            // return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid";
            if (controlType == "optionset" || ControlType == "lookup" || controlType == "standard") {
                return true;
            }
            else {
                return false;
            }
        },

        disableFormFields: function (onOff, fields) {

            var allAttributes = Xrm.Page.data.entity.attributes.get();
            for (var i in allAttributes) {
                var myattribute = allAttributes[i];
                var attrName = myattribute.getName();
                if (fields.indexOf(attrName) < 0) {
                    if (Xrm.Page.getControl(attrName) != null) {
                        Xrm.Page.getControl(attrName).setDisabled(onOff);
                    }

                }
            }

            //Xrm.Page.ui.controls.forEach(function (control, index) {
            //    var controlhas = XRM.Funcs.doesControlHaveAttribute(control);
            //    if (controlhas == true) {
            //        {
            //            try {
            //                if (control.getAttribute() != null && fields.indexOf(control.getAttribute().getName()) < 0) {
            //                    control.setDisabled(onOff);
            //                }
            //            }
            //            catch (error) {
            //                console.log("error");
            //            }
            //        }
            //    }
            //});
        },

        CalculateDeposit: function (HomeCheck, NewDistributor, SubscriptionAmount, DepositAmount, Period) {

            if (NewDistributor != "" && SubscriptionAmount != "" && Period != "") {
                var amount = parseFloat(SubscriptionAmount);
                var total = DepositAmount != "" ? parseInt(DepositAmount) : 0;
                var depositval = total;
                var success = true;
                switch (NewDistributor) {
                    case "E.ON Distribuce":
                        if (HomeCheck == true) {
                            if (amount <= 1.89)
                                total = amount * 1479.28;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1221.89;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1170.59;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1147.59;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1137.53;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1129.90;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1125.51;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1123.77;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1120.83;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1116.18;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1113.31;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1107.86;
                            if (amount > 63)
                                total = amount * 1053.99;
                        }
                        else {
                            if (amount <= 1.89)
                                total = amount * 1509.88;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1252.49;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1201.19;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1178.19;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1168.13;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1160.50;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1156.11;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1154.37;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1151.43;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1146.78;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1143.91;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1138.46;
                            if (amount > 63)
                                total = amount * 1084.59;
                        }
                        break;
                    case "RWE GasNet":
                        if (HomeCheck == true) {
                            if (amount <= 1.89)
                                total = amount * 1283.56;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1109.19;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1086.17;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1071.45;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1063.81;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1053.32;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1045.41;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1038.54;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1033.17;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1028.42;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1023.12;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1018.34;
                            if (amount > 63)
                                total = amount * 974.41;
                        }
                        else {
                            if (amount <= 1.89)
                                total = amount * 1314.16;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1139.79;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1116.77;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1102.05;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1094.41;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1083.92;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1076.01;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1069.14;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1063.77;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1059.02;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1053.72;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1048.94;
                            if (amount > 63)
                                total = amount * 1005.01;
                        }
                        break;
                    case "Pražská plynárenská Distribuce":
                        if (HomeCheck == true) {
                            if (amount <= 1.89)
                                total = amount * 1241.14;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1056.38;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1041.27;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1036.97;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1034.20;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1029.65;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1026.25;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1023.65;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1022.67;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1020.39;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1019.84;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1013.94;
                            if (amount > 63)
                                total = amount * 973.59;
                        }
                        else {
                            if (amount <= 1.89)
                                total = amount * 1271.74;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1086.98;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1071.87;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1067.57;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1064.80;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1060.25;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1056.85;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1054.25;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1053.27;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1050.99;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1050.44;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1044.54;
                            if (amount > 63)
                                total = amount * 1004.19;
                        }
                        break;

                    case "JMP Net":
                        if (HomeCheck == true) {
                            if (amount <= 1.89)
                                total = amount * 1283.56;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1109.19;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1086.17;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1071.45;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1063.81;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1053.32;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1045.41;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1038.54;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1033.17;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1028.42;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1023.12;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1018.34;
                            if (amount > 63)
                                total = amount * 974.41;
                        }
                        else {
                            if (amount <= 1.89)
                                total = amount * 1314.16;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1139.79;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1116.77;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1102.05;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1094.41;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1083.92;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1076.01;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1069.14;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1063.77;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1059.02;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1053.72;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1048.94;
                            if (amount > 63)
                                total = amount * 1005.01;
                        }
                        break;
                    case "VČP Net":
                        if (HomeCheck == true) {
                            if (amount <= 1.89)
                                total = amount * 1283.56;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1109.19;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1086.17;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1071.45;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1063.81;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1053.32;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1045.41;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1038.54;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1033.17;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1028.42;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1023.12;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1018.34;
                            if (amount > 63)
                                total = amount * 974.41;
                        }
                        else {
                            if (amount <= 1.89)
                                total = amount * 1314.16;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1139.79;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1116.77;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1102.05;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1094.41;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1083.92;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1076.01;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1069.14;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1063.77;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1059.02;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1053.72;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1048.94;
                            if (amount > 63)
                                total = amount * 1005.01;
                        }
                        break;
                    case "SMP Net":
                        if (HomeCheck == true) {
                            if (amount <= 1.89)
                                total = amount * 1283.56;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1109.19;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1086.17;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1071.45;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1063.81;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1053.32;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1045.41;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1038.54;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1033.17;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1028.42;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1023.12;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1018.34;
                            if (amount > 63)
                                total = amount * 974.41;
                        }
                        else {
                            if (amount <= 1.89)
                                total = amount * 1314.16;
                            if (amount > 1.89 && amount <= 7.56)
                                total = amount * 1139.79;
                            if (amount > 7.56 && amount <= 15)
                                total = amount * 1116.77;
                            if (amount > 15 && amount <= 20)
                                total = amount * 1102.05;
                            if (amount > 20 && amount <= 25)
                                total = amount * 1094.41;
                            if (amount > 25 && amount <= 30)
                                total = amount * 1083.92;
                            if (amount > 30 && amount <= 35)
                                total = amount * 1076.01;
                            if (amount > 35 && amount <= 40)
                                total = amount * 1069.14;
                            if (amount > 40 && amount <= 45)
                                total = amount * 1063.77;
                            if (amount > 45 && amount <= 50)
                                total = amount * 1059.02;
                            if (amount > 50 && amount <= 55)
                                total = amount * 1053.72;
                            if (amount > 55 && amount <= 63)
                                total = amount * 1048.94;
                            if (amount > 63)
                                total = amount * 1005.01;
                        }
                        break;
                    default:
                        success = false;
                        break;
                }
                if (success) {
                    if (Period == "Měsíčně") {
                        total = parseInt(total / 12);
                    }
                    else if (Period == "Čtvrtletně") {
                        total = parseInt(total / 4);
                    }
                    total = (Math.round(total / 100) * 100) + 100;
                    Xrm.Page.getAttribute(XRM.Variables.AdvancePayment).setValue(total);
                }
            }
        },

        CalculateDepositElectricity: function (NewDistributor, SubscriptionAmountNT, SubscriptionAmountVT, DistributionRate, DepositAmount, Period) {

            if (NewDistributor != "" && DistributionRate != "" && Period != "" && (SubscriptionAmountNT != "" || SubscriptionAmountVT != "")) {
                var nt = SubscriptionAmountNT == "" ? 0 : parseFloat(SubscriptionAmountNT);
                var vt = SubscriptionAmountVT == "" ? 0 : parseFloat(SubscriptionAmountVT);
                var total = DepositAmount != "" ? parseInt(DepositAmount) : 0;
                var depositval = total;
                var success = true;
                switch (NewDistributor) {
                    case "PRE Distribuce":
                        switch (DistributionRate) {
                            case "C01d": total = (vt * 5052.14); break;
                            case "C02d": total = (vt * 4402.28); break;
                            case "C03d": total = (vt * 3233.97); break;
                            case "C25d": total = (vt * 4361.11) + (nt * 1893.81); break;
                            case "C26d": total = (vt * 3452.90) + (nt * 1893.81); break;
                            case "C35d": total = (vt * 3289.75) + (nt * 2174.81); break;
                            case "C45d": total = (vt * 2684.38) + (nt * 2242.81); break;
                            case "C55d": total = (vt * 2687.38) + (nt * 2262.81); break;
                            case "C56d": total = (vt * 2667.38) + (nt * 2262.81); break;
                            case "C62d": total = (vt * 2184.86); break;
                            case "D01d": total = (vt * 4211.90); break;
                            case "D02d": total = (vt * 3677.58); break;
                            case "D25d": total = (vt * 4071.09) + (nt * 1780.54); break;
                            case "D26d": total = (vt * 3095.97) + (nt * 1780.54); break;
                            case "D35d": total = (vt * 2752.93) + (nt * 2023.54); break;
                            case "D45d": total = (vt * 2665.93) + (nt * 2160.54); break;
                            case "D55d": total = (vt * 2621.93) + (nt * 2181.54); break;
                            case "D56d": total = (vt * 2621.93) + (nt * 2181.54); break;
                            default:
                                success = false;
                                break;
                        }
                        break;
                    case "ČEZ Distribuce":
                        switch (DistributionRate) {
                            case "C01d": total = (vt * 4995.15); break;
                            case "C02d": total = (vt * 4436.59); break;
                            case "C03d": total = (vt * 3257.64); break;
                            case "C25d": total = (vt * 4321.91) + (nt * 1888.71); break;
                            case "C26d": total = (vt * 3640.21) + (nt * 1888.71); break;
                            case "C35d": total = (vt * 3358.66) + (nt * 2169.71); break;
                            case "C45d": total = (vt * 2712.30) + (nt * 2237.71); break;
                            case "C55d": total = (vt * 2695.30) + (nt * 2257.71); break;
                            case "C56d": total = (vt * 2695.30) + (nt * 2257.71); break;
                            case "C62d": total = (vt * 2219.45); break;
                            case "D01d": total = (vt * 4524.43); break;
                            case "D02d": total = (vt * 3882.31); break;
                            case "D25d": total = (vt * 4413.03) + (nt * 1792.41); break;
                            case "D26d": total = (vt * 3088.69) + (nt * 1792.41); break;
                            case "D35d": total = (vt * 2785.06) + (nt * 2035.41); break;
                            case "D45d": total = (vt * 2698.06) + (nt * 2172.41); break;
                            case "D55d": total = (vt * 2654.06) + (nt * 2193.41); break;
                            case "D56d": total = (vt * 2654.06) + (nt * 2193.41); break;
                            default:
                                success = false;
                                break;
                        }
                        break;
                    case "E.ON Distribuce":
                        switch (DistributionRate) {
                            case "C01d": total = (vt * 4932.80); break;
                            case "C02d": total = (vt * 4417.74); break;
                            case "C03d": total = (vt * 3287.24); break;
                            case "C25d": total = (vt * 4362.92) + (nt * 1899.08); break;
                            case "C26d": total = (vt * 3466.47) + (nt * 1899.08); break;
                            case "C35d": total = (vt * 3310.71) + (nt * 2180.08); break;
                            case "C45d": total = (vt * 2679.65) + (nt * 2248.08); break;
                            case "C55d": total = (vt * 2662.65) + (nt * 2268.08); break;
                            case "C56d": total = (vt * 2662.65) + (nt * 2268.08); break;
                            case "C62d": total = (vt * 2158.38); break;
                            case "D01d": total = (vt * 4157.15); break;
                            case "D02d": total = (vt * 3711.05); break;
                            case "D25d": total = (vt * 4118.47) + (nt * 1785.13); break;
                            case "D26d": total = (vt * 2987.13) + (nt * 1785.13); break;
                            case "D35d": total = (vt * 2751.01) + (nt * 2028.13); break;
                            case "D45d": total = (vt * 2664.01) + (nt * 2165.13); break;
                            case "D55d": total = (vt * 2620.01) + (nt * 2186.13); break;
                            case "D56d": total = (vt * 2620.01) + (nt * 2186.13); break;
                            default:
                                success = false;
                                break;
                        }
                        break;
                    default:
                        success = false;
                        break;
                }

                if (success) {
                    if (Period == "Měsíčně") {
                        total = parseInt(total / 12);
                    }
                    else if (Period == "Čtvrtletně") {
                        total = parseInt(total / 4);
                    }

                    total = (Math.round(total / 100) * 100) + 100;
                    Xrm.Page.getAttribute(XRM.Variables.AdvancePayment).setValue(total);

                }
            }
        },

        IsValidEIC: function () {
            var EIC = Xrm.Page.getAttribute(XRM.Variables.EIC).getValue();
            var isValidEIC = true;
            if (EIC.length != 16)
                return false;
            else {
                var v1 = 16 * XRM.Funcs.Convertor(EIC.substring(0, 1));
                var v2 = 15 * XRM.Funcs.Convertor(EIC.substring(1, 2));
                var v3 = 14 * XRM.Funcs.Convertor(EIC.substring(2, 3));
                var v4 = 13 * XRM.Funcs.Convertor(EIC.substring(3, 4));
                var v5 = 12 * XRM.Funcs.Convertor(EIC.substring(4, 5));
                var v6 = 11 * XRM.Funcs.Convertor(EIC.substring(5, 6));
                var v7 = 10 * XRM.Funcs.Convertor(EIC.substring(6, 7));
                var v8 = 9 * XRM.Funcs.Convertor(EIC.substring(7, 8));
                var v9 = 8 * XRM.Funcs.Convertor(EIC.substring(8, 9));
                var v10 = 7 * XRM.Funcs.Convertor(EIC.substring(9, 10));
                var v11 = 6 * XRM.Funcs.Convertor(EIC.substring(10, 11));
                var v12 = 5 * XRM.Funcs.Convertor(EIC.substring(11, 12));
                var v13 = 4 * XRM.Funcs.Convertor(EIC.substring(12, 13));
                var v14 = 3 * XRM.Funcs.Convertor(EIC.substring(13, 14));
                var v15 = 2 * XRM.Funcs.Convertor(EIC.substring(14, 15));
                var v16_control = XRM.Funcs.Convertor(EIC.substring(15, 16));
                var controlAdd = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10 + v11 + v12 + v13 + v14 + v15;
                var modulo = 37 - (controlAdd % 37);
                if (modulo == 37) modulo = 0;
                if (v16_control != modulo) isValidEIC = false;
                //if (EIC.substring(0, 4) != "27ZG") isValidEIC = false;
            }
            return isValidEIC;
        },

        IsValidEAN: function () {
            var EAN = Xrm.Page.getAttribute(XRM.Variables.EAN).getValue();
            var isValidEAN = true;
            console.log(EAN);
            if (EAN.length != 18) {
                isValidEAN = false;
            }
            else {
                var ean1 = 3 * EAN.substring(0, 1);
                var ean2 = 1 * EAN.substring(1, 2);
                var ean3 = 3 * EAN.substring(2, 3);
                var ean4 = 1 * EAN.substring(3, 4);
                var ean5 = 3 * EAN.substring(4, 5);
                var ean6 = 1 * EAN.substring(5, 6);
                var ean7 = 3 * EAN.substring(6, 7);
                var ean8 = 1 * EAN.substring(7, 8);
                var ean9 = 3 * EAN.substring(8, 9);
                var ean10 = 1 * EAN.substring(9, 10);
                var ean11 = 3 * EAN.substring(10, 11);
                var ean12 = 1 * EAN.substring(11, 12);
                var ean13 = 3 * EAN.substring(12, 13);
                var ean14 = 1 * EAN.substring(13, 14);
                var ean15 = 3 * EAN.substring(14, 15);
                var ean16 = 1 * EAN.substring(15, 16);
                var ean17 = 3 * EAN.substring(16, 17);
                var ean18_control = 1 * EAN.substring(17, 18);
                var eanmod = ean1 + ean2 + ean3 + ean4 + ean5 + ean6 + ean7 + ean8 + ean9 + ean10 + ean11 + ean12 + ean13 + ean14 + ean15 + ean16 + ean17;
                var eanmod1 = 10 - (eanmod % 10);
                if (eanmod1 == 10) eanmod1 = 0;
                if (ean18_control != eanmod1) isValidEAN = false;
                // if (EAN.substring(0, 9) != "859182400") isValidEAN = false;
            }

            return isValidEAN;
        },

        Convertor: function (value) {
            if (value == 0) return 0;
            if (value == 1) return 1;
            if (value == 2) return 2;
            if (value == 3) return 3;
            if (value == 4) return 4;
            if (value == 5) return 5;
            if (value == 6) return 6;
            if (value == 7) return 7;
            if (value == 8) return 8;
            if (value == 9) return 9;
            if (value == "A") return 10;
            if (value == "B") return 11;
            if (value == "C") return 12;
            if (value == "D") return 13;
            if (value == "E") return 14;
            if (value == "F") return 15;
            if (value == "G") return 16;
            if (value == "H") return 17;
            if (value == "I") return 18;
            if (value == "J") return 19;
            if (value == "K") return 20;
            if (value == "L") return 21;
            if (value == "M") return 22;
            if (value == "N") return 23;
            if (value == "O") return 24;
            if (value == "P") return 25;
            if (value == "Q") return 26;
            if (value == "R") return 27;
            if (value == "S") return 28;
            if (value == "T") return 29;
            if (value == "U") return 30;
            if (value == "V") return 31;
            if (value == "W") return 32;
            if (value == "X") return 33;
            if (value == "Y") return 34;
            if (value == "Z") return 35;
            if (value == "-") return 36;
        },

        CheckExistsEANEICCode: function () {
            var ean = Xrm.Page.getAttribute(XRM.Variables.EAN).getValue();
            var eic = Xrm.Page.getAttribute(XRM.Variables.EIC).getValue();
            if (ean != null && ean != "") {
                REST.RetrieveMultiple("cre_supplypointSet", "?$filter=cre_eanopm eq '" + ean + "'&$top=2", true, function (result) {
                    if (result)
                        if (result.length > 1)
                            //alert("Poznámka:\nEAN OPM kód odberného místa již v systému existuje.");
                            Xrm.Page.ui.setFormNotification("Poznámka:\nEAN OPM kód odberného místa již v systému existuje.", 'WARNING', '1');
                });
            }
            else if (eic != null && eic != "") {
                REST.RetrieveMultiple("cre_supplypointSet", "?$filter=cre_eic eq '" + eic + "'&$top=2", true, function (result) {
                    if (result)
                        if (result.length > 1)
                            //alert("Poznámka:\nEIC kód odberného místa již v systému existuje.");
                            Xrm.Page.ui.setFormNotification("Poznámka:\n EIC kód odberného místa již v systému existuje.", 'WARNING', '1');

                });
            }
        },

        IsValidEmail: function () {
            var email = Xrm.Page.getAttribute(XRM.Variables.Email).getValue();
            var isValidEmail = true;
            if (email == null || email == "") {
                isValidEmail = false;
            }
            else {
                var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                if (reg.test(email)) {
                    isValidEmail = true;
                }
                else {
                    isValidEmail = false;
                }
            }
            return isValidEmail;

        },

        IsValidSIPO: function (sipo) {
            var sipoArray = [3, 7, 3, 1, 7, 3, 1, 7, 3, 1];
            var sum = 0;
            for (var i = 0; i < sipoArray.length; i++)
                sum += parseInt(sipo.charAt(i)) * sipoArray[i];
            var result = sum % 10;
            if (result == 0)
                return true;
            else if (result.toString().substring(0, 1) == sipo.charAt(sipo.length - 1))
                return true;
            else
                return false;
        },

        IsValidDate: function (date) {
            if (date.length == 8) {
                var day = parseInt(date.substring(0, 2), 10);
                var month = parseInt(date.substring(2, 4), 10);
                var year = date.substring(4, 8);
                if (day > 31 || day < 1 || month > 12 || month < 1 || year < 1900)
                    return false;
                else
                    return true;
            }
            else
                return false;
        },

        Is18YearsOld: function (date) {

            var BirthDayticks = date.getTime();
            var currentDayTicks = new Date().getTime();
            if (currentDayTicks <= BirthDayticks)
            { return false; }


            var diffTicks = currentDayTicks - BirthDayticks;
            var Days = Math.floor(diffTicks / (24 * 60 * 60 * 1000));
            var Year = Math.floor(Days / 365.25);
            if (Year >= 18) return true;
            else return false;

        },

        IsValidBasic: function (basic) {
            var basicArray = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
            var sum = 0;
            for (var i = 1; i <= basic.length; i++)
                sum += (parseInt(basic.charAt(basic.length - i)) * basicArray[basicArray.length - i]);
            return (sum % 11 == 0);
        },

        IsValidPrefix: function (prefix) {
            var prefixArray = [10, 5, 8, 4, 2, 1];
            var sum = 0;
            for (var i = 1; i <= prefix.length; i++)
                sum += (parseInt(prefix.chartAt(prefix.length - i)) * prefixArray[prefixArray.length - i]);
            return (sum % 11 == 0);
        },

        IsValidAccountNumber: function () {
            //var paymentType = Xrm.Page.getAttribute(XRM.Variables.PaymentType).getValue();
            //var accountBank = Xrm.Page.getAttribute(XRM.Variables.AccountBank).getValue();
            //var accountNumber1 = Xrm.Page.getAttribute(XRM.Variables.AccountNumber1).getValue();
            //var accountNumber2 = Xrm.Page.getAttribute(XRM.Variables.AccountNumber2).getValue();
            //var isValidAccountnumber = true;
            ////Inkasem
            //if (paymentType == 171140001) {
            //    if (accountBank == null || accountBank == "" || accountNumber1 == null || accountNumber1 == "" || accountNumber2 == null || accountNumber2 == "") {
            //        isValidAccountnumber = false;
            //    }
            //}
            //return isValidAccountnumber;
        },

        IsValidContractTerm: function () {
            var fromContractTerm = Xrm.Page.getAttribute(XRM.Variables.ContractFromTerm).getValue();
            var toContractTerm = Xrm.Page.getAttribute(XRM.Variables.ContractToTerm).getValue();
            var isValidContract = true;

            if (fromContractTerm == null || toContractTerm == null) {
                isValidContract = true;
            }
            else if (fromContractTerm.getTime() >= toContractTerm.getTime()) {
                isValidContract = false;
            }
            return isValidContract;
        },
        
        IsValidSupplierToMoveNext: function () {

            var iResult = true;
            if (Xrm.Page.getAttribute(XRM.Variables.SupplierResignationStatus).getValue() != 171140001) {
                Xrm.Page.ui.setFormNotification("Pro přechod do další fáze je nutné akceptovat výpověď.", "ERROR", "SupplierResignationStatusMessage");
                iResult = false;
            }
            else {
                Xrm.Page.ui.clearFormNotification("SupplierResignationStatusMessage");
            }
            return iResult;
        },

        ValidateNextClick: function () {
            var iValResult = true;
            if (XRM.Variables.CurrentStageValue == null || XRM.Variables.CurrentStageValue == "") {
                iValResult = false;
            }

                //Supplier to Distributor change
            else if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.SupplierStageName.toLowerCase()) {
                iValResult = XRM.Funcs.IsValidSupplierToMoveNext();
            }

                //Verification to Validation Change
            else if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.VerificationStageName.toLowerCase()) {

                if (Xrm.Page.getAttribute(XRM.Variables.VerificationIsReady).getValue() == false) {
                    Xrm.Page.ui.setFormNotification("Pro dokončení verifikace je nutné nastavit pole 'kompletní verifikace' na hodnotu ano.", "ERROR", "VerificationStatusMessage");
                    iValResult = false;
                }
                else {
                    var attributes = Xrm.Page.data.entity.attributes.get();

                    for (var i in attributes) {
                        var attribute = attributes[i];
                        var attrName = attribute.getName();
                        if (Xrm.Page.getControl(attrName) != null && Xrm.Page.getControl(attrName).get_errorNotification() != null) {
                            Xrm.Page.ui.setFormNotification("Nelze dokončit verifikaci, je nutné doplnit žádané údaje", "ERROR", "ValidationFailed");
                            iValResult = false;
                        }
                    }
                }
            }

                //Validation to Supplier Change
            else if (XRM.Variables.CurrentStageValue.toLowerCase() == XRM.Variables.ValidationStageName.toLowerCase()) {

                var attributes = Xrm.Page.data.entity.attributes.get();
                for (var i in attributes) {
                    var attribute = attributes[i];
                    var attrName = attribute.getName();
                    if (Xrm.Page.getControl(attrName) != null && Xrm.Page.getControl(attrName).get_errorNotification() != null) {
                        Xrm.Page.ui.setFormNotification("Nelze dokončit validaci, je nutné doplnit žádané údaje.", "ERROR", "ValidationFailed");
                        iValResult = false;
                    }
                }
            }
            return iValResult;
        }
    }
}

var $labels = $(".stageActionText");
$labels.click(
   function () {
       //var iResult = true;
       return XRM.Funcs.ValidateNextClick();
   });

function CustomerNotReachedClick() {
    XRM.Funcs.updateFormRecordVariables();
}

function OnCurrentStageChange() {
    Mscrm.ReadFormUtilities.openInSameFrame(window._etc, Xrm.Page.data.entity.getId());
}

function ContractCancelClick() {
    //
    $('body').append('<div id="box"><div id="contectid" class="content"><div><div>');
    $("#contectid").append('<h2>Výpověď Původnímu dodavateli</h2><form><div class="firstSelect"><select id="select1" name="ovoce"><option value="171 140 000"> Storno - Zamítnutý ZD/výpověď </option><option value="171140001"> Storno - Zamítnutá ZD/OTE </option><option value="171140002"> Storno - Odstoupení od smlouvy bez dodávky </option><option value="171140003"> Storno - Ukončení smlouvy na dodávce </option><option value="171140004"> Storno - Odstoupení z důvodu nevalidních dat </option><option value="171140005"> Storno - Odstoupení z důvodu duplicitní smlouvy </option><option value="171140006"> Storno - Ukončení z důvodu úmrtí </option><option value="171140007"> Storno - Ukončení z důvodu stěhování </option><option value="171140008"> Storno - Ukončení na základě podané výpovědi jiným dodavatelem </option><option value="171140009"> Storno - Odstoupení od nepodepsané smlouvy </option><option value="171140010"> Storno - podané obchodním zástupcem/neplatná smlouva </option><option value="171140011"> Storno - Ukončení smlouvy, OM ukradeno jiným dodavatelem </option></select></div></form><div id="sendResult"><b>OK</b></div>');

    var box = {
        "position": "absolute",
        "width": "100%",
        "height": "100%",
        "background": "url('https://vemexakvizice6.crm4.dynamics.com//WebResources/cre_white_bg') transparent"
    }
    $("#box").css(box);

    var box_h2 = {
        "margin": "15"
    }
    $("#box h2").css(box_h2);

    var box_content = {
        "width": "440px",
        "height": "170px",
        "background-color": "#fbfbfb",
        "padding": "20px",
        "border": "2px solid #98828e",
        "margin": "0 auto",
        "text-align": "center",
        "top": "10%",
        "position": "relative"
    }
    $("#box .content").css(box_content);

    var box_content_form_div = {
        "margin": "5px 0"
    }
    $("#box .content form div").css(box_content_form_div);

    var box_content_select2 = {
        "display": "none"
    }
    //$("#box .content #select2").css(box_content_select2);
    var box_content_sendResult = {

        "padding": "5px",
        "background-color": "#fbfbfb",
        "color": "black",
        "border": "2px solid #98828e",
        "margin": "20px 150px",
        "cursor": "pointer"
    }
    $("#box .content #sendResult").css(box_content_sendResult);

    var box = $("#box");
    $("#select1").change(function () {

    });

    $("#sendResult").click(function () {
        $("#sendResult").unbind("click");
        $("#select1").unbind("change");

        $("#box").hide();

        var entity = Xrm.Page.data.entity;
        var saveCancelReason = Xrm.Page.getAttribute(XRM.Variables.ReasonCancelContract); //Důvod storna
        saveCancelReason.setValue($("#select1").val());
        var status = Xrm.Page.getAttribute(XRM.Variables.VerifyFormValidateStatus); //Stav záznamu

        status.setValue(171140006); //Stornováno
        status.setSubmitMode("always");
        XRM.Variables.UpdateStage = "false";
        Xrm.Page.getAttribute(XRM.Variables.StageIdField).setSubmitMode("never");
        Xrm.Page.getAttribute(XRM.Variables.CurrentStageField).setValue(status.getText());
        entity.save("saveandclose");
    });
    //
}