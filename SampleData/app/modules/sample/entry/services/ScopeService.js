angular.module("mainApp")
.factory("ScopeService", function () {
    var scope = {};
    scope.Counter = 0;
    return {
        setScope: function (scopeReceived) {
            scope = scopeReceived;
        },
        getScope: function () {
            return scope;
        },
        setSamples: function (samples) {
            scope.Samples = samples
        },
        setSample: function (sample, account, messages) {
            scope.Sample = sample;
        },
        setAccounts: function (accounts) {
            scope.Accounts = accounts;
        },
        setAccount: function (account) {
            scope.Account = account;
        },
        setTopSoils: function (topsoils) {
            scope.TopSoils = topSoils;
        },
        setSampleChains: function (sampleChains) {
            scope.SampleChains = sampleChains;
        },
        setSampleChain: function (sampleChain) {
            scope.SampleChain = sampleChain;
            scope.rightSide = true;
            scope.soilView = true;
        },
        setSampleChainVars: function (chkTopSoil, sampleChainLink, chkLinkToSoil) {
            scope.chkTopSoil = chkTopSoil;
            scope.sampleChainLink = sampleChainLink;
            scope.chkLinkToSoil = chkLinkToSoil;
        },
        setRecommendations: function (recommendations) {
            scope.Recommendations = recommendations;
        },
        setCounter: function (counter) {
            scope.Counter = counter;
        }
    }
});