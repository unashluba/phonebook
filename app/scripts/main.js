window.onload = function(){
    //Buttons

    let addContactButton = document.getElementById('add-contact'),
        addButton = document.getElementById('add'),
        cancelButton = document.getElementById('cancel'),
        addFormPanel = document.querySelector('.add-panel');
    //document.getElementByClassName('add-panel')[0]

    //Form Fields
    let name = document.getElementById('name'),
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
    });

    cancelButton.addEventListener('click', function () {
        addFormPanel.style.display = 'none';
    });

    addButton.addEventListener('click', addToBook);

    function jsonStructure(name, phone, email, note){
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.note = note;
    }
    
    function addToBook(){
        // TODO develop validation
        let filledFull = name.value!=='' && phone.value!=='' && email.value!=='' && note.value!=='';

        if(filledFull){
            //Add fields values to the array & localstorage
            let obj = new jsonStructure(name.value,phone.value,email.value,note.value);
            phoneBook.push(obj);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //Hide the form
            addFormPanel.style.display = 'none';
            //Clear the form
            clearForm();
            //Updating and displaying all records in the phone book
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
                str += '<div class="icon"><i class="fa fa-address-book-o" aria-hidden="true"></i></div>'
            }
        }
    }
};