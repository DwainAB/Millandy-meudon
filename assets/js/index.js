//Appel api des villes
function fetchSuggestions(searchTerm, callback) {
    fetch('https://tech.agence-markus.com/librairies/getCity.php?term=' + encodeURIComponent(searchTerm))
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error:', error));
}

//Une fois que tous est chargé
document.addEventListener('DOMContentLoaded', function() {

    let inputField = document.getElementById('inputVilleCP');
    let suggestionBox = document.getElementById('suggestionBox');
    let phoneInput = document.getElementById('inputTelephone');
    let errorSpan = document.getElementById('telephoneError');
    let form = document.getElementById('form');

    //Quand le formulaire est soumis gère le message d'erreur
    form.addEventListener('submit', function(event) {
        let phoneValue = phoneInput.value;
        if (!isValidPhoneNumber(phoneValue)) {
            errorSpan.style.display = 'block';
            event.preventDefault(); 
        } else {
            errorSpan.style.display = 'none';
        }
    });

    // lorsque que l'input est sélectionné affiche les villes en fonction de la valeur ecrite dans l'input
    inputField.addEventListener('focus', function() {
        if (this.value.length > 1) {
            fetchSuggestions(this.value, function(suggestions) {
                updateSuggestionBox(suggestions, suggestionBox, inputField);
            });
        }
    });

    //Affiche les villes à chaque changement dans l'input
    inputField.addEventListener('input', function() {
        let searchTerm = this.value;
        if (searchTerm.length > 1) {
            fetchSuggestions(searchTerm, function(suggestions) {
                updateSuggestionBox(suggestions, suggestionBox, inputField);
            });
        } else {
            suggestionBox.style.display = 'none';
        }
    });
});

    // lorsque que l'input n'est plus sélectionné on cache les villes
    inputField.addEventListener('blur', ()=> {
        setTimeout(function() { 
            suggestionBox.style.display = 'none';
        }, 100); 
    });




//Affiche toutes les villes récupéré dans une div
function updateSuggestionBox(suggestions, suggestionBox, inputField) {
    suggestionBox.innerHTML = '';

    suggestions.forEach(function(item) {
        let div = document.createElement('div');
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

//verifie le champs du formulaire qui gère le téléphone
function isValidPhoneNumber(phoneNumber) {
    let regex = /^(?:\+\d{1,3}\s?)?\d{10}$|^\+\d{1,3}\d{9}$/;
    return regex.test(phoneNumber);
}
