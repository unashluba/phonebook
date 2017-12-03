window.onload = function(){
    //Buttons

    let addContactButton = document.getElementById('add-contact'),
        addButton = document.getElementById('add'),
        cancelAdding = document.getElementById('cancel-add'),
        addFormPanel = document.querySelector('.add-panel');
    //document.getElementByClassName('add-panel')[0]

    //Form Fields
    let firstName = document.getElementById('first-name'),
        lastName = document.getElementById('last-name'),
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

    function jsonStructure(firstName, lastName, phone, email, note){
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.note = note;
    }

    function addToBook(){
        let phoneNumber = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
            filledFull = firstName.value!=='' && lastName.value!=='' && phone.value!=='' && phone.value.match(phoneNumber),
            errorMessage = document.querySelector('.error-message');

        if(filledFull){
            //Add fields values to the array & localstorage
            let obj = new jsonStructure(firstName.value,lastName.value,phone.value,email.value,note.value);
            phoneBook.push(obj);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //Hide the form
            addFormPanel.style.display = 'none';
            //Hide error message
            errorMessage.style.display = 'none';
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
                    'phone' : phoneBook[index].phone,
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
            { 'name' : phoneBook[item].firstName + ' ' + phoneBook[item].lastName,
                'email' : phoneBook[item].email,
                'phone' : phoneBook[item].phone,
                'note' : phoneBook[item].note
            }
        ] };

        let html = Mustache.render(editTemplate, edit);

        editContainer.innerHTML += html;
        editContainer.classList.add('shown');

        let cancelEditBtn = document.getElementById('cancel-edit');

        cancelEditBtn.addEventListener('click', function () {
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
                        'phone' : phoneBook[n].phone,
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

    showContacts();
};