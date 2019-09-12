const streamSaver = window.streamSaver
const zip = new JSZip();

function successCb() {
  console.log('GG')
}

function errorCb() {
  console.error('Error, damn')
}

$('#zipBtn').on('click', function () {

  const writeStream = streamSaver.createWriteStream('package.zip');

  // Add selected files to zip
  const files = $('#fileInput').get(0).files

  function checkAllFilesRead() {
    return new Promise((resolve, reject) => {
      console.group('Check all files read')
      for (const file of files) {
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

  function generateZip() {
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
  };

  // Iterating through files and reading
  for (const file of files) {
    // Flag
    file.finishedReading = false

    const fileReader = new FileReader()

    // Closure
    fileReader.onload = (function (file) {
      return function (e) {
        zip.file(file.name, e.target.result);
        file.finishedReading = true
        checkAllFilesRead().then(res => {
          generateZip()
        }).catch(err => {
          console.log('Still reading ...')
        })
      }
    })(file);

    // Reading file
    fileReader.readAsArrayBuffer(file)
  }

})