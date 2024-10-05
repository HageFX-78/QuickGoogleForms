// ==UserScript==
// @name         Quick Google Forms
// @namespace    https://github.com/HageFX-78
// @version      0.3.1
// @description  Google forms quick selector and filler
// @author       HageFX78
// @match        https://forms.gle/*
// @match        https://docs.google.com/forms/d/e/*/viewform
// @match        https://docs.google.com/forms/d/e/*/viewform*
// @match        https://docs.google.com/forms/d/e/*/formResponse
// @match        https://docs.google.com/forms/u/0/d/e/*/formResponse
// @match        https://forms.gle/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @resource     CSSImport file://c:\Users\user\Desktop\CodeStuff\Userscript\QuickGoogleForms\Style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL  https://github.com/HageFX-78/QuickGoogleForms/raw/main/QuickGoogleForms.user.js
// @updateURL    https://github.com/HageFX-78/QuickGoogleForms/raw/main/QuickGoogleForms.user.js
// @require      file://c:\Users\user\Desktop\CodeStuff\Userscript\QuickGoogleForms\QGF_UiBuilder.js
// @require      file://c:\Users\user\Desktop\CodeStuff\Userscript\QuickGoogleForms\QGF_Helper.js
// ==/UserScript==

if (window.trustedTypes && window.trustedTypes.createPolicy) {
	window.trustedTypes.createPolicy("default", {
		createHTML: (string, sink) => string,
	});
}
const css_Style = GM_getResourceText("CSSImport");
GM_addStyle(css_Style);

// Main script
window.addEventListener("load", function () {
	"use strict";

	var tabIsVisible = true;

	var LinearMap = [];
	var RadioMap = [];
	var RadioGridMap = [];
	var NormCheckboxMap = [];
	var CheckboxGridMap = [];
	var ShortTextMap = [];
	var LongTextMap = [];

	// Special Global References
	var selectionDropDownStart;
	var selectionDropDownEnd;
	// - - - - - - -  Main Function bindings
	function HandleFillAllButton() {
		document.getElementById("qgf-mainFillBtn").onclick = function () {
			// Fill all fields with default values
			DefaultAll();
		};
	}

	//--------------------------------------------------------------- Main Functions ---------------------------------------------------------------

	// - - - - - - -  Find Categorize Elements
	function CategorizeElements() {
		let AllRadioGroup = document.querySelectorAll(
			'div[role="radiogroup"]:not([aria-label]) > span'
		);
		let RadioGridGroupRaw = document.querySelectorAll(
			'div[role="radiogroup"][aria-label]'
		);
		let CheckerGroup = document.querySelectorAll(
			'div[role="list"][aria-labelledby]'
		);
		let CheckGridGroupRaw = document.querySelectorAll('div[role="group"]');

		let ShortTextGroup = document.querySelectorAll(
			'input[type="text"]:not([role])'
		);
		let LongTextGroup = document.querySelectorAll("textarea");

		//Identify radio group type, linear likert scale and normal radio selection
		for (let x = 0; x < AllRadioGroup.length; x++) {
			if (AllRadioGroup[x].children.length == 2) {
				let temp = AllRadioGroup[x].querySelectorAll(
					'div[role="radio"][aria-label]'
				);
				LinearMap.push(temp);
			} else if (AllRadioGroup[x].children.length == 1) {
				let temp = AllRadioGroup[x].querySelectorAll(
					'div[role="radio"][aria-label]'
				);
				RadioMap.push(temp);
			}
		}

		//Normal checkbox
		for (let x = 0; x < CheckerGroup.length; x++) {
			let temp = CheckerGroup[x].querySelectorAll('div[role="checkbox"]');
			if (temp.length > 0) {
				NormCheckboxMap.push(temp);
			}
		}

		//Radio grid
		if (RadioGridGroupRaw.length > 0) {
			let RadioRawTemp = [];
			let CacheLabelRadio =
				RadioGridGroupRaw[0].getAttribute("aria-describedby");
			for (let x = 0; x < RadioGridGroupRaw.length; x++) {
				if (
					RadioGridGroupRaw[x].getAttribute("aria-describedby") ==
					CacheLabelRadio
				) {
					RadioRawTemp.push(RadioGridGroupRaw[x]);
				} else {
					RadioGridMap.push(RadioRawTemp);
					RadioRawTemp = [];
					CacheLabelRadio =
						RadioGridGroupRaw[x].getAttribute("aria-describedby");
					RadioRawTemp.push(RadioGridGroupRaw[x]);
				}

				if (x === RadioGridGroupRaw.length - 1) {
					RadioGridMap.push(RadioRawTemp);
				}
			}
		}

		//Checkbox grid, group from the grid rows instead of parent as it has no distinguising data-value
		if (CheckGridGroupRaw.length > 0) {
			let CheckRawTemp = [];
			let CacheLabelCheckbox =
				CheckGridGroupRaw[0].getAttribute("aria-describedby");
			for (let x = 0; x < CheckGridGroupRaw.length; x++) {
				if (
					CheckGridGroupRaw[x].getAttribute("aria-describedby") ==
					CacheLabelCheckbox
				) {
					CheckRawTemp.push(CheckGridGroupRaw[x]);
				} else {
					CheckboxGridMap.push(CheckRawTemp);
					CheckRawTemp = [];
					CacheLabelCheckbox =
						CheckGridGroupRaw[x].getAttribute("aria-describedby");
					CheckRawTemp.push(CheckGridGroupRaw[x]);
				}

				if (x === CheckGridGroupRaw.length - 1) {
					CheckboxGridMap.push(CheckRawTemp);
				}
			}
		}

		//Short text reference
		ShortTextMap = ShortTextGroup;
		LongTextMap = LongTextGroup;

		QGFLog("Elements Categorized");
	}

	// - - - - - - - Core Functions
	function LinearScaleRadioSelect(
		selSingle = 3,
		selRangeStart = -1,
		selRangeEnd = -1,
		randomizeBool = true
	) {
		for (let y = 0; y < LinearMap.length; y++) {
			let hasSelected = false;
			let finalSelection = -1;

			if (randomizeBool) {
				if (selRangeStart >= 0 && selRangeEnd >= 0) {
					finalSelection =
						GetRndInteger(selRangeStart, selRangeEnd) - 1; //Offset from selected values -1
				} else {
					finalSelection = GetRndInteger(0, LinearMap[y].length - 1);
				}
			} else {
				finalSelection = selSingle - 1; //Offset similar to selected -1
			}
			// Special case where likert scale has 0, so remove offset of -1
			if (LinearMap[y][0].getAttribute("data-value") == "0") {
				finalSelection++;
			}
			for (let sel = 0; sel < LinearMap[y].length; sel++) {
				if (sel == finalSelection) {
					if (
						LinearMap[y][sel].getAttribute("aria-checked") ==
						"false"
					) {
						//Attribute uses string hence string false
						LinearMap[y][sel].click();
					}
					hasSelected = true;
				}
			}

			//Defaults to final item in the question
			if (
				!hasSelected &&
				LinearMap[y][LinearMap[y].length - 1].getAttribute(
					"aria-checked"
				) == "false"
			) {
				LinearMap[y][LinearMap[y].length - 1].click();
			}
		}
	}

	function NormalRadioSelect() {
		for (let y = 0; y < RadioMap.length; y++) {
			let hasSelected = false;
			let finalSelection = GetRndInteger(0, RadioMap[y].length - 1);
			for (let sel = 0; sel < RadioMap[y].length; sel++) {
				if (sel == finalSelection) {
					if (
						RadioMap[y][sel].getAttribute("aria-checked") == "false"
					) {
						//Attribute uses string hence string false
						RadioMap[y][sel].click();
					}
					hasSelected = true;
				}
			}
		}
	}

	function NormalCheckboxSelect() {
		for (let x = 0; x < NormCheckboxMap.length; x++) {
			// Collection of questions

			let hasCheckedOnce = false;

			for (let y = 0; y < NormCheckboxMap[x].length; y++) {
				//Selections of each questions
				if (GetRndInteger(0, 1) == 0) {
					NormCheckboxMap[x][y].click();
				}

				if (
					NormCheckboxMap[x][y].getAttribute("aria-checked") == "true"
				) {
					hasCheckedOnce = true;
				}
			}

			if (!hasCheckedOnce) {
				// If no selection is checked default to 1 random selection
				NormCheckboxMap[x][
					GetRndInteger(0, NormCheckboxMap[x].length - 1)
				].click();
			}
		}
	}

	function DefaultAll() {
		LinearScaleRadioSelect();
		NormalRadioSelect();
		NormalCheckboxSelect();
		QGFLog("Filled with defaults");
	}

	// ---------- Main Flow ---------------------
	CategorizeElements();
	CreateUI();
	HandleFillAllButton();
});
