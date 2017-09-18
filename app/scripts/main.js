window.onload = function(){
    //Buttons

    let addContactButton = document.getElementById('add-contact'),
        addButton = document.getElementById('add'),
        cancelButton = document.getElementById('cancel'),
        addFormPanel = document.querySelector('.add-panel');
    //document.getElementByClassName('add-panel')[0]

    //Form Fields
    let firstName = document.getElementById('first-name'),
        lastName = document.getElementById('last-name'),
        phone = document.getElementById('phone'),
        email = document.getElementById('email'),
        note = document.getElementById('note');

    //Phone Book Display (Book Items)
    let contactsList = document.querySelector('.contacts-list');

    //Create Storage Array
    let phoneBook = [];

    //Event Listeners
    addContactButton.addEventListener('click', function () {
        addFormPanel.style.display = 'block';
        contactsList.className += ' hidden';
    });

    cancelButton.addEventListener('click', function () {
        addFormPanel.style.display = 'none';
        contactsList.classList.remove('hidden');
    });

    addButton.addEventListener('click', addToBook);

    contactsList.addEventListener('click', removeItem);

    function jsonStructure(firstName, lastName, phone, email, note){
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.note = note;
    }
    
    function addToBook(){
        let filledFull = firstName.value!=='' && lastName.value!=='' && phone.value!=='' && email.value!=='' && note.value!=='';

        if(filledFull){
            //Add fields values to the array & localstorage
            let obj = new jsonStructure(firstName.value,lastName.value,phone.value,email.value,note.value);
            phoneBook.push(obj);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //Hide the form
            addFormPanel.style.display = 'none';
            //Updating and displaying all records in the phone book
            showContacts();
            //Clear the form
            clearForm();
        }
    }
    
    function removeItem(e) {
        if(e.target.classList.contains('delete-btn')){
            let removingID = e.target.getAttribute('data-id');

            e.target.closest('.contacts-list_item').className +=  ' hiding';

            // Remove the JSOn entry from the array with the index num = remID;
            phoneBook.splice(removingID, 1);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
        }
    }

    function clearForm(){
        let formField = document.querySelectorAll('.form-field');
        for(let i in formField){
            formField[i].value = '';
        }
    }

    function showContacts(){
        //Check if the key 'phonebook' exists in localstorage or else create it
        //If it exists, load contents from the localstorage and loop > display it on the page
        if(localStorage['phonebook'] === undefined){
            localStorage['phonebook'] = '[]';
        } else {
            phoneBook = JSON.parse(localStorage['phonebook']);
            contactsList.innerHTML = '';
            for(let n in phoneBook){
                let str = '<div class="contacts-list_item">';
                    str += '<div class="icon"><i class="fa fa-address-book-o" aria-hidden="true"></i></div>';
                    str += '<div class="contact"><p class="name">' + phoneBook[n].firstName + ' ' + phoneBook[n].lastName + '</p>';
                    str += '<p class="mail">' + phoneBook[n].email + '</p>';
                    str += '<p class="phone">' + phoneBook[n].phone + '</p></div>';
                    str += '<div class="edit"><i class="fa fa-pencil" aria-hidden="true"></i></div>';
                    str += '<div class="delete"><i class="fa fa-plus-circle delete-btn" data-id="' + n + '" aria-hidden="true"></i></div>';
                    str += '</div>';
                    contactsList.innerHTML += str;
                    contactsList.classList.remove('hidden');
            }
        }
    }

    showContacts();
};