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
    validateFile(e.dataTransfer.files);
})

formFile.addEventListener('change', (e) => {
    if (e.target.files.length != 0 && !validateFile(e.target.files)) {
        e.target.value = ''
    }
})

function updatefileDropText() {
    fileDrop.textContent =
        formFile.files.length > 0
            ? formFile.files[0].name
            : 'Drag and drop a file here or click to select'
}

function validateFile(files) {
    fileDrop.classList.remove('bg-light')

    if (files.length !== 1) {
        alert("Please drop exactly one file.");
        return false
    }
    const fileName = files[0].name
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (!fileExtension.includes('csv')) {
        alert("Please attach .csv files only.");
        return false
    }

    formFile.file = files[0]
    updatefileDropText()
    return true
}