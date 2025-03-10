const form = document.getElementById('predict-form');
const birthdate = document.getElementById('birthdate');
const calculateBtn = document.getElementById('form-calculate');
const sex_buttons = document.querySelectorAll("#form-field-sex .form-check input");
const toggle_form_btn = document.getElementById('flexSwitchCheckDefault');
const toggle_form_label = document.getElementById('switch-label');

toggle_form_btn.addEventListener('change', () => {
    if (toggle_form_btn.checked) {
        toggle_form_label.textContent = 'Biological Preference Probability'
    } else {
        toggle_form_label.textContent = 'Buyer Probability'
    }
})

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
    document.getElementById('probabilityValue').textContent = "Loading...";

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
    text = text.trim().replace(/\n/g, '');
    if (text === 'N/A' || text == 'Select') {
        text = "unknown";
    }
    return text;
}

function getSelectedRadio(buttons) {
    let selected_button;
    buttons.forEach((button) => {
        if (button.hasAttribute("checked")) {
            selected_button = button;
        }
    })
    return selected_button;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const gender = getSelectedRadio(document.querySelectorAll('#form-field-sex input[type="radio"]')).value;
    const diet = cleanDropdownText(document.getElementById('dropdown-diet').textContent);
    const health_concern = cleanDropdownText(document.getElementById('dropdown-healthconcerns').textContent);
    const economic_status = cleanDropdownText(document.getElementById('dropdown-socioeconomicstatus').textContent);
    const health_habits = cleanDropdownText(document.getElementById('dropdown-healthhabits').textContent);

    // For model v1
    // const formData = {
    //     // sex: sex,
    //     location: location,
    //     health_habits: healthHabits
    // };
    const formData = {
        gender: gender,
        diet: diet,
        health_concern: health_concern,
        economic_status: economic_status,
        health_habits: health_habits
    };

    try {
        let endpoint = toggle_form_btn.checked ? '/predict/treatment-preference' : '/predict/buyer';

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            console.log(`Response status: ${res.status}`);
            return;
        }

        const result = await res.json();
        if (toggle_form_btn.checked) {
            document.getElementById("probabilityValue").innerHTML =
                `${result.data.non_predicted_class}: ${100 * result.data.probability_for_non_predicted_class.toFixed(2)}%<br>` +
                `${result.data.predicted_class}: ${100 * result.data.probability_for_predicted_class.toFixed(2)}%`;
        } else {
            let probabilities = "";
            for ([key, value] of Object.entries(result.data.class_probabilities)) {
                probabilities += `${key}: ${(value * 100).toFixed(2)}%<br>`;
            }
            document.getElementById("probabilityValue").innerHTML = probabilities;
        }

    } catch (err) {
        console.error(err.message);
    }

});

setupDropdownEventListeners();
