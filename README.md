# Quick Google Forms v0.2.1
A script that adds a side bar tool to hasten the process of filling up google forms

## Features
**Works on the following question types:**
- [x] Multiple Choice (Radio Buttons)
- [x] Linear Scale
- [x] Checkboxes

**To be added:**
- [ ] Multiple Choice Grid (Radio Buttons)
- [ ] Checkbox Grid 
- [ ] Short Answer
- [ ] Paragraph
- [ ] Dropdown
- [ ] Date 
- [ ] Time

**Uncertain:**
- [ ] File Upload
<br>

## Installation (Around 2 Min only)
1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) (A chrome extensioon)
2. Click on [this](https://github.com/HageFX-78/QuickGoogleForms/raw/main/QuickGoogleForms.user.js) and install.
3. Open any google form and the tool will appear on the right.
4. Enjoy!

**Optional**<br>
You can test the script in this form if needed ->
[Test Google Form](https://forms.gle/5qp21nC7AMjKtUfEA)

<br>

## How to use
**For those that just wanna fill forms quick without much thought:**<br>
Just clicking the first button "Fill" on the tool will fill everything with default settings. 

**Detailed explanation for each feature (TBD):** <br>
You also can currently set the range in which how you want to randomize Linear Scale question selections. 1 to 5 by default. Setting same numbers for min max will select that number only for the entire form. Values that go over the number of selection will be clamped to the max value, Ex: 6 to 7 will all return 5 being selected.

<br>

## How it looks like (v0.2.1):
![Screenshot of how it would look like](img/preview.PNG)

<br>

### Known Issues
- ~~Script won't load of first load, refresh the page and the tool will appear.~~
