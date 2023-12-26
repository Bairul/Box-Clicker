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
    exportModal.style.top = canvasPaddingY;
    exportModal.style.left = canvasPaddingX;
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

// ========= EXPORTING =========
function exportRecords() {
    console.log("export");
    document.getElementById("exportPopup").style.display = "block";
}

function downloadTextFile(data) {
    const a = document.createElement('a');
    const b = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(b);
    a.href = url;
    a.download = 'Box-Clicker-records.txt';
    a.style.display = "none";
    document.body.append(a);

    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].onclick = function () {
    exportModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == exportModal) {
        exportModal.style.display = "none";
    }
}

document.getElementById("confirmExport").onclick = function () {
    const name = document.getElementById("name");
    if (name.value == '') {
        // add shaking
        name.classList.add('error');
        // remove shaking after done
        setTimeout(function () {
            name.classList.remove('error');
        }, 300);
    } else {
        exportModal.style.display = "none";
        let str = '';
        for (let j = 0; j < RECORDS.length; j++) {
            for (i = 0; i < RECORDS[j].length; i++) {
                str += RECORDS[j][i] + '-';
            }
        }
        // downloadTextFile(str.substring(0, str.length - 1));
        call(name.value, str.substring(0, str.length - 1));
    }
}

const urlApi = "https://zonk83g0gi.execute-api.us-east-2.amazonaws.com/kmac_enc";

async function call(name, datatext) {
    const response = await fetch(urlApi, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": name, "data": datatext })
    });

    response.json().then(data => {
        downloadTextFile(data.cryptogram);
    });
}


// ========= IMPORTING =========

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
        document.getElementById(recordGamemode + '_' + diff[i] + '_combo').innerHTML = ('Combo: ' + RECORDS[gm][i * 5 + 1]);
        document.getElementById(recordGamemode + '_' + diff[i] + '_mod').innerHTML = ('Modifier: ' + RECORDS[gm][i * 5 + 2]
            + '-' + RECORDS[gm][i * 5 + 3]
            + '-' + RECORDS[gm][i * 5 + 4]);
    }
}