document.addEventListener('DOMContentLoaded', function () {
    fetch('/html/nav.html')
        .then(response => response.text())
        .then(navbarHTML => {
            const navbarContainer = document.getElementById('nav-placeholder')
            if (navbarContainer) {
                navbarContainer.innerHTML = navbarHTML
            }
        })
        .catch(error => console.error('Error fetching navbar:', error))
})