(function () {
    'use strict';

    angular.module('sampleEntryApp')
        //.constant('Sample', {
        //    SampleTypeNumber: '',
        //    AccountNumber: '',
        //    BatchNumber: '',
        //    LabNumber: '',
        //    InvoiceNumber: '',
        //    Grower: '',
        //    DateReceived: '',
        //    DateReported: '',
        //    CostTypeNumber: '',
        //    ReportTypeNumber: '',
        //    ReportCost: '',
        //    ReportName: '',
        //    SampleID1: '',
        //    SampleID2: '',
        //    SampleID3: '',
        //    SampleID4: '',
        //    SampleID5: ''
        //})
        //.constant('Account', {
        //    Name: '',
        //    Company: '',
        //    Address1: '',
        //    CityStZip: '',
        //    SampleEntryInformation: '',
        //    Growers: []
        //})
        .constant('Samples', [])
        .constant('Accounts', [])
        .constant('SampleColumns', [])
        .constant('SampleTypes', [])        
        .constant('CropTypes', [])
        .constant('RecTypes', [])
        .constant('PastCrops', [])
        .constant('TopSoils', [])
        .constant('Recommendations', [])
        .constant('SampleChains', [])
        .constant('Messages', [])
        .constant('SubSampleTypes')
        .constant('SubSubSampleTypes')
})