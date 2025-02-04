const fileDrop = document.getElementById('file-drop')
const formFile = document.getElementById('formFile')
const submit = document.getElementById('submit-btn')

fileDrop.addEventListener('click', () => formFile.click())

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

formFile.addEventListener('change', (e) => {
    if (e.target.files.length !== 0 && !validateFile(e.target.files)) {
        e.target.value = ''
    }
})

submit.addEventListener('click', async (e) => {
    const loadOverlay = document.getElementById('loading-overlay')
    loadOverlay.classList.toggle('d-none')

    const formData = new FormData()
    formData.append('uploaded_file', formFile.file)

    try {
        const response = await fetch('/upload-data', {
            method: 'POST',
            body: formData, // Send the form data containing the file
        })

        if (!response.ok) {
            alert(`Upload error: ${response.status}`)
        }
        const result = await response.json()
        alert('Data uploaded to database')
    } catch (error) {
        alert('Failed to reach server: ' + error.message)
    }
    loadOverlay.classList.toggle('d-none')
})

function updatefileDropText() {
    fileDrop.textContent =
        formFile.file
            ? formFile.file.name
            : 'Drag and drop a file here or click to select'
}

function validateFile(files) {
    fileDrop.classList.remove('bg-light')

    if (files.length !== 1) {
        alert('Please drop exactly one file.')
        return false
    }
    const fileName = files[0].name
    const fileExtension = fileName.split('.').pop().toLowerCase()

    if (!fileExtension.includes('csv')) {
        alert('Please attach .csv files only.')
        return false
    }
    formFile.file = files[0]
    updatefileDropText()
    toggleSubmit(false)
    return true
}

function toggleSubmit(bool) {
    submit.disabled = bool
}