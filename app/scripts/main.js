window.onload = function(){
    //Buttons
    let addContactButton = document.getElementById('add-contact'),
        addButton = document.getElementById('add'),
        cancelAdding = document.getElementById('cancel-add'),
        addFormPanel = document.querySelector('.add-panel'),
        exportBtn = document.getElementById('export'),
        importBtn = document.getElementById('import'),
        filterInput = document.getElementById('filter');

    //Form Fields
    let firstName = document.getElementById('first-name'),
        lastName = document.getElementById('last-name'),
        countryCode = document.getElementById('country-code'),
        phone = document.getElementById('phone'),
        email = document.getElementById('email'),
        note = document.getElementById('note');

    //Phone Book Display (Book Items)
    let contactsList = document.getElementById('contacts-list');

    //Create Storage Array
    let phoneBook = [];

    //Event Listeners
    addContactButton.addEventListener('click', function() {
        addFormPanel.style.display = 'block';
        contactsList.className += ' hidden';
    });

    cancelAdding.addEventListener('click', function() {
        addFormPanel.style.display = 'none';
        contactsList.classList.remove('hidden');
    });

    addButton.addEventListener('click', addToBook);

    contactsList.addEventListener('click', showContactDetails);
    contactsList.addEventListener('click', removeItem);
    contactsList.addEventListener('click', editItem);

    function jsonStructure(firstName, lastName, countryCode, phone, email, note){
        this.firstName = firstName;
        this.lastName = lastName;
        this.countryCode = countryCode;
        this.phone = phone;
        this.email = email;
        this.note = note;
    }

    //export
    function download(text, name, type) {
        let file = new Blob([text], {type: type});
        exportBtn.href = URL.createObjectURL(file);
        exportBtn.download = name;
    }

    function addToBook(){
        let phoneNumber = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
            filledFull = firstName.value!=='' && lastName.value!=='' && countryCode.value!=='' && phone.value!=='' && phone.value.match(phoneNumber),
            errorMessage = document.querySelector('.error-message');

        if(filledFull){
            //Add fields values to the array & localstorage
            let obj = new jsonStructure(firstName.value,lastName.value,countryCode.value,phone.value,email.value,note.value);
            phoneBook.push(obj);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //Hide the form
            addFormPanel.style.display = 'none';
            //Hide error message
            errorMessage.style.display = 'none';
            //write to file
            download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
            //Updating and displaying all records in the phone book
            showContacts();
            //Clear the form
            clearForm();
        }
        else {
            errorMessage.style.display = 'block';
        }
    }

    function showContactDetails(e) {

        let target = e.target,
            index,
            buttons = target.classList.contains('delete-btn') || target.classList.contains('edit-btn');

        if (!buttons) {
            // цикл двигается вверх от target к родителям до contacts-list_item
            while (target !== this) {
                if (target.className == 'contacts-list_item') {
                    // нашли элемент, который нас интересует!
                    details(target);
                    return;
                }
                target = target.parentNode;
                index = target.id;
            }
        }

        function details() {
            let detailsContainer = document.getElementById('item-details'),
                template = document.getElementById('contactsListItemDetails').innerHTML;

            detailsContainer.innerHTML = '';

            let details = { 'details' : [
                { 'name' : phoneBook[index].firstName + ' ' + phoneBook[index].lastName,
                    'email' : phoneBook[index].email,
                    'phone' : phoneBook[index].countryCode + phoneBook[index].phone,
                    // 'phone' : phoneBook[index].phone,
                    'note' : phoneBook[index].note
                }
            ] };

            let html = Mustache.render(template, details);

            detailsContainer.innerHTML += html;
            detailsContainer.classList.add('shown');

            let cancelView = document.getElementById('cancel-view'),
                showEditFieldsBtn = document.getElementById('show-edit-fields');

            cancelView.onclick = function() {
                detailsContainer.classList.remove('shown');
            };

            showEditFieldsBtn.onclick = function() {
                edit(index);
            };
        }
    }

    function edit(item) {
        let editContainer = document.getElementById('edit-contact-panel'),
            editTemplate = document.getElementById('editContact').innerHTML;

            editContainer.innerHTML = '';

        let edit = { 'edit' : [
            { 'name' : phoneBook[item].firstName + ' ' + phoneBook[item].lastName}
        ] };

        let html = Mustache.render(editTemplate, edit);

        editContainer.innerHTML += html;

        let editCode = document.getElementById('edit-code'),
            editPhone = document.getElementById('edit-phone'),
            editEmail = document.getElementById('edit-email'),
            editNote = document.getElementById('edit-note');

        editCode.value = phoneBook[item].countryCode;
        editPhone.value = phoneBook[item].phone;
        editEmail.value = phoneBook[item].email;
        editNote.value = phoneBook[item].note;

        editContainer.classList.add('shown');

        let cancelEditBtn = document.getElementById('cancel-edit'),
            updateContactBtn = document.getElementById('update-contact');

        cancelEditBtn.addEventListener('click', function () {
            editContainer.classList.remove('shown');
        });

        //rewrite values
        editCode.addEventListener('input', function() {
            phoneBook[item].countryCode = editPhone.value;
        });
        editPhone.addEventListener('input', function() {
            phoneBook[item].phone = editPhone.value;
        });
        editEmail.addEventListener('input', function() {
            phoneBook[item].email = editEmail.value;
        });
        editNote.addEventListener('input', function() {
            phoneBook[item].note = editNote.value;
        });

        updateContactBtn.addEventListener('click', function () {
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //write to file
            download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
            showContacts();
            editContainer.classList.remove('shown');
        });
    }

    function editItem(e) {
        if(e.target.classList.contains('edit-btn')){
            let editID = e.target.getAttribute('data-id');

            edit(editID);
        }
    }

    function removeItem(e) {
        if(e.target.classList.contains('delete-btn')){
            let removingID = e.target.getAttribute('data-id');

            e.target.closest('.contacts-list_item').className +=  ' hiding';

            // Remove the JSOn entry from the array with the index num = remID;
            phoneBook.splice(removingID, 1);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //write to file
            download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
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

            let targetContainer = document.getElementById('contacts-list'),
                template = document.getElementById('contactsListItem').innerHTML;

            targetContainer.innerHTML = '';

            for(let n in phoneBook){
                let shows = { 'shows' : [
                    { 'name' : phoneBook[n].firstName + ' ' + phoneBook[n].lastName,
                        'email' : phoneBook[n].email,
                        'phone' : phoneBook[n].countryCode + phoneBook[n].phone,
                        // 'phone' : phoneBook[n].phone,
                        'dataId' : 'data-id',
                        'id' : n
                    }
                ] };

                let html = Mustache.render(template, shows);
                targetContainer.innerHTML += html;
                contactsList.classList.remove('hidden');
            }
        }
    }

    function loadFileAsText(){
        let uploadInput = document.getElementById('upload'),
            fileToLoad = uploadInput.files[0];

        let fileReader = new FileReader();
        fileReader.readAsText(fileToLoad, "UTF-8");

        fileReader.onload = function(fileLoadedEvent){
            let textFromFileLoaded = fileLoadedEvent.target.result,
                textFromFileLoadedJson = JSON.parse(textFromFileLoaded);
            localStorage['phonebook'] = JSON.stringify((phoneBook.concat(textFromFileLoadedJson)));
            uploadInput.value = '';

            showContacts();
        };
    }

    function filter() {
        let filter = filterInput.value.toUpperCase(),
            contactItem = contactsList.getElementsByClassName('contacts-list_item'),
            contactDetails,
            i;

        for (i = 0; i < contactItem.length; i++) {
            contactDetails = contactItem[i].getElementsByClassName('contact')[0];
            if (contactDetails.innerHTML.toUpperCase().indexOf(filter) > -1) {
                contactItem[i].style.display = '';
            } else {
                contactItem[i].style.display = 'none';
            }
        }
    }

    filterInput.addEventListener('keyup', function () {
        filter();
    });

    importBtn.addEventListener('click', function () {
        loadFileAsText();
    });

    exportBtn.addEventListener('click', download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain'));

    showContacts();
};