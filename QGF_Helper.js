function GetRndInteger(min, max) {
	//Inclusive min, Inclusive max, swap values if min is bigger than max
	if (min > max) {
		return Math.floor(Math.random() * (min - max + 1)) + max;
	} else {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

function ToggleTab(tabContainer, tabTog) {
	if (tabIsVisible) {
		tabContainer.className = "qgf-hiddenTab";
		tabTog.innerHTML = "&#8249;";
	} else {
		tabContainer.className = "qgf-visibleTab";
		tabTog.innerHTML = "&#8250;";
	}
	tabIsVisible = !tabIsVisible;
}

function QGFLog(strtext) {
	console.log("QGF : " + strtext);
}
function AddOptions(selectionParent, addStart, addCount, defaultIndex = -1) {
	let noneVal = document.createElement("option");
	noneVal.value = -1;
	noneVal.textContent = "None";
	selectionParent.appendChild(noneVal);

	for (let x = addStart; x <= addCount; x++) {
		let tempOpt = document.createElement("option");
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
