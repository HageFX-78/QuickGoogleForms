// ==UserScript==
// @name         QuickGoogleForms
// @namespace    https://github.com/HageFX-78
// @version      0.2.1
// @description  Google forms quick selector and filler
// @author       HageFX78
// @match        https://docs.google.com/forms/d/e/*/viewform*
// @match        https://docs.google.com/forms/d/e/*/formResponse
// @match        https://docs.google.com/forms/u/0/d/e/*/formResponse
// @match        https://forms.gle/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL  https://github.com/HageFX-78/QuickGoogleForms/raw/main/QuickGoogleForms.user.js
// @updateURL    https://github.com/HageFX-78/QuickGoogleForms/raw/main/QuickGoogleForms.user.js
// ==/UserScript==

GM_addStyle(`
#qgf-tabContainer{
    style : block;
    height : 70%;
    width: 24%;
    position: fixed;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    border-style: none;
    transition: right 0.3s ease;
}
#qgf-mainTab{
    top: 0;
    background-color: #2A3439; /* Black */
    overflow-x: hidden; /* Disable horizontal scroll */
    box-shadow: 0.1px 0.1px 2px #393E46;
    border-style: none;
    border-radius: 0px 0px 0px 10px;
    align-items: center;
    padding: 26px 36px 26px 26px;
    font-size: 14px;
    color: #EEEEEE;
    
}
.qgf-hiddenTab{
    right: -24.1%;
}
.qgf-visibleTab{
    right: 0;
}
#qgf-tabToggle{
    position: absolute;
    left: -14%;
    width: 10%;
    top: 0;
    height:10%;
    cursor: pointer;
    color: #EEEEEE;
    background-color: #2A3439; /* Black */
    padding: 8px;
    font-size: 36px;
    text-align: center;
    border-radius: 10px 0px 0px 10px;
}
#qgf-tabToggle:hover{
    background-color: #3b484f;
}
.qgf-sectionTitles{
    color: #EEEEEE;
    text-align: Left;
    padding: 6px;
    border-style: none none none solid;
    border-color: #00ADB5;
    border-width: 5px;
    background-color: rgb(0, 173, 181, 0.2);
    letter-spacing: 2px;
    width: 100%;
}
.qgf-section{
    margin: 16px 16px 24px 16px;
}
.qgf-selectionDropDown{
    padding: 8px 0px;
    font-size: 12px;
    font-family: 'Roboto';
    font-weight: 2px;
    color: #EEEEEE;
    background-color: #00ADB5;
    text-align: center;
    border-style: none;
    margin: 0px 12px 0px 12px;
    border-radius: 2px;
}
.qgf-resetDropDown{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%; /* Make it round */
    background-color: #00ADB5;
    box-shadow: 0.01px 0.01px 5px #393E46;
}
.qgf-resetDropDown:hover{
    cursor: pointer;
    background-color: #3b484f;
    box-shadow: -0.01px -0.01px 5px #393E46;
}

.qgf-finalSelBtn {
    style: block;
    padding: 5px 10px 5px 10px;
    background-color: #00ADB5;
    width: 100%;
    border-style: none;
    border-radius: 2px;
    text-align: center;
    box-shadow: 0.01px 0.01px 5px #393E46;
    letter-spacing: 0px;
    margin: 10px 0 0 0;
}
.qgf-finalSelBtn:hover{
    color: #EEEEEE;
    background-color: #3b484f;
    cursor: pointer;
    box-shadow: -0.01px -0.01px 5px #393E46;
}

` );

window.addEventListener('load', function () {
    'use strict';

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

    // - - - - - -General Functions
    function GetRndInteger(min, max) {
        //Inclusive min, Inclusive max, swap values if min is bigger than max
        if (min > max) {
            return Math.floor(Math.random() * (min - max + 1)) + max;
        }
        else {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    function ToggleTab(tabContainer, tabTog) {
        if (tabIsVisible) {
            tabContainer.className = "qgf-hiddenTab";
            tabTog.innerHTML = "&#8249;";
        }
        else {
            tabContainer.className = "qgf-visibleTab";
            tabTog.innerHTML = "&#8250;";
        }
        tabIsVisible = !tabIsVisible;
    }

    function CreateUI() {
        let invTabContainer = document.createElement('div');
        invTabContainer.id = "qgf-tabContainer";
        invTabContainer.className = "qgf-visibleTab";

        let mainTab = document.createElement('div');
        mainTab.id = "qgf-mainTab";

        let tabToggle = document.createElement('span');
        tabToggle.id = "qgf-tabToggle";
        tabToggle.innerHTML = "&#8250;";
        tabToggle.onclick = () => { ToggleTab(invTabContainer, tabToggle); };


        // > > > > > > > > > Default ALL > > > > > > > > > > > > > > >
        let qgfSection0 = document.createElement('div');
        qgfSection0.className = "qgf-section";

        let secTitle0 = document.createElement('div');
        secTitle0.className = "qgf-sectionTitles";
        secTitle0.innerHTML = "Fill with Default Settings";

        let defaultBtn = document.createElement('div');
        defaultBtn.className = "qgf-finalSelBtn";
        defaultBtn.innerHTML = " Fill ";
        defaultBtn.onclick = () => { DefaultAll(); }

        // > > > > > > > > > Radio linear likert section > > > > > > > > > > > > > > >
        let qgfSection1 = document.createElement('div');
        qgfSection1.className = "qgf-section";

        let secTitle1 = document.createElement('div');
        secTitle1.className = "qgf-sectionTitles";
        secTitle1.innerHTML = "Linear Scale Select";

        let rangeText = document.createElement('span');
        rangeText.innerHTML = "Range : &nbsp"

        selectionDropDownStart = document.createElement('select');
        selectionDropDownStart.className = "qgf-selectionDropDown";

        let spacing = document.createElement('span');
        spacing.innerHTML = "&nbsp - &nbsp";

        selectionDropDownEnd = document.createElement('select');
        selectionDropDownEnd.className = "qgf-selectionDropDown";

        let resetDropDown = document.createElement('span');
        resetDropDown.className = "qgf-resetDropDown";
        resetDropDown.innerHTML = "&#8634";
        resetDropDown.onclick = () => { ResetLinearOptions(selectionDropDownStart, selectionDropDownEnd, 1, 5); };

        let linearSelectRadioBtn = document.createElement('div');
        linearSelectRadioBtn.className = "qgf-finalSelBtn";
        linearSelectRadioBtn.innerHTML = " Select ";
        linearSelectRadioBtn.onclick = () => {
            LinearScaleRadioSelect(
                -1,
                parseInt(selectionDropDownStart.value),
                parseInt(selectionDropDownEnd.value),
                true);
        }
        //linearSelectRadioBtn.onclick = () => {LinearScaleRadioSelect(...[, , , true]);}
        // < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <

        // > > > > > > > > > Radio normal section > > > > > > > > > > > > > > >
        let qgfSection2 = document.createElement('div');
        qgfSection2.className = "qgf-section";

        let secTitle2 = document.createElement('div');
        secTitle2.className = "qgf-sectionTitles";
        secTitle2.innerHTML = "Radio Select";

        let radioSelectRandomizeBtn = document.createElement('div');
        radioSelectRandomizeBtn.className = "qgf-finalSelBtn";
        radioSelectRandomizeBtn.innerHTML = "Randomize";
        radioSelectRandomizeBtn.onclick = () => { NormalRadioSelect() };
        // < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <

        // > > > > > > > > > Radio normal section > > > > > > > > > > > > > > >
        let qgfSection3 = document.createElement('div');
        qgfSection3.className = "qgf-section";

        let secTitle3 = document.createElement('div');
        secTitle3.className = "qgf-sectionTitles";
        secTitle3.innerHTML = "Checkbox";

        let normalCheckboxRandomizeBtn = document.createElement('div');
        normalCheckboxRandomizeBtn.className = "qgf-finalSelBtn";
        normalCheckboxRandomizeBtn.innerHTML = "Randomize";
        normalCheckboxRandomizeBtn.onclick = () => { NormalCheckboxSelect() };
        // < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <
        //HTML injecton
        //document.body.appendChild(mainTab);
        document.body.appendChild(invTabContainer);

        invTabContainer.appendChild(tabToggle);
        invTabContainer.appendChild(mainTab);

        mainTab.appendChild(secTitle0);
        mainTab.appendChild(qgfSection0);
        mainTab.appendChild(secTitle1);
        mainTab.appendChild(qgfSection1);
        mainTab.appendChild(secTitle2);
        mainTab.appendChild(qgfSection2);
        mainTab.appendChild(secTitle3);
        mainTab.appendChild(qgfSection3);

        //Section 0
        qgfSection0.appendChild(defaultBtn);

        //Section 1
        qgfSection1.appendChild(rangeText);
        qgfSection1.appendChild(selectionDropDownStart);
        AddOptions(selectionDropDownStart, 0, 10, 1);
        qgfSection1.appendChild(spacing);
        qgfSection1.appendChild(selectionDropDownEnd);
        AddOptions(selectionDropDownEnd, 0, 10, 5);
        qgfSection1.appendChild(selectionDropDownEnd);
        qgfSection1.appendChild(resetDropDown);
        qgfSection1.appendChild(linearSelectRadioBtn);

        //Section 2
        qgfSection2.appendChild(radioSelectRandomizeBtn);

        //Section 3
        qgfSection3.appendChild(normalCheckboxRandomizeBtn);

    }
    function AddOptions(selectionParent, addStart, addCount, defaultIndex = -1) {
        let noneVal = document.createElement('option');
        noneVal.value = -1;
        noneVal.textContent = "None";
        selectionParent.appendChild(noneVal);


        for (let x = addStart; x <= addCount; x++) {
            let tempOpt = document.createElement('option');
            tempOpt.value = x;
            tempOpt.textContent = x;

            selectionParent.appendChild(tempOpt);

            if (defaultIndex != -1 && x == defaultIndex) {
                tempOpt.selected = true;
            }
        }

    }
    function ResetLinearOptions(minDrop, maxDrop, defMin = 1, defMax = 5) {
        const optionToSelect = minDrop.querySelector(`option[value="${defMin}"]`);
        optionToSelect.selected = true;
        const optionToSelect2 = maxDrop.querySelector(`option[value="${defMax}"]`);
        optionToSelect2.selected = true;
    }
    // - - - - - - -  Find Categorize Elements
    function CategorizeElements() {
        let AllRadioGroup = document.querySelectorAll('div[role="radiogroup"]:not([aria-label]) > span');
        let RadioGridGroupRaw = document.querySelectorAll('div[role="radiogroup"][aria-label]');
        let CheckerGroup = document.querySelectorAll('div[role="list"][aria-labelledby]');
        let CheckGridGroupRaw = document.querySelectorAll('div[role="group"]');

        let ShortTextGroup = document.querySelectorAll('input[type="text"]:not([role])');
        let LongTextGroup = document.querySelectorAll('textarea');

        //Identify radio group type, linear likert scale and normal radio selection
        for (let x = 0; x < AllRadioGroup.length; x++) {
            if (AllRadioGroup[x].children.length == 2) {
                let temp = AllRadioGroup[x].querySelectorAll('div[role="radio"][aria-label]');
                LinearMap.push(temp);
            }
            else if (AllRadioGroup[x].children.length == 1) {
                let temp = AllRadioGroup[x].querySelectorAll('div[role="radio"][aria-label]');
                RadioMap.push(temp);
            }
        }

        //Radio grid
        let RadioRawTemp = [];
        let CacheLabelRadio = RadioGridGroupRaw[0].getAttribute("aria-describedby");
        for (let x = 0; x < RadioGridGroupRaw.length; x++) {

            if (RadioGridGroupRaw[x].getAttribute("aria-describedby") == CacheLabelRadio) {
                RadioRawTemp.push(RadioGridGroupRaw[x]);
            } else {
                RadioGridMap.push(RadioRawTemp);
                RadioRawTemp = [];
                CacheLabelRadio = RadioGridGroupRaw[x].getAttribute("aria-describedby");
                RadioRawTemp.push(RadioGridGroupRaw[x]);
            }

            if (x === RadioGridGroupRaw.length - 1) {
                RadioGridMap.push(RadioRawTemp);
            }
        }

        //Normal checkbox
        for (let x = 0; x < CheckerGroup.length; x++) {
            let temp = CheckerGroup[x].querySelectorAll('div[role="checkbox"]');
            if (temp.length > 0) {
                NormCheckboxMap.push(temp);
            }
        }

        //Checkbox grid, group from the grid rows instead of parent as it has no distinguising data-value
        let CheckRawTemp = [];
        let CacheLabelCheckbox = CheckGridGroupRaw[0].getAttribute("aria-describedby");
        for (let x = 0; x < CheckGridGroupRaw.length; x++) {

            if (CheckGridGroupRaw[x].getAttribute("aria-describedby") == CacheLabelCheckbox) {
                CheckRawTemp.push(CheckGridGroupRaw[x]);
            } else {
                CheckboxGridMap.push(CheckRawTemp);
                CheckRawTemp = [];
                CacheLabelCheckbox = CheckGridGroupRaw[x].getAttribute("aria-describedby");
                CheckRawTemp.push(CheckGridGroupRaw[x]);
            }

            if (x === CheckGridGroupRaw.length - 1) {
                CheckboxGridMap.push(CheckRawTemp);
            }
        }

        //Short text reference
        ShortTextMap = ShortTextGroup;
        LongTextMap = LongTextGroup;

    }
    // - - - - - - - Core Functions
    function LinearScaleRadioSelect(selSingle = 3, selRangeStart = -1, selRangeEnd = -1, randomizeBool = false) {

        for (let y = 0; y < LinearMap.length; y++) {

            let hasSelected = false;
            let finalSelection = -1;

            if (randomizeBool) {
                if (selRangeStart >= 0 && selRangeEnd >= 0) {
                    finalSelection = GetRndInteger(selRangeStart, selRangeEnd) - 1;//Offset from selected values -1
                }
                else {
                    finalSelection = GetRndInteger(0, LinearMap[y].length - 1);
                }
            }
            else {
                finalSelection = selSingle - 1;//Offset similar to selected -1
            }
            // Special case where likert scale has 0, so remove offset of -1
            if (LinearMap[y][0].getAttribute('data-value') == "0") {
                finalSelection++;
            }
            for (let sel = 0; sel < LinearMap[y].length; sel++) {
                if (sel == finalSelection) {
                    if (LinearMap[y][sel].getAttribute('aria-checked') == "false")//Attribute uses string hence string false
                    {
                        LinearMap[y][sel].click();
                    }
                    hasSelected = true;
                }
            }

            //Defaults to final item in the question
            if (!hasSelected && LinearMap[y][(LinearMap[y].length) - 1].getAttribute('aria-checked') == "false") {
                LinearMap[y][(LinearMap[y].length) - 1].click();
            }
        }
    }

    function NormalRadioSelect() {
        for (let y = 0; y < RadioMap.length; y++) {

            let hasSelected = false;
            let finalSelection = GetRndInteger(0, RadioMap[y].length - 1);
            for (let sel = 0; sel < RadioMap[y].length; sel++) {
                if (sel == finalSelection) {
                    if (RadioMap[y][sel].getAttribute('aria-checked') == "false")//Attribute uses string hence string false
                    {
                        RadioMap[y][sel].click();
                    }
                    hasSelected = true;
                }
            }
        }
    }

    function NormalCheckboxSelect() {
        for (let x = 0; x < NormCheckboxMap.length; x++) {// Collection of questions

            let hasCheckedOnce = false;

            for (let y = 0; y < NormCheckboxMap[x].length; y++) { //Selections of each questions
                if (GetRndInteger(0, 1) == 0) {
                    NormCheckboxMap[x][y].click();
                }

                if (NormCheckboxMap[x][y].getAttribute("aria-checked") == "true") {
                    hasCheckedOnce = true;
                }
            }

            if (!hasCheckedOnce) {// If no selection is checked default to 1 random selection
                NormCheckboxMap[x][GetRndInteger(0, NormCheckboxMap[x].length - 1)].click();
            }

        }
    }

    function DefaultAll() {
        LinearScaleRadioSelect(-1, parseInt(selectionDropDownStart.value), parseInt(selectionDropDownEnd.value), true);
        NormalRadioSelect();
        NormalCheckboxSelect();
    }

    CreateUI();
    CategorizeElements();
    //LinearScaleRadioSelect(...[, , , true]);

});
//alert('Ran script');
