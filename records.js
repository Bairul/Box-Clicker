// record tabs
function openRecordMenu() {
    isInRecords = true;
    startButton.position(-WIDTH, -HEIGHT);
    restartButton.position(-WIDTH, -HEIGHT);
    menuButton.position(-WIDTH, -HEIGHT);
    recordsButton.position(-WIDTH, -HEIGHT);

    document.getElementById("recordstab").style.display = 'block';
    // default tab open
    document.getElementById('defaultOpen').click();
}

function updateRecordsPositions() {
    recordsBackButton.position(canvasPaddingX, canvasPaddingY);
    exportRecordsButton.position(canvasPaddingX, canvasPaddingY + HEIGHT - BUTTON_HEIGHT);
    importRecordsButton.position(canvasPaddingX, canvasPaddingY + HEIGHT - BUTTON_HEIGHT * 2);

    const tabrecord = document.getElementById("recordstab");
    tabrecord.style.top = canvasPaddingY + 5;
    tabrecord.style.left = canvasPaddingX + 65;
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.left = canvasPaddingX + 65;
        tabcontent[i].style.top = canvasPaddingY + 65;
    }
    modal.style.top = canvasPaddingY;
    modal.style.left = canvasPaddingX;
}

function hideRecordsGui() {
    recordsBackButton.position(-WIDTH, -HEIGHT);
    exportRecordsButton.position(-WIDTH, -HEIGHT);
    importRecordsButton.position(-WIDTH, -HEIGHT);
}

function backGameRecords() {
    isInRecords = false;
    hideRecordsGui();

    const tabrecord = document.getElementById("recordstab");
    tabrecord.style.top = -WIDTH;
    tabrecord.style.left = -HEIGHT;
    tabrecord.style.display = 'none';
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
}

function exportRecords() {
    console.log("export");
    document.getElementById("myModal").style.display = "block";
}

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById("confirmExport").onclick = function () {
    modal.style.display = "none";
    let name = document.getElementById("name").value;
    if (name == '') {
        console.log("name cannot be empty");
    } else {
        console.log(name)
        let str = '';
        for (let j = 0; j < RECORDS.length; j++) {
            for (i = 0; i < RECORDS[j].length; i++) {
                str += RECORDS[j][i] + '-';
            }
        }
        str.substring(0, str.length - 1);
    }
}

function importRecords() {
    console.log("import");
}

function openRecord(evt, recordGamemode) {

    // Get all elements with class="tabcontent" and hide them
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    const tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(recordGamemode).style.display = "block";
    evt.currentTarget.className += " active";

    let gm = 0;
    if (recordGamemode == 'streamy') {
        gm = 1;
    } else if (recordGamemode == 'jumpy') {
        gm = 2;
    } else if (recordGamemode == 'mixed') {
        gm = 3;
    }
    // Show records
    const diff = ['easy', 'normal', 'hard', 'nightmare'];
    for (i = 0; i < 4; i++) {
        document.getElementById(recordGamemode + '_' + diff[i] + '_score').innerHTML = ('Highscore: ' + RECORDS[gm][i * 5]);
        document.getElementById(recordGamemode + '_' + diff[i] + '_combo').innerHTML = ('Combo: '     + RECORDS[gm][i * 5 + 1]);
        document.getElementById(recordGamemode + '_' + diff[i] + '_mod').innerHTML = ('Modifier: '    + RECORDS[gm][i * 5 + 2]
                                                                                                + '-' + RECORDS[gm][i * 5 + 3]
                                                                                                + '-' + RECORDS[gm][i * 5 + 4]);
    }
}