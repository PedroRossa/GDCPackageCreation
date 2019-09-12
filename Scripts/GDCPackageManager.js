var gdcPackageObject = {
    name: "",
    latitude: -1,
    longitude: -1,
    gdcSamples: [],
    gdcPanoramics: [],
    gdcOthers: []
};

var gdcTypeEnum = {
    SAMPLE: 1,
    PANORAMIC: 2,
    OTHER: 3,
};

var gdcElement = {
    name: "",
    description: "",
    latitude: -1,
    longitude: -1,
    file: "",
    relativePath: "",
    type: gdcTypeEnum
};

function addGDCElement(gdcElement) {
    switch (gdcElement.type) {
        case gdcTypeEnum.SAMPLE:
            gdcElement.relativePath = "Samples/" + gdcElement.file.name;
            gdcPackageObject.gdcSamples.push(gdcElement);
            break;
        case gdcTypeEnum.PANORAMIC:
            gdcElement.relativePath = "Panoramics/" + gdcElement.file.name;
            gdcPackageObject.gdcPanoramics.push(gdcElement);
            break;
        case gdcTypeEnum.OTHER:
            gdcElement.relativePath = "Others/" + gdcElement.file.name;
            gdcPackageObject.gdcOthers.push(gdcElement);
            break;
        default:
            console.log("Unrecognized type")
            // code block
    }
};

const streamSaver = window.streamSaver;
const zip = new JSZip();

function successCb() {
    console.log('Everything done!');
    finishProgressPanel(true);
}

function errorCb() {
    console.error('Error, damn');
    finishProgressPanel(false);
}

function initProgressPanel() {
    $("#progressModal").modal('show');

    var progress = $("#progressBarZip");
    var progressText = $("#progressText");

    progress.addClass("progress-bar-indeterminate");
    progressText.text("Zip Files now...");
}

function finishProgressPanel(success) {
    var progress = $("#progressBarZip");
    var progressText = $("#progressText");

    progress.removeClass("progress-bar-indeterminate");

    if (success) {
        progressText.text("All files ziped with success.");
    } else {
        progressText.text("An error occurs when we try to zip the files.");
    }

    $("#btnProgressModalOk").attr("disabled", false);
}

function zipFilesInFolders(writeStream, gdcArray) {
    var samplesFolder = zip.folder("Samples");
    var panoramicsFolder = zip.folder("Panoramics");
    var othersFolder = zip.folder("Others");

    for (const element of gdcArray) {
        file = element.file;
        // Flag
        file.finishedReading = false;

        const fileReader = new FileReader();

        // Closure
        fileReader.onload = (function (file) {
            return function (e) {
                switch (element.type) {
                    case gdcTypeEnum.SAMPLE:
                        samplesFolder.file(file.name, e.target.result);
                        break;
                    case gdcTypeEnum.PANORAMIC:
                        panoramicsFolder.file(file.name, e.target.result);
                        break;
                    case gdcTypeEnum.OTHER:
                        othersFolder.file(file.name, e.target.result);
                        break;
                }
                file.finishedReading = true;
                checkAllElementFilesRead(gdcArray).then(res => {
                    generateZip(writeStream);
                }).catch(err => {
                    console.log('Still reading ...');
                })
            }
        })(file);

        // Reading file
        fileReader.readAsArrayBuffer(file);
    };
}

function zipFiles() {
    initProgressPanel();

    var packageName = $("#inpPackageName").val();
    const writeStream = streamSaver.createWriteStream(packageName + '.zip');

    var gdcArray = gdcPackageObject.gdcSamples.concat(gdcPackageObject.gdcPanoramics).concat(gdcPackageObject.gdcOthers);

    zipFilesInFolders(writeStream, gdcArray);

    var jsonData = JSON.stringify(gdcPackageObject, null, 2);
    zip.file("gdcPackage.json", jsonData);
};

function checkAllElementFilesRead(elements) {
    return new Promise((resolve, reject) => {
        console.group('Check all files read')
        for (const element of elements) {
            file = element.file;
            console.log(file.name, file.finishedReading);
            if (!file.finishedReading) {
                console.groupEnd()
                reject()
                return;
            }
        }
        console.groupEnd()
        resolve(true)
    })
};

function generateZip(writeStream) {
    console.log('GENERATING ZIP!!!')
    zip.generateAsync({
        type: "blob"
    }, function updateCallback(meta) {
        console.log(`progression: ${meta.percent.toFixed(2)}%`);
    }).then(function (blob) {
        new Response(blob).body.pipeTo(writeStream).then(successCb, errorCb)
    }, function (err) {
        console.error(err)
        alert('ERROR ZIPPING')
    })
}

//Return an array with minMaxCoordinates
function getBoundBoxCoordinates(elements) {
    var minX = 180;
    var maxX = -180;
    var minY = 90;
    var maxY = -90;

    for (const element of elements) {
        if (element.longitude < minX) {
            minX = element.longitude;
        }
        if (element.longitude > maxX) {
            maxX = element.longitude;
        }
        if (element.latitude < minY) {
            minY = element.latitude;
        }
        if (element.latitude > maxY) {
            maxY = element.latitude;
        }
    }
    return [minX, maxX, minY, maxY];
}

function test() {
    downloadHeighmapFromOpenLayers([-119.65227127075197, -119.52283859252931, 37.69903420794415, 37.77804178967591]);
}

function downloadHeighmapFromOpenLayers(boundBox) {
    minX = boundBox[0];
    maxX = boundBox[1];
    minY = boundBox[2];
    maxY = boundBox[3];

    var uri = "https://test-proxy-31415.appspot.com/?url=http://opentopo.sdsc.edu/otr/getdem?" +
        "demtype=SRTMGL1" +
        "&west=" + minX + "&south=" + minY + "&east=" + maxX + "&north=" + maxY +
        "&outputFormat=GTiff";

    $.ajax(uri, // url
        function (data, textStatus, jqXHR) { // success callback
            alert('status: ' + textStatus + ', data:' + data);
        });
}