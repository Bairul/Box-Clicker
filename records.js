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
    portModal.style.top = canvasPaddingY;
    portModal.style.left = canvasPaddingX;
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
const importContent = document.getElementById("import-div");
const exportContent = document.getElementById("export-div");

function hideModal() {
    portModal.style.display = "none";
    importContent.style.display = "none";
    exportContent.style.display = "none";
}
// ========= EXPORTING =========
function exportRecords() {
    console.log("export");
    portModal.style.display = "block";
    exportContent.style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function () {
    // When the user clicks on <span> (x), close the modal
    hideModal();
}

window.onclick = function (event) {
    // When the user clicks anywhere outside of the modal, close it
    if (event.target == portModal) {
        hideModal();
    }
}

document.getElementById("confirmExport").onclick = function () {
    const name = document.getElementById("exportName");
    if (name.value == '') {
        // add shaking
        name.classList.add('error');
        // remove shaking after done
        setTimeout(function () {
            name.classList.remove('error');
        }, 300);
    } else {
        let str = '';
        for (let j = 0; j < RECORDS.length; j++) {
            for (i = 0; i < RECORDS[j].length; i++) {
                str += RECORDS[j][i] + '-';
            }
        }
        // downloadTextFile(str.substring(0, str.length - 1));
        callKmacEnc(name.value, str.substring(0, str.length - 1));
        hideModal();
    }
}

function downloadTextFile(name, data) {
    const a = document.createElement('a');
    const b = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(b);
    a.href = url;
    a.download = 'Box-Clicker-' + name + '-records.txt';
    a.style.display = "none";
    document.body.append(a);

    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

const urlApiEnc = "https://zonk83g0gi.execute-api.us-east-2.amazonaws.com/kmac_enc";

async function callKmacEnc(name, data) {
    const response = await fetch(urlApiEnc, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": name, "data": data })
    });

    response.json().then(datajson => {
        downloadTextFile(name, datajson.cryptogram);
    });
}


// ========= IMPORTING =========
let cryptogram = '';

function importRecords() {
    console.log("import");
    portModal.style.display = "block";
    importContent.style.display = "block";
}

document.getElementById("confirmImport").onclick = function () {
    const name = document.getElementById("importFile");
    if (name.value == '') {
        // add shaking
        name.classList.add('error');
        // remove shaking after done
        setTimeout(function () {
            name.classList.remove('error');
        }, 300);
    } else {
        callKmacDec(name.value, cryptogram);
    }
}

const urlApiDec = "https://imeqpy3wic.execute-api.us-east-2.amazonaws.com/kmac-dec";

async function callKmacDec(name, data) {
    const response = await fetch(urlApiDec, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": name, "data": data })
    });

    response.json().then(datajson => {
        if (datajson.accept == 1) {
            console.log("accept");
        } else {
            console.log("reject");
        }
    });
}

function openFile(input) {
    let file = input.files[0];

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        cryptogram = reader.result;
    }
}

// ======= end import/export

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
        document.getElementById(recordGamemode + '_' + diff[i] + '_combo').innerHTML = ('Combo: ' + RECORDS[gm][i * 5 + 1]);
        document.getElementById(recordGamemode + '_' + diff[i] + '_mod').innerHTML = ('Modifier: ' + RECORDS[gm][i * 5 + 2]
            + '-' + RECORDS[gm][i * 5 + 3]
            + '-' + RECORDS[gm][i * 5 + 4]);
    }
}