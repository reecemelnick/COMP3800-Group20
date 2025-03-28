document.body.appendChild(document.createElement('canvas'))
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

const fileDrop = document.getElementById('file-drop')
const xrayFile = document.getElementById('xrayFile')
const submit = document.getElementById('submit-btn')
const xrayAnnotated = document.getElementById('xray-annotated')
const tbody = document.querySelector("#results-table tbody");

fileDrop.addEventListener('click', () => xrayFile.click())

fileDrop.addEventListener('dragover', (e) => {
    e.preventDefault()
    fileDrop.classList.add('bg-light')
})

fileDrop.addEventListener('dragleave', () => {
    fileDrop.classList.remove('bg-light')
})

fileDrop.addEventListener('drop', (e) => {
    e.preventDefault()
    validateFile(e.dataTransfer.files)
})

xrayFile.addEventListener('change', (e) => {
    submit.setAttribute("disabled", false);
    if (e.target.files.length !== 0 && !validateFile(e.target.files)) {
        e.target.value = ''
    }
})

submit.addEventListener('click', async (e) => {
    submit.setAttribute("disabled", true);
    const loadOverlay = document.getElementById('loading-overlay')
    loadOverlay.classList.toggle('d-none')

    const formData = new FormData()
    formData.append('uploaded_file', xrayFile.file)

    try {
        const response = await fetch('/xray', {
            method: 'POST',
            body: formData, // Send the form data containing the file
        })

        if (!response.ok) {
            alert(`Upload error: ${response.status}`)
        }
        const result = await response.json()
        // TODO: do something with result
        populateDetectionTable(result)
        annotateImage(xrayFile.file, result)
    } catch (error) {
        alert('Failed to reach server: ' + error.message)
    }
    loadOverlay.classList.toggle('d-none')
})

function updatefileDropText() {
    fileDrop.textContent =
        xrayFile.file
            ? xrayFile.file.name
            : 'Drag and drop a file here or click to select'
}

async function validateFile(files) {
    fileDrop.classList.remove('bg-light')

    if (files.length !== 1) {
        alert('Please drop exactly one file.')
        return false
    }
    const fileName = files[0].name
    const fileExtension = fileName.split('.').pop().toLowerCase()

    if (!fileExtension.includes('jpg') && !fileExtension.includes('png')) {
        alert('Please attach .jpg, .png files only.')
        return false
    }
    // console.log(`Original file:`)
    // console.log(files[0])

    setImage(files[0])
    // const scaledImg = 
    // xrayFile.file = await scaleImage(files[0])
    xrayFile.file = files[0]

    updatefileDropText()
    toggleSubmit(false)
    return true
}

function toggleSubmit(bool) {
    submit.disabled = bool
}

async function scaleImage(img) {
    const scaledW = xrayAnnotated.offsetWidth
    const scaledH = xrayAnnotated.offsetHeight

    canvas.width = scaledW;
    canvas.height = scaledH;

    const context = canvas.getContext('2d');
    context.drawImage(xrayAnnotated, 0, 0, scaledW, scaledH)

    return new Promise((res, rej) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                rej(new Error("Scaling image"))
                return
            }
            res(new File([blob], img.name, { type: img.type }, img.type))
            // console.log("new file: ")
            // console.log(file)
        }, img.type)
    }).then((file) => {
        // console.log(`New file:`)
        // console.log(file)
        return file
    }).catch((err) => {
        alert("Error: ", err)
        throw err
    })
}

/*
*   Displays image submitted to user
*/
function setImage(img) {
    const reader = new FileReader()

    // Check if image file passed in exists
    if (img) {
        tbody.innerHTML = ""
        xrayAnnotated.src = ""
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // When reader is done reading the file
        reader.onload = function (e) {
            xrayAnnotated.setAttribute('src', e.target.result)
        }

        // Reads file as base64 encoded string
        reader.readAsDataURL(img)
    }
}

function populateDetectionTable(data) {
    const predictions = data.data.predictions

    predictions.forEach((prediction) => {
        const row = document.createElement("tr")

        const classCell = document.createElement("td")
        classCell.textContent = prediction.class
        row.appendChild(classCell)

        const confidenceCell = document.createElement("td")
        confidenceCell.textContent = (prediction.confidence * 100).toFixed(2)
        row.appendChild(confidenceCell)

        tbody.appendChild(row)
    })
}

function annotateImage(xrayFile, data) {
    console.log(data)
    if (data.data.predictions.length <= 0) {
        alert("Model did not identify any features of interest.")
        return
    }
    // console.log("Image loaded:", xrayAnnotated.width, xrayAnnotated.height);

    // Set canvas dimensions to match the image
    canvas.width = xrayAnnotated.offsetWidth;
    canvas.height = xrayAnnotated.offsetHeight;
    console.log("Canvas dimensions:", canvas.width, canvas.height);

    // Draw the image onto the canvas
    ctx.drawImage(xrayAnnotated, 0, 0, canvas.width, canvas.height);

    // Scale the predictions to match the canvas size
    const scaledPredictions = scaleMasks(data.data.predictions, data.data.image.width, data.data.image.height, canvas.width, canvas.height);
    // console.log("Scaled predictions:", scaledPredictions);

    // Draw the instance segmentation masks
    drawMasks(scaledPredictions);
}

function scaleMasks(predictions, originalWidth, originalHeight, displayedWidth, displayedHeight) {
    const scaleX = displayedWidth / originalWidth;
    const scaleY = displayedHeight / originalHeight;

    return predictions.map((prediction) => ({
        ...prediction,
        x: prediction.x * scaleX,
        y: prediction.y * scaleY,
        width: prediction.width * scaleX,
        height: prediction.height * scaleY,
        points: prediction.points.map((point) => ({
            x: point.x * scaleX,
            y: point.y * scaleY,
        })),
    }));
}

function drawMasks(predictions) {
    predictions.forEach((prediction) => {
        // Begin a new path for the polygon
        ctx.beginPath();

        // Move to the first point
        ctx.moveTo(prediction.points[0].x, prediction.points[0].y);

        // Draw lines to the remaining points
        prediction.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });

        // Close the path
        ctx.closePath();

        // Set the fill style (e.g., semi-transparent color)
        ctx.fillStyle = "rgba(255, 0, 0, 0.1)"; // Red with 30% opacity

        // Fill the polygon
        ctx.fill();

        // Draw the outline of the polygon
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add a label with the class name and confidence score
        const label = `${prediction.class} (${(prediction.confidence * 100).toFixed(2)}%)`;
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(label, prediction.x, prediction.y - 10);
    });
}
