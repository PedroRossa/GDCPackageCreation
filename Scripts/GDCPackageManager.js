var gdcPackageObject = {
  name: "",
  description: "",
  latitude: -1,
  longitude: -1,
  geoTiffPath: "",
  boundries: [],
  gdcs: []
};

var gdcTypeEnum = {
  SAMPLE: 1,
  PANORAMIC: 2,
  FILE: 3
};

// var gdc = {
//   name: "",
//   description: "",
//   latitude: -1,
//   longitude: -1,
//   elements: []
// };

// var gdcElement = {
//   name: "",
//   description: "",
//   latitude: -1,
//   longitude: -1,
//   file: "",
//   relativePath: "",
//   type: gdcTypeEnum[0]
// };

function addGDC(gdc) {
  //set relative path of GDC Elements
  for (const element of gdc.elements) {
    element.relativePath = "GDCs\\" + gdc.name + "\\" + element.file.name;
  }

  gdcPackageObject.gdcs.push(gdc);
}

const streamSaver = window.streamSaver;
const zip = new JSZip();

function successCb() {
  console.log("Everything done!");
  finishProgressPanel("Zip generated with success!!!");
}

function errorCb() {
  console.error("Error, damn");
  finishProgressPanel("A problem occurs when we tried to generate your package. Sorry :(");
}

function initProgressPanel(message) {
  $("#progressModal").modal("show");

  var progress = $("#progressBarZip");
  var progressText = $("#progressText");

  progress.addClass("progress-bar-indeterminate");
  progressText.text(message);
  $("#btnProgressModalOk").attr("disabled", true);
}

function updateProgressPanelMessage(message) {
  var progressText = $("#progressText");
  progressText.text(message);
}

function finishProgressPanel(message) {
  var progress = $("#progressBarZip");
  var progressText = $("#progressText");

  progress.removeClass("progress-bar-indeterminate");
  progressText.text(message);

  $("#btnProgressModalOk").attr("disabled", false);
}

function generatePackage() {
  initProgressPanel("Generating a heightmap from Opentopography...");
  var boundBox = getBoundBoxCoordinates(gdcPackageObject.gdcs);

  if (gdcPackageObject.gdcs.length <= 0) {
    finishProgressPanel("No GDC's detected on package");
    return;
  }

  downloadHeighmapFromOpenLayers(boundBox).then(result => {
      gdcPackageObject.boundries = boundBox;
      gdcPackageObject.geoTiffPath = "";

      txtRes = result;

      if (typeof result !== 'string') {
        const enc = new TextDecoder("utf-8");
        txtRes = enc.decode(result);
      }

      //TODO: Actualy the server returns always a success, so we threat reading the first part of string to detect the "error" message on result
      if (txtRes.startsWith("Error")) {
        finishProgressPanel(txtRes);
        console.error("Error on getting opentopography image.", txtRes);
        zipFiles();
      } else {
        zip.file("heightmap.tif", new Blob([result]));
        gdcPackageObject.geoTiffPath = "heightmap.tif";

        finishProgressPanel("Heightmap generated!");
        zipFiles();
      }
    })
    .catch(error => {
      console.error(error);
    })
}

function zipFiles() {
  initProgressPanel("Zip Files now...");

  const packageName = $("#inpPackageName").val();

  gdcPackageObject.name = packageName;
  gdcPackageObject.description = $("#inpPackageDescription").val();
  gdcPackageObject.latitude = $("#inpPackageLatitude").val();
  gdcPackageObject.longitude = $("#inpPackageLongitude").val();

  const writeStream = streamSaver.createWriteStream(packageName + ".zip");

  zipFilesInFolders(writeStream, gdcPackageObject.gdcs);

  const jsonData = JSON.stringify(gdcPackageObject, null, 2);
  zip.file("gdcPackage.json", jsonData);
}

function zipFilesInFolders(writeStream, gdcs) {
  for (const gdc of gdcs) {
    const curFolder = zip.folder("GDCs/" + gdc.name);

    for (const element of gdc.elements) {
      console.log(element);
      file = element.file;

      if (file == null) {
        continue;
      }
      // Flag
      file.finishedReading = false;

      const fileReader = new FileReader();

      // Closure
      fileReader.onload = (function (file, currGdc, folder) {
        return function (e) {
          console.log(currGdc, folder);

          folder.file(file.name, e.target.result);

          file.finishedReading = true;
          //Every pass, check if all files as already read. The result of this call will be true when all files readed
          checkAllElementFilesRead(gdcs)
            .then(res => {
              generateZip(writeStream);
            })
            .catch(err => {
              console.log("Still reading ...");
            });
        };
      })(file, gdc, curFolder);

      // Reading file
      fileReader.readAsArrayBuffer(file);
    }
  }
}


function checkAllElementFilesRead(gdcs) {
  return new Promise((resolve, reject) => {
    console.group("Check all files read");

    for (const gdc of gdcs) {
      for (const element of gdc.elements) {
        file = element.file;
        console.log(file.name, file.finishedReading);
        if (!file.finishedReading) {
          console.groupEnd();
          reject();
          return;
        }
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

  if (elements.length <= 0) {
    return null;
  }

  const allLatitudes = elements.map(function (el) {
    return parseFloat(el.latitude);
  });
  const allLongitudes = elements.map(function (el) {
    return parseFloat(el.longitude);
  });

  let minX = Math.min(...allLongitudes);
  let maxX = Math.max(...allLongitudes);
  let minY = Math.min(...allLatitudes);
  let maxY = Math.max(...allLatitudes);

  const width = (maxX - minX);
  const height = (maxY - minY);

  console.log("W:", width, "H:", height);

  //Add 5% to each point off bound box
  minX -= width * 0.05;
  minY -= height * 0.05;
  maxX += width * 0.05;
  maxY += height * 0.05;

  console.log("minX: ", minX, "maxX", maxX, "minY", minY, "maxY", maxY);

  return [minX, minY, maxX, maxY];
}

function downloadHeighmapFromOpenLayers(boundBox) {
  return new Promise((resolve, reject) => {
    minX = boundBox[0];
    minY = boundBox[1];
    maxX = boundBox[2];
    maxY = boundBox[3];

    const url =
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

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.timeout = 1000 * 60 * 2; // 2 minutes (in milli)
    xhr.open('GET', url);

    xhr.onload = function () {
      console.log('On load')
      if (xhr.status != 200) { // analyze HTTP status of the response
        const enc = new TextDecoder("utf-8");
        console.error("Error on getting opentopography image", enc.decode(xhr.response));
        resolve(enc.decode(xhr.response));
      } else { // show the result 
        resolve(xhr.response);
      }
    };

    xhr.onprogress = function (event) {
      console.log('On progress');
      if (event.lengthComputable) {
        console.log(`Received ${event.loaded} of ${event.total} bytes`);
      } else {
        console.log(`Received ${event.loaded} bytes`); // no Content-Length
      }

    };

    xhr.onerror = function () {
      console.error("Error on getting opentopo image from server")
      reject('Error');
    };

    xhr.onabort = function () {
      console.error('Aborted request');
    }

    xhr.send();
  });
}

function testOpentopography() {
  const boundBox = [-119.6411903, 37.7218438, -119.5276637, 37.7460482];

  downloadHeighmapFromOpenLayers(boundBox).then(result => {
      //TODO: Actualy the server returns always a success, so we threat reading the first part of string to detect the "error" message on result
      if (typeof result === 'string') {
        console.log("Problem to generate the heightmap, error in some geolocalization registred on a GDC of the package!")
      } else {
        saveData(result, 'test.tif');
        console.log(result);
      }
    })
    .catch(error => {
      console.error(error);
    })
}

var saveData = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
    var file = new File([data], "name");
    url = window.URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());