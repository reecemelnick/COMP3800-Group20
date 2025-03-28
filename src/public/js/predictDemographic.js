const form = document.getElementById('predict-form');
const birthdate = document.getElementById('birthdate');
const calculateBtn = document.getElementById('form-calculate');
// const sex_buttons = document.querySelectorAll("#form-field-sex .form-check input");
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

async function initDropdown(dropdownBtn) {
    data = { "key": dropdownBtn.value }
    try {
        const res = await fetch('/predict/dropdowns', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            console.log(`Response status: ${res.status}`);
            return;
        }
        const result = await res.json();
        populateDropdown(dropdownBtn, result)
    } catch (err) {
        console.error(err.message);
    }

}

function setupDropdowns() {
    initDropdown(document.getElementById('dropdown-socioeconomicstatus'));
    initDropdown(document.getElementById('dropdown-diet'));
    initDropdown(document.getElementById('dropdown-healthhabits'));
    initDropdown(document.getElementById('dropdown-healthconcerns'));
}

function populateDropdown(dropdownBtn, jsonData) {
    const dropdown_menu = document.getElementById(`dropdown-menu-${dropdownBtn.value}`)
    data = jsonData.data[dropdownBtn.value]
    data.forEach((field) => {
        if (field) {
            dropdown_menu.innerHTML += `
                <li><a class="dropdown-item" >${field}</a></li>
            `
        }
    })
    const dropdowns = document.querySelectorAll(`#form-field-${dropdownBtn.value} .dropdown-item`)
    dropdowns.forEach((item) => {
        item.addEventListener('click', () => {
            dropdownBtn.textContent = item.textContent
        })
    })
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

    const loadOverlay = document.getElementById('loading-overlay')
    loadOverlay.classList.toggle('d-none')

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
            loadOverlay.classList.toggle('d-none')
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

    loadOverlay.classList.toggle('d-none')
});

setupDropdowns();
