window.verifyRecaptchaCallback = function (response) {
    $('input[data-recaptcha]').val(response).trigger('change')
}

window.expiredRecaptchaCallback = function () {
    $('input[data-recaptcha]').val('').trigger('change')
}

$('input[name=interest]').change(function () {
    const currentPage = window.location.pathname;
    const interest = $(this).val();

    if (currentPage.includes('landlord') && interest === 'tenant') {
        window.location.href = '../';
    } else if (!currentPage.includes('landlord') && interest === 'landlord') {
        window.location.href = 'landlord/';
    }
});

$('#buttonSubmit').on('click', function (e) {
    e.preventDefault();

    $('#feedback-success').addClass('d-none');
    $('#feedback-error').addClass('d-none');
    $('#errorMessage').text('');

    const button = $(this);
    const form = $(this).parents('form');

    let hasErrors = false;

    form.find('input').each(function (index, input) {
        if (input.checkValidity() === false) {
            hasErrors = true;
        }
    });

    form.addClass('was-validated');

    if (hasErrors === true) {
        e.stopPropagation();
        return;
    }

    button.prop('disabled', true);

    const formAction = 'https://e2erent.us6.list-manage.com/subscribe/post-json?u=f3fe2fb41852845ea4e39aebc&amp;id=9ff0f8c27f&c=?';

    $.ajax({
        url: formAction,
        method: 'POST',
        data: form.serialize(),
        dataType: 'jsonp',
        success: function (response) {
            if (
                response.result === 'success'
                || (response.result === 'error' && response.msg.includes('already subscribed'))
            ) {
                form[0].reset();
                grecaptcha.reset();
                form.removeClass('was-validated');

                $('#feedback-success').removeClass('d-none');
            } else {
                $('#errorMessage').text(response.msg);

                $('#feedback-error').removeClass('d-none');
            }

            button.prop('disabled', false);
        }
    });
});