
var gdcPackageObject = {
  name: "",
  latitude: -1,
  longitude: -1,
  gdcs: []
};

var gdcTypeEnum = {
  SAMPLE: 1,
  PANORAMIC: 2,
  FILE: 3
};

var gdc = {
  gdcElements: []
}

var gdcElement = {
  name: "",
  description: "",
  latitude: -1,
  longitude: -1,
  file: "",
  relativePath: "",
  type: gdcTypeEnum
};

<<<<<<< HEAD
function addGDC(gdc) {
  gdcPackageObject.gdcs.push(gdc);
}

function addGDCElement(gdcList, gdcElement) {
  gdcElement.relativePath = "GDC/" + gdcElement.file.name;
  gdcList.push(gdcElement);
}
=======
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
>>>>>>> f79f7baf6caa0eae732a2eb5c02bb7cb34c259bb

const streamSaver = window.streamSaver;
const zip = new JSZip();

function successCb() {
  console.log("Everything done!");
  finishProgressPanel(true);
}

function errorCb() {
  console.error("Error, damn");
  finishProgressPanel(false);
}

function initProgressPanel() {
  $("#progressModal").modal("show");

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
        checkAllElementFilesRead(gdcArray)
          .then(res => {
            generateZip(writeStream);
          })
          .catch(err => {
            console.log("Still reading ...");
          });
      };
    })(file);

    // Reading file
    fileReader.readAsArrayBuffer(file);
  }
}

async function zipFiles() {
<<<<<<< HEAD
  initProgressPanel();
=======
    initProgressPanel();
>>>>>>> f79f7baf6caa0eae732a2eb5c02bb7cb34c259bb

  var packageName = $("#inpPackageName").val();
  const writeStream = streamSaver.createWriteStream(packageName + ".zip");

  var gdcArray = gdcPackageObject.gdcSamples
    .concat(gdcPackageObject.gdcPanoramics)
    .concat(gdcPackageObject.gdcOthers);

<<<<<<< HEAD
  var jsonData = JSON.stringify(gdcPackageObject, null, 2);
  zip.file("gdcPackage.json", jsonData);

  const tif = await getHeightMapForCurrentElements();
  console.log("tif", tif);
  zip.file("Test.tif", tif);

  zipFilesInFolders(writeStream, gdcArray);
}
=======
    var jsonData = JSON.stringify(gdcPackageObject, null, 2);
    zip.file("gdcPackage.json", jsonData);

    zip.file("Test.tif", await getHeightMapForCurrentElements());

    zipFilesInFolders(writeStream, gdcArray);
};
>>>>>>> f79f7baf6caa0eae732a2eb5c02bb7cb34c259bb

function checkAllElementFilesRead(elements) {
  return new Promise((resolve, reject) => {
    console.group("Check all files read");
    for (const element of elements) {
      file = element.file;
      console.log(file.name, file.finishedReading);
      if (!file.finishedReading) {
        console.groupEnd();
        reject();
        return;
      }
    }
    console.groupEnd();
    resolve(true);
  });
}

function generateZip(writeStream) {
  console.log("GENERATING ZIP!!!");
  zip
    .generateAsync({
        type: "blob"
      },
      function updateCallback(meta) {
        console.log(`progression: ${meta.percent.toFixed(2)}%`);
      }
    )
    .then(
      function (blob) {
        new Response(blob).body.pipeTo(writeStream).then(successCb, errorCb);
      },
      function (err) {
        console.error(err);
        alert("ERROR ZIPPING");
      }
    );
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

<<<<<<< HEAD
async function downloadHeighmapFromOpenLayers(boundBox) {
  minX = boundBox[0];
  maxX = boundBox[1];
  minY = boundBox[2];
  maxY = boundBox[3];
  var uri =
    "https://test-proxy-31415.appspot.com/?url=http://opentopo.sdsc.edu/otr/getdem?" +
    "demtype=SRTMGL1" +
    "&west=" +
    minX +
    "&south=" +
    minY +
    "&east=" +
    maxX +
    "&north=" +
    maxY +
    "&outputFormat=GTiff";

  $.ajax({
    url: uri,
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    method: "GET",
    success: function (response) {
      console.log(
        "image loaded from opentopography with coords: minX = " +
        minX +
        " maxX = " +
        maxX +
        " minY = " +
        minY +
        " maxY = " +
        maxY
      );

      console.log("response data", response);
      var blob = new Blob([response.data]);
      return blob;
    },
    error: function (error) {
      console.log("error on load image from opentopography. Error: " + error);
      return null;
    }
  });
=======
function downloadHeighmapFromOpenLayers(boundBox) {
    return new Promise((resolve, reject) => {
        minX = boundBox[0];
        maxX = boundBox[1];
        minY = boundBox[2];
        maxY = boundBox[3];
        const uri = "https://test-proxy-31415.appspot.com/?url=http://opentopo.sdsc.edu/otr/getdem?" +
            "demtype=SRTMGL1" +
            "&west=" + minX + "&south=" + minY + "&east=" + maxX + "&north=" + maxY +
            "&outputFormat=GTiff";

        const oReq = new XMLHttpRequest();
        oReq.open("GET", uri, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
            const arrayBuffer = oReq.response;

            // If you want to use the image in your DOM:
            const blob = new Blob([arrayBuffer]);
            resolve(blob)
        };
        oReq.onerror = err => {
            reject(err)
        }

        oReq.send();
    })
>>>>>>> f79f7baf6caa0eae732a2eb5c02bb7cb34c259bb
}

//PRECISO RESOLVER O DOWNLOAD DA IMAGEM DO OPENTOPOGRAPHY

async function getHeightMapForCurrentElements() {
<<<<<<< HEAD
  var gdcArray = gdcPackageObject.gdcSamples
    .concat(gdcPackageObject.gdcPanoramics)
    .concat(gdcPackageObject.gdcOthers);
  var boundBox = getBoundBoxCoordinates(gdcArray);

  var data = await downloadHeighmapFromOpenLayers(boundBox);
  console.log("data", data);
=======
    var gdcArray = gdcPackageObject.gdcSamples.concat(gdcPackageObject.gdcPanoramics).concat(gdcPackageObject.gdcOthers);
    var boundBox = getBoundBoxCoordinates(gdcArray);

    var data = await downloadHeighmapFromOpenLayers(boundBox);
>>>>>>> f79f7baf6caa0eae732a2eb5c02bb7cb34c259bb

  return data;
}