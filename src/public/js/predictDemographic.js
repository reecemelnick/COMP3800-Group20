let birthdate = document.getElementById('birthdate')

birthdate.addEventListener('change', (e) => {
    const birthdateVal = e.target.value;
    document.getElementById('birthdateSelected').innerText = birthdateVal;

    const split_birthdate = birthdateVal.split("-");
    const year = parseInt(split_birthdate[0]);
    const month = parseInt(split_birthdate[1]);
    const day = parseInt(split_birthdate[2]);

});

let calculateBtn = document.getElementById('form-calculate');

calculateBtn.addEventListener('click', (e) => {
    const probability = 75;

    document.getElementById('probabilityValue').innerText = probability;

});
