var currentDragFile;

var currentGDC = {
    name: "",
    description: "",
    latitude: -1,
    longitude: -1,
    elements: []
};


function showDropedFileDiv(fileName) {
    $("#DragDropDiv").css("display", "none");
    $("#DropedFileDiv").css("display", "block");

    $("#elementSelectedFileName").text(fileName);
};

function showDragDropDiv() {
    $("#DragDropDiv").css("display", "block");
    $("#DropedFileDiv").css("display", "none");
};

function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);

                currentDragFile = file;
                showDropedFileDiv(file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
};

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
};

function saveGDCElement() {
    var element = {
        name: $("#inpElementName").val(),
        description: $("#inpElementDescription").val(),
        latitude: $("#inpElementLatitude").val(),
        longitude: $("#inpElementLongitude").val(),
        type: $("#inpTypeSelection").find(":selected").text(),
        file: currentDragFile
    };

    currentGDC.elements.push(element);
    clearGDCElementModal();
    loadGDCTable();
    $('#addElementModal').modal('hide');
};

function saveNewGDC() {
    currentGDC.name = $("#inpGDCName").val();
    currentGDC.description = $("#inpGDCDescription").val();
    currentGDC.latitude = $("#inpGDCLatitude").val();
    currentGDC.longitude = $("#inpGDCLongitude").val();

    addGDC(currentGDC);
    clearGDCModal();
    clearCurrentGDC();
    loadPackageTable();
    $('#addGDCModal').modal('hide');
}

function loadPackageTable() {
    var table = $("#GDCTable");
    var tableBody = $("#GDCTable tbody");

    tableBody.empty();

    for (i = 0; i < gdcPackageObject.gdcs.length; i++) {
        addGDCOnTable(table, gdcPackageObject.gdcs[i]);
    }
}

function loadGDCTable() {
    var table = $("#ElementsTable");
    var tableBody = $("#ElementsTable tbody");

    tableBody.empty();

    for (i = 0; i < currentGDC.elements.length; i++) {
        addGDCOnTable(table, currentGDC.elements[i]);
    }
};

function addGDCOnTable(table, gdc) {
    var markup =
        "<tr>" +
        "<td>" + gdc.name + "</td>" +
        "<td>" + gdc.description + "</td>" +
        "<td>" + gdc.latitude + "</td>" +
        "<td>" + gdc.longitude + "</td>" +
        "</tr>";
    table.append(markup);
}

function addElementOnTable(table, element) {
    var markup =
        "<tr>" +
        "<td>" + element.name + "</td>" +
        "<td>" + element.description + "</td>" +
        "<td>" + element.latitude + "</td>" +
        "<td>" + element.longitude + "</td>" +
        "<td>" + element.type + "</td>" +
        "<td>" + element.file.name + "</td>" +
        "</tr>";
    table.append(markup);
};

//TODO: Create a function to open modal with data when click in a row

function clearGDCElementModal() {
    $("#inpElementName").val("");
    $("#inpElementDescription").val("");
    $("#inpElementLatitude").val("");
    $("#inpElementLongitude").val("");
    $("#inpTypeSelection").children("option:selected").val("Sample");

    //load card to drag file
    showDragDropDiv();
}

function clearGDCModal() {
    $("#inpGDCName").val("");
    $("#inpGDCDescription").val("");
    $("#inpGDCLatitude").val("");
    $("#inpGDCLongitude").val("");

    //Clear element table
    var tableBody = $("#ElementsTable tbody");
    tableBody.empty();
}

function clearCurrentGDC() {
    currentGDC = {
        name: "",
        description: "",
        latitude: -1,
        longitude: -1,
        elements: []
    };
}