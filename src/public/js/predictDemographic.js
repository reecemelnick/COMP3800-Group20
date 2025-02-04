let birthdate = document.getElementById('birthdate');
let calculateBtn = document.getElementById('form-calculate');

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
