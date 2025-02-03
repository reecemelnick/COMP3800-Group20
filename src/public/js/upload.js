const fileDrop = document.getElementById('file-drop')
const formFile = document.getElementById('formFile')

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
    fileDrop.classList.remove('bg-light')

    files = e.dataTransfer.files

    if (files.length !== 1) {
        alert("Please drop exactly one file.");
        return;
    }
    const fileName = files[0].name
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (!fileExtension.includes('csv')) {
        alert("Please attach .csv files only.");
        return;
    }

    formFile.files = e.dataTransfer.files
    updatefileDropText()
    console.log(formFile.files)
})

formFile.addEventListener('change', updatefileDropText)

function updatefileDropText() {
    fileDrop.textContent =
        formFile.files.length > 0
            ? formFile.files[0].name
            : 'Drag and drop a file here or click to select'
}