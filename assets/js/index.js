function fetchSuggestions(searchTerm, callback) {
    fetch('https://tech.agence-markus.com/librairies/getCity.php?term=' + encodeURIComponent(searchTerm))
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {

    let inputField = document.getElementById('inputVilleCP');
    let suggestionBox = document.getElementById('suggestionBox');
    let phoneInput = document.getElementById('inputTelephone');
    let errorSpan = document.getElementById('telephoneError');
    var form = document.getElementById('form');


    form.addEventListener('submit', function(event) {
        var phoneValue = phoneInput.value;
        if (!isValidPhoneNumber(phoneValue)) {
            errorSpan.style.display = 'block';
            event.preventDefault(); // Empêche l'envoi du formulaire
        } else {
            errorSpan.style.display = 'none';
        }
    });

    // Affiche les suggestions lorsque le champ de saisie a le focus
    inputField.addEventListener('focus', function() {
        if (this.value.length > 1) {
            fetchSuggestions(this.value, function(suggestions) {
                updateSuggestionBox(suggestions, suggestionBox, inputField);
            });
        }
    });

    // Cache les suggestions lorsque le champ de saisie perd le focus
    inputField.addEventListener('blur', function() {
        setTimeout(function() { // Utilisez setTimeout pour permettre la sélection d'une suggestion
            suggestionBox.style.display = 'none';
        }, 100); // Un léger délai permet de cliquer sur une suggestion avant qu'elle ne disparaisse
    });

    inputField.addEventListener('input', function() {
        var searchTerm = this.value;
        if (searchTerm.length > 1) {
            fetchSuggestions(searchTerm, function(suggestions) {
                updateSuggestionBox(suggestions, suggestionBox, inputField);
            });
        } else {
            suggestionBox.style.display = 'none';
        }
    });
});



function updateSuggestionBox(suggestions, suggestionBox, inputField) {
    suggestionBox.innerHTML = '';
    suggestions.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'suggestion';
        div.textContent = item.label;
        div.addEventListener('click', function() {
            inputField.value = this.textContent;
            suggestionBox.style.display = 'none';
        });
        suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = suggestions.length > 0 ? 'block' : 'none';
}

function isValidPhoneNumber(phoneNumber) {
    var regex = /^(?:\+\d{1,3}\s?)?\d{10}$/;
    return regex.test(phoneNumber);
}