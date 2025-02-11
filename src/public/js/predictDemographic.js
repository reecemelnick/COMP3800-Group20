const form = document.getElementById('predict-form');
const birthdate = document.getElementById('birthdate');
const calculateBtn = document.getElementById('form-calculate');

birthdate.addEventListener('change', (e) => {
    const birthdateVal = e.target.value;
    const split_birthdate = birthdateVal.split("-");
    const year = parseInt(split_birthdate[0]);
    const month = parseInt(split_birthdate[1]);
    const day = parseInt(split_birthdate[2]);

    if (!isValidBirthdate(year, month - 1, day)) {
        document.getElementById('birthdateSelected').innerText = "Invalid birthdate.";
        document.getElementById('birthdateSelected').style.color = "red";
        calculateBtn.disabled = true;
    } else {
        document.getElementById('birthdateSelected').removeAttribute('style');
        document.getElementById('birthdateSelected').innerText = birthdateVal;
        calculateBtn.disabled = false;
    }

});

function isValidBirthdate(birthYear, birthMonth, birthDay) {
    const today = new Date();
    if (today.getFullYear() < birthYear) {
        return false;
    } else if (today.getFullYear() > birthYear) {
        return true;
    } else if (today.getMonth() > birthMonth) {
        return true;
    } else if (today.getMonth() < birthMonth) {
        return false;
    } else if (today.getDate() < birthDay) {
        return false;
    } else if (today.getDate() > birthDay) {
        return true;
    }

    return false;
}

calculateBtn.addEventListener('click', (e) => {
    const probability = 75;

    document.getElementById('probabilityValue').innerText = probability;

});

function updateDropdownButtonText(dropdownButton, dropdownItems) {
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownButton.textContent = item.textContent;
        });
    });
}

function setupDropdownEventListeners() {
    updateDropdownButtonText(document.getElementById('dropdown-location'),
        document.querySelectorAll('#form-field-location .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-socioeconomicstatus'),
        document.querySelectorAll('#form-field-socioeconomicstatus .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-timeinlocation'),
        document.querySelectorAll('#form-field-timeinlocation .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-lifestyle'),
        document.querySelectorAll('#form-field-lifestyle .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-occupation'),
        document.querySelectorAll('#form-field-occupation .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-diet'),
        document.querySelectorAll('#form-field-diet .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-healthhabits'),
        document.querySelectorAll('#form-field-healthhabits .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-healthconcerns'),
        document.querySelectorAll('#form-field-healthconcerns .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-recallfrequency'),
        document.querySelectorAll('#form-field-recallfrequency .dropdown-item'));
    updateDropdownButtonText(document.getElementById('dropdown-referralsource'),
        document.querySelectorAll('#form-field-referralsource .dropdown-item'));
}

function cleanDropdownText(text) {
    console.log("in clean");
    return text.trim().replace(/\n/g, '');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const location = cleanDropdownText(document.getElementById('dropdown-location').textContent);
    const healthHabits = cleanDropdownText(document.getElementById('dropdown-healthhabits').textContent);

    const formData = {
        location: location,
        health_habits: healthHabits
    };

    console.log(formData);
});

setupDropdownEventListeners();
