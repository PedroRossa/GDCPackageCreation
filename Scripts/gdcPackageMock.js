const gdcMock = {
    "name": "TestPackage",
    "description": "TestPackage description",
    "latitude": 0,
    "longitude": 0,
    "geoTiffPath": "heightmap.tif",
    "boundries": [-119.6411903, -119.5276637, 37.7218438, 37.7460482],
    "gdcs": [{
            "name": "GDC_01",
            "description": "First GDC",
            "latitude": "37.727789",
            "longitude": "-119.559367",
            "elements": [{
                    "name": "Sample RH01",
                    "description": "Sample RH01",
                    "latitude": "37.727789",
                    "longitude": "-119.559367",
                    "type": "Sample",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_01/sample_01.zip"
                },
                {
                    "name": "Descritive PDF",
                    "description": "Laboratorial Study - Geochemistry",
                    "latitude": "0",
                    "longitude": "0",
                    "type": "File",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_01/geochemistry.png"
                },
                {
                    "name": "Field Panoramic",
                    "description": "panoramic image of the field where sample was colected",
                    "latitude": "37.729424",
                    "longitude": "-119.571637",
                    "type": "Panoramic",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_01/Halfdome.jpg"
                }
            ]
        },
        {
            "name": "GDC_2",
            "description": "General study of area",
            "latitude": "37.725302",
            "longitude": "-119.532824",
            "elements": [{
                "name": "Area Study PDF",
                "description": "PDF with the area study",
                "latitude": "0",
                "longitude": "0",
                "type": "File",
                "file": {
                    "finishedReading": false
                },
                "relativePath": "GDCs/GDC_2/paper 240.pdf"
            }]
        },
        {
            "name": "GDC_03",
            "description": "Panoramic view",
            "latitude": "37.723164",
            "longitude": "-119.584645",
            "elements": [{
                    "name": "Panoramic View",
                    "description": "Panoramic of the area",
                    "latitude": "37.723164",
                    "longitude": "-119.584645",
                    "type": "Panoramic",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_03/Eaglepoint.jpg"
                },
                {
                    "name": "Ambient Sound",
                    "description": "Audio clip with ambient sound",
                    "latitude": "0",
                    "longitude": "0",
                    "type": "File",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_03/night2.mp3"
                }
            ]
        },
        {
            "name": "GDC_04",
            "description": "Local Sample",
            "latitude": "37.744948",
            "longitude": "-119.533995",
            "elements": [{
                "name": "Local Sample",
                "description": "Calcite sample",
                "latitude": "37.744948",
                "longitude": "-119.533995",
                "type": "Sample",
                "file": {
                    "finishedReading": false
                },
                "relativePath": "GDCs/GDC_04/Sample_02.zip"
            }]
        },
        {
            "name": "GDC_05",
            "description": "Generic Panoramic of the place",
            "latitude": "37.722944",
            "longitude": "-119.636030",
            "elements": [{
                    "name": "generic panoramic",
                    "description": "Generic panoramic of the place",
                    "latitude": "37.722944",
                    "longitude": "-119.636030",
                    "type": "Panoramic",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_05/Taftpoint.jpg"
                },
                {
                    "name": "Generic picture",
                    "description": "generic picture",
                    "latitude": "0",
                    "longitude": "0",
                    "type": "File",
                    "file": {
                        "finishedReading": false
                    },
                    "relativePath": "GDCs/GDC_05/Image02.png"
                }
            ]
        }
    ]
}