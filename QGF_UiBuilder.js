// Utility to convert HTML string into DOM elements
function createElementFromHTML(htmlString) {
	const template = document.createElement("template");
	template.innerHTML = htmlString.trim(); // Remove whitespace
	return template.content.firstChild;
}

// Template for the Addon Button
function getAddonButtonTemplate(count) {
	return `
    <div class="qgf-addonBtn" id-data="${count}" enabled="false">
        <div class="qgf-addonBtnText" style="display: none;">Add custom range</div>
        <div class="qgf-addonBtnIcon" style="background-color: #34cd4b;">+</div>
    </div>
	`;
}

// Template for the Block Addon
function getBlockAddonTemplate(count) {
	return `
    <div class="qgf-blockAddon" id-data="${count}">
        <!-- Addon content goes here -->
    </div>
	`;
}

// Main Tab Template
function getQGFMainTabTemplate(content) {
	return `
    <div id="qgf-mainTab">
        <div id="qgf-tabToggle">&#8250;</div>
        <div id="qgf-tabContent">
            ${content}
        </div>
    </div>
	`;
}

// Fill All Section Template
function getQGF_FillAllTemplate() {
	return `
	<div class="qgf-mainHeader">Quick Google Forms v0.3</div>
	<div class="qgf-counter">
		<div class="qgf-counterText">Questions on page : </div>
		<div class="qgf-counterValue">0</div>
	</div> 
	<div class="qgf-fillAllSection">
		<div class="qgf-sectionText">Fill with current settings</div>
		<div class="qgf-tabBtn" id="qgf-mainFillBtn">Fill All</div>
	</div>
	`;
}

// Collapsible Section Templates
function getQGF_CollapsibleTemplate(toggleBar, content) {
	return `
	<div class="qgf-collapsibleSection">
		${toggleBar}
		<div class="qgf-collapsibleContent" style="display: none;">
			${content}
		</div>
	</div>
	`;
}

function getQGF_CollapsibleToggleTemplate(sectionName) {
	return `
	<div class="qgf-collapsibleToggle">
		<div class="collapse_arrow">&#11208;</div>
		${sectionName}
	</div>
	`;
}

function getQGF_CollapsibleContentTemplate(content = "Default content") {
	return `<div>${content}</div>`;
}
//--------------------------------------------------------------- Main Functions ---------------------------------------------------------------
// Collapsible toggle functionality
function HandleCollapsibleToggle() {
	let allCollapsibleToggles = document.querySelectorAll(
		".qgf-collapsibleToggle"
	);
	allCollapsibleToggles.forEach((thisReference) => {
		thisReference.onclick = function () {
			const content = this.nextElementSibling;
			const arrow = this.querySelector(".collapse_arrow");

			if (content.style.display === "block") {
				content.style.display = "none";
				arrow.style.transform = "rotate(0deg)"; // Collapsed
			} else {
				content.style.display = "block";
				arrow.style.transform = "rotate(90deg)"; // Expanded
			}
		};
	});
}

// Addon Button logic
function handleAddonButtonClick(addonBtn, count) {
	addonBtn.onclick = function () {
		let isEnabled = this.getAttribute("enabled") === "true";
		let parent = this.closest("div[jsmodel][data-params]");

		if (!isEnabled) {
			// Append addon block
			parent.insertAdjacentHTML(
				"beforeend",
				getBlockAddonTemplate(count)
			);
			this.setAttribute("enabled", true);
			this.querySelector(".qgf-addonBtnText").innerHTML =
				"Remove custom range";
			this.querySelector(".qgf-addonBtnIcon").style.backgroundColor =
				"#ea4f24";
			this.querySelector(".qgf-addonBtnIcon").innerHTML = "-";
		} else {
			// Remove addon block
			parent.querySelector(".qgf-blockAddon").remove();
			this.setAttribute("enabled", false);
			this.querySelector(".qgf-addonBtnText").innerHTML =
				"Add custom range";
			this.querySelector(".qgf-addonBtnIcon").style.backgroundColor =
				"#34cd4b";
			this.querySelector(".qgf-addonBtnIcon").innerHTML = "+";
		}
	};

	// Show/hide text on hover
	addonBtn.onmouseover = () =>
		(addonBtn.querySelector(".qgf-addonBtnText").style.display = "block");
	addonBtn.onmouseout = () =>
		(addonBtn.querySelector(".qgf-addonBtnText").style.display = "none");
}

// Inject Addon Buttons into all question blocks
function InjectQuestionBlocks() {
	document
		.querySelectorAll("div[jsmodel][data-params]")
		.forEach((block, index) => {
			const container = block.children[0];
			container.style.position = "relative";
			const addonBtn = createElementFromHTML(
				getAddonButtonTemplate(index)
			);
			handleAddonButtonClick(addonBtn, index);
			container.appendChild(addonBtn);
		});
}

// Create UI function
function CreateUI() {
	// Fill all section
	let contentString = getQGF_FillAllTemplate();

	// Add collapsible section (this time append element directly)
	const collapsibleSection = createElementFromHTML(
		getQGF_CollapsibleTemplate(
			getQGF_CollapsibleToggleTemplate("Custom Range"),
			getQGF_CollapsibleContentTemplate("Here goes your content")
		)
	);
	contentString += collapsibleSection.outerHTML;

	// Main tab
	const mainTab = createElementFromHTML(getQGFMainTabTemplate(contentString));
	document.body.appendChild(mainTab);

	// Inject Addon Buttons
	InjectQuestionBlocks();

	// Add event listeners
	HandleCollapsibleToggle();
}
