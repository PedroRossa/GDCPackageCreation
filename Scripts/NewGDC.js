var currentDragFile;
var currentGDC = [];

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
        type: $("#inpTypeSelection").children("option:selected").val(),
        file: currentDragFile
    };

    addGDCElement(currentGDC, element);
    clearFields();
    loadGDCTable();
    $('#addElementModal').modal('hide');
};

function saveNewGDC() {
    addGDC(currentGDC);
    loadPackageTable();
    $('#addGDCModal').modal('hide');
    currentGDC = [];
}

function loadPackageTable() {
    var table = $("#GDCTable");
    var tableBody = $("#GDCTable tbody");

    tableBody.empty();

    for (i = 0; i < gdcPackageObject.gdcs.length; i++) {
        addElementOnTable(table, gdcPackageObject.gdcs[i]);
    }
}

function loadGDCTable() {
    var table = $("#ElementsTable");
    var tableBody = $("#ElementsTable tbody");

    tableBody.empty();

    for (i = 0; i < currentGDC.length; i++) {
        addGDCOnTable(table, currentGDC[i]);
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

function clearFields() {
    $("#inpElementName").val("");
    $("#inpElementDescription").val("");
    $("#inpElementLatitude").val("");
    $("#inpElementLongitude").val("");
    $("#inpTypeSelection").children("option:selected").val("Sample");

    //load card to drag file
    showDragDropDiv();
}