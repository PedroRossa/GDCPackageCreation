var currentDragFile;
var currentGdcType;

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

function setCurrentGdcType(gdcType) {
    currentGdcType = gdcType;
};

function saveGDCElement() {
    var element = {
        name: $("#inpElementName").val(),
        description: $("#inpElementDescription").val(),
        latitude: $("#inpElementLatitude").val(),
        longitude: $("#inpElementLongitude").val(),
        file: currentDragFile,
        type: currentGdcType
    };

    addGDCElement(element);
    clearFields();
    loadSamplesTable(currentGdcType);
    $('#addElementModal').modal('hide');
};

function loadSamplesTable(gdcType) {
    switch (gdcType) {
        case gdcTypeEnum.SAMPLE: {
            var table = $("#samplesTable");
            var tableBody = $("#samplesTable tbody");

            tableBody.empty();

            for (i = 0; i < gdcPackageObject.gdcSamples.length; i++) {
                addElementOnTable(table, gdcPackageObject.gdcSamples[i]);
            }
            break;
        }
        case gdcTypeEnum.PANORAMIC: {
            var table = $("#panoramicsTable");
            var tableBody = $("#panoramicsTable tbody");

            tableBody.empty();

            for (i = 0; i < gdcPackageObject.gdcPanoramics.length; i++) {
                addElementOnTable(table, gdcPackageObject.gdcPanoramics[i]);
            }
            break;
        }
        case gdcTypeEnum.OTHER: {
            var table = $("#othersTable");
            var tableBody = $("#othersTable tbody");

            tableBody.empty();

            for (i = 0; i < gdcPackageObject.gdcOthers.length; i++) {
                addElementOnTable(table, gdcPackageObject.gdcOthers[i]);
            }
            break;
        }
        default:
            console.log("Unknow gdcType");
            break;
    }
};

function addElementOnTable(table, element) {
    var markup =
        "<tr>" +
        "<td>" + element.name + "</td>" +
        "<td>" + element.description + "</td>" +
        "<td>" + element.latitude + "</td>" +
        "<td>" + element.longitude + "</td>" +
        "<td>" + element.file.name + "</td>" +
        "</tr>";
    table.append(markup);
};

function clearFields() {
    $("#inpElementName").val("");
    $("#inpElementDescription").val("");
    $("#inpElementLatitude").val("");
    $("#inpElementLongitude").val("");

    //load card to drag file
    showDragDropDiv();
}