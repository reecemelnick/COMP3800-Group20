const dropZone = document.getElementById('dropZone')
const formFile = document.getElementById('formFile')

dropZone.addEventListener('click', () => formFile.click())

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('bg-light')
})

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('bg-light')
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('bg-light')

    files = e.dataTransfer.files

    if (files.length !== 1) {
        alert("Please drop exactly one file.");
        return;
    }

    formFile.files = e.dataTransfer.files
    updateDropZoneText()
    console.log(formFile.files)
})

formFile.addEventListener('change', updateDropZoneText)

function updateDropZoneText() {
    dropZone.textContent =
        formFile.files.length > 0
            ? formFile.files[0].name
            : 'Drag and drop a file here or click to select'
}