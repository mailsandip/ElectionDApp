sap.ui.define([
	"sap/ui/core/mvc/XMLView"
], function (XMLView) {
	"use strict";

	XMLView.create({
		viewName: "com.sam.voting.view.App"
	}).then(function (oView) {
		oView.placeAt("content");
		

	});	

});