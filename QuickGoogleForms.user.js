// ==UserScript==
// @name         QuickGoogleForms
// @namespace    https://github.com/HageFX-78
// @version      0.1.2
// @description  Google forms quick selector and filler
// @author       HageFX78
// @match        https://docs.google.com/forms/d/e/*/viewform
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      file:///C:\Users\user\Desktop\CodeStuff\Userscript\QuickGoogleForms\QuickGoogleForms.user.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

GM_addStyle(`

#qgf-mainTab{
    style : block;
    right:0;
    height : 50%;
    width: 20%;
    position: fixed;
    z-index: 1;
    top: 0;
    background-color: #2A3439; /* Black */
    overflow-x: hidden; /* Disable horizontal scroll */
    box-shadow: 0.1px 0.1px 2px #393E46;
    border-style: none;
    border-radius: 10px 0px 0px 10px;
    align-items: center;
    padding: 36px 36px 26px 26px;
    margin: 10% 0;
    font-size: 14px;
    color: #EEEEEE;
    overflow: hidden;
}
#qgf-tabToggle{
    position: absolute;
    left: 0px;
    top: 0;
    height:100%;
    cursor: pointer;
    color: #EEEEEE;
    background-color: #2A3439; /* Black */
    display: flex; /* Enable Flexbox */
    align-items: center;
    justify-content: center; /* Center horizontally */
    padding: 8px;
    font-size: 36px;
    text-align: center;
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

    var LinearMap = [];
    var RadioMap = [];
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

    function CreateUI() {
        let mainTab = document.createElement('div');
        mainTab.id = "qgf-mainTab";

        let tabToggle = document.createElement('span');
        tabToggle.id = "qgf-tabToggle";
        tabToggle.innerHTML = "&#8249;";
        
        // > > > > > > > > > Radio linear likert section > > > > > > > > > > > > > > >
        let qgfSection1 = document.createElement('div');
        qgfSection1.className = "qgf-section";

        let secTitle1 = document.createElement('div');
        secTitle1.className = "qgf-sectionTitles";
        secTitle1.innerHTML = "Linear Scale Select";

        let rangeText = document.createElement('span');
        rangeText.innerHTML = "Range : &nbsp"

        let selectionDropDownStart = document.createElement('select');
        selectionDropDownStart.className = "qgf-selectionDropDown";

        let spacing = document.createElement('span');
        spacing.innerHTML = "&nbsp - &nbsp";

        let selectionDropDownEnd = document.createElement('select');
        selectionDropDownEnd.className = "qgf-selectionDropDown";

        let resetDropDown = document.createElement('span');
        resetDropDown.className = "qgf-resetDropDown";
        resetDropDown.innerHTML = "&#8634";

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
        secTitle2.innerHTML = "Radio select Randomize";

        let radioSelectRandomizeBtn = document.createElement('div');
        radioSelectRandomizeBtn.className = "qgf-finalSelBtn";
        radioSelectRandomizeBtn.innerHTML = " Randomize ";
        radioSelectRandomizeBtn.onclick = () => {NormalRadioSelect()};
        // < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <
        //HTML injecton
        document.body.appendChild(mainTab);

        mainTab.appendChild(tabToggle);
        mainTab.appendChild(secTitle1);
        mainTab.appendChild(qgfSection1);
        mainTab.appendChild(secTitle2);
        mainTab.appendChild(qgfSection2);

        qgfSection1.appendChild(rangeText);
        qgfSection1.appendChild(selectionDropDownStart);
        AddOptions(selectionDropDownStart, 0, 10);
        qgfSection1.appendChild(spacing);
        qgfSection1.appendChild(selectionDropDownEnd);
        AddOptions(selectionDropDownEnd, 0, 10);
        qgfSection1.appendChild(selectionDropDownEnd);
        qgfSection1.appendChild(resetDropDown);
        qgfSection1.appendChild(linearSelectRadioBtn);


        qgfSection2.appendChild(radioSelectRandomizeBtn);

    }
    function AddOptions(selectionParent, addStart, addCount) {
        let noneVal = document.createElement('option');
        noneVal.value = -1;
        noneVal.textContent = "None";
        selectionParent.appendChild(noneVal);


        for (let x = addStart; x <= addCount; x++) {
            let tempOpt = document.createElement('option');
            tempOpt.value = x;
            tempOpt.textContent = x;
            selectionParent.appendChild(tempOpt);
        }

    }
    // - - - - - - -  Find Categorize Elements
    function CategorizeElements() {
        let AllRadioGroup = document.querySelectorAll('div[role="radiogroup"]:not([aria-label]) > span');

        //Identify radio group type, linear likert scale and normal radio selection
        for (let x = 0; x < AllRadioGroup.length; x++) {

            console.log("Found " + AllRadioGroup[x].children.length);
            if (AllRadioGroup[x].children.length == 2) {
                let temp = AllRadioGroup[x].querySelectorAll('div[role="radio"][aria-label]');
                LinearMap.push(temp);
            }
            else if (AllRadioGroup[x].children.length == 1) {
                let temp = AllRadioGroup[x].querySelectorAll('div[role="radio"][aria-label]');
                RadioMap.push(temp);
            }

        }
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

    CreateUI();
    CategorizeElements();
    //LinearScaleRadioSelect(...[, , , true]);


});