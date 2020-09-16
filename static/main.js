const settings = {
    bcDateMinMonth: 1,
    bcDateMaxMonth: 12,
    bcDateMinYear: 20,
    bcDateMaxYear: 25,
    bcCvcLength: 3
};

// события клиента
const eventsToListen = ["input", "keydown", "keyup"];

const checkLuhn = (card) => {
    var s = 0;
    var doubleDigit = false;
    for (var i = card.length - 1; i >= 0; i--) {
        var digit = +card[i];
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
    }
    return s % 10 == 0;
};


const numberValidation = () => {
    const value = $('#bc-number').val();
    const regexp = new RegExp("^[0-9]{4}");


    const tmp = value.split('-');
    if (tmp.length !== 4) {
        return false;
    }

    for (let i = 0; i < 4; i++) {
        if (!regexp.test(tmp[i])) {
            return false;
        }
    }

    let hui = value.split('-').join('');


    return checkLuhn(hui);
};

const dateValidation = ()=> {
    const value = $('#bc-date').val();
    const tmp = value.split('/');
    if (tmp.length !== 2) {
        return false;
    }
    const month = tmp[0];
    if (month.length > 2 || month < settings.bcDateMinMonth || month > settings.bcDateMaxMonth) {
        return false;
    }

    const year = tmp[1];
    if (year.length > 2 || year < settings.bcDateMinYear || year > settings.bcDateMaxYear) {
        return false;
    }

    return true;
};

const cvcValidation = function () {
    const value = $('#bc-cvc').val();
    return value.length === settings.bcCvcLength && $.isNumeric(value);
};


const holderValidation = ()=> {

    const value = $('#bc-holder').val();
    const regex = new RegExp("^[A-Z]+$");
    const tmp = value.split(' ');
    return tmp.length === 2 && regex.test(tmp[0]) && regex.test(tmp[1]);

};


const validateAll = ()=> {
    return numberValidation() && dateValidation() && cvcValidation() && holderValidation();
};


const addMasks = ()=> {
    $('#bc-date').mask("99/99");
    $('#bc-cvc').mask('999');
    $('#bc-number').mask("9999-9999-9999-9999");
};

const disableFields = elements => {

    elements.forEach(element => {
        element.addClass('disabled');
        element.val('');
    });
};

const preventDisabledFieldsInput = ()=> {

    $('#bc-form .form-control').on(eventsToListen.join(' '), function (event) {
        if ($(this).hasClass('disabled')) {
            event.preventDefault();
        }
    });

};

const addNumberListener = ()=> {

    $('#bc-number').on(eventsToListen.join(' '), ()=> {

        if (numberValidation()) {
            $('#bc-date').removeClass('disabled');
        } else {
            disableFields([$('#bc-date'), $('#bc-cvc'), $('#bc-holder'), $('#btn')]);
        }

    });

};


const addDateListener = ()=> {

    $('#bc-date').on(eventsToListen.join(' '), ()=> {

        if (dateValidation()) {
            $('#bc-cvc').removeClass('disabled');
        } else {
            disableFields([$('#bc-cvc'), $('#bc-holder'), $('#btn')]);
        }
    });

};


const addCvcListener = ()=> {

    $('#bc-cvc').on(eventsToListen.join(' '), ()=> {

        if (cvcValidation()) {
            $('#bc-holder').removeClass('disabled');
        } else {
            disableFields([$('#bc-holder'), $('#btn')]);
        }

    });

};


const addHolderListener = ()=> {
    $('#bc-holder').on(eventsToListen.join(' '), function () {
        $(this).val($(this).val().toUpperCase());
        if (holderValidation()) {
            $('#btn').removeClass('disabled');
        } else {
            disableFields([$('#btn')]);
        }
    });
};

const saveToLocalStorage = ()=> {

    localStorage.formObject = JSON.stringify({
        bcNumber: $('#bc-number').val(),
        bcDate: $('#bc-date').val(),
        bcCvc: $('#bc-cvc').val(),
        bcHolder: $('#bc-holder').val()
    });

};
/*
const addSubmitListener = () => {
    $('#bc-form').submit(event =>  {
        event.preventDefault();
        if ($('#btn').hasClass('disabled')) {
            return;
        }

        // Доп. валид. (инспект)
        if (!validateAll()) {
            $('#bc-form').reset();
            disableFields([$('#bc-date'), $('#bc-cvc'), $('#bc-holder'), $('#btn')]);
            return;
        }

        saveToLocalStorage();
        console.log(JSON.parse(localStorage.formObject));
    });
};

 */

const addListeners = ()=> {
    preventDisabledFieldsInput();
    addNumberListener();
    addDateListener();
    addCvcListener();
    addHolderListener();
   // addSubmitListener();
};


$(document).ready(()=> {
    addMasks();
    addListeners();
});