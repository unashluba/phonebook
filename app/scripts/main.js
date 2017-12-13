window.onload = function () {
    let fileToLoad,
        textFromFileLoaded,
        textFromFileLoadedJson;

    //Buttons
    let addContactButton = document.getElementById('add-contact'),
        addButton = document.getElementById('add'),
        cancelAdding = document.getElementById('cancel-add'),
        addFormPanel = document.querySelector('.add-panel'),
        exportBtn = document.getElementById('export'),
        importBtn = document.getElementById('import'),
        filterInput = document.getElementById('filter'),
        countriesCount = document.getElementById('countries'),
        uploadBaseBtn = document.getElementById('upload-base-btn'),
        seeCountriesBtn = document.getElementById('see-countries-btn'),
        back = document.getElementById('back-to-contacts');

    //Form Fields
    let firstName = document.getElementById('first-name'),
        lastName = document.getElementById('last-name'),
        countryCode = document.getElementById('country-code'),
        phone = document.getElementById('phone'),
        email = document.getElementById('email'),
        note = document.getElementById('note');

    //DOM Elements
    let contactsList = document.getElementById('contacts-list'),
        loadBasePanel = document.querySelector('.load-base-panel'),
        successfulUploadBlock = document.querySelector('.successful-upload-block'),
        uploadInput = document.getElementById('upload');

    //Arrays
    let phoneBook = [],
        countryCodeBase = [],
        codesOfPhoneBook = [];

    //Event Listeners
    addButton.addEventListener('click', addToBook);
    contactsList.addEventListener('click', showContactDetails);
    contactsList.addEventListener('click', removeItem);
    contactsList.addEventListener('click', editItem);
    countriesCount.addEventListener('click', countries);

    back.addEventListener('click', function () {
        document.getElementById('countries-count-panel').classList.remove('shown');
        loadBasePanel.style.display = 'none';
    });

    addContactButton.addEventListener('click', function () {
        addFormPanel.style.display = 'block';
        contactsList.className += ' hidden';
    });

    cancelAdding.addEventListener('click', function () {
        addFormPanel.style.display = 'none';
        contactsList.classList.remove('hidden');
    });

    importBtn.disabled = true;
    uploadInput.addEventListener('change', function () {
        if (uploadInput.value != '') {
            importBtn.removeAttribute('disabled');
        }
    });

    importBtn.addEventListener('click', function () {
        loadFileAsText();
    });

    exportBtn.addEventListener('click', function () {
        download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
    });

    filterInput.addEventListener('keyup', function () {
        filter();
    });

    seeCountriesBtn.addEventListener('click', function () {
        showCountries();
    });

    function jsonStructure(firstName, lastName, countryCode, phone, email, note) {
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

    function addToBook() {
        //TODO validation for email
        let phoneNumber = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
            filledFull = firstName.value !== '' && lastName.value !== '' && countryCode.value !== '' && phone.value !== '' && phone.value.match(phoneNumber),
            errorMessage = document.querySelector('.error-message');

        if (filledFull) {
            //Add fields values to the array & localstorage
            let obj = new jsonStructure(firstName.value, lastName.value, countryCode.value, phone.value, email.value, note.value);
            phoneBook.push(obj);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            addFormPanel.style.display = 'none';
            errorMessage.style.display = 'none';
            //write to file
            download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
            showContacts();
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
            while (target !== this) {
                if (target.className == 'contacts-list_item') {
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

            let details = {
                'details': [
                    {
                        'name': phoneBook[index].firstName + ' ' + phoneBook[index].lastName,
                        'email': phoneBook[index].email,
                        'phone': phoneBook[index].countryCode + phoneBook[index].phone,
                        'note': phoneBook[index].note
                    }
                ]
            };

            let html = Mustache.render(template, details);

            detailsContainer.innerHTML += html;
            detailsContainer.classList.add('shown');

            let cancelView = document.getElementById('cancel-view'),
                showEditFieldsBtn = document.getElementById('show-edit-fields');

            cancelView.addEventListener('click', function () {
                detailsContainer.classList.remove('shown');
            });

            showEditFieldsBtn.addEventListener('click', function () {
                edit(index);
            });
        }
    }

    function edit(item) {
        let editContainer = document.getElementById('edit-contact-panel'),
            editTemplate = document.getElementById('editContact').innerHTML;

        editContainer.innerHTML = '';

        let edit = {
            'edit': [
                {'name': phoneBook[item].firstName + ' ' + phoneBook[item].lastName}
            ]
        };

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
        editCode.addEventListener('input', function () {
            phoneBook[item].countryCode = editCode.value;
        });
        editPhone.addEventListener('input', function () {
            phoneBook[item].phone = editPhone.value;
        });
        editEmail.addEventListener('input', function () {
            phoneBook[item].email = editEmail.value;
        });
        editNote.addEventListener('input', function () {
            phoneBook[item].note = editNote.value;
        });

        updateContactBtn.addEventListener('click', function () {
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
            showContacts();
            editContainer.classList.remove('shown');
        });
    }

    function editItem(e) {
        if (e.target.classList.contains('edit-btn')) {
            let editID = e.target.getAttribute('data-id');

            edit(editID);
        }
    }

    function removeItem(e) {
        if (e.target.classList.contains('delete-btn')) {
            let removingID = e.target.getAttribute('data-id');

            //TODO chack closest support
            e.target.closest('.contacts-list_item').className += ' hiding';

            // Remove the JSOn entry from the array with the index num = remID;
            phoneBook.splice(removingID, 1);
            localStorage['phonebook'] = JSON.stringify(phoneBook);
            //write to file
            download(JSON.stringify(phoneBook), 'phonebook.json', 'text/plain');
        }
    }

    function clearForm() {
        let formField = document.querySelectorAll('.form-field');
        for (let i in formField) {
            formField[i].value = '';
        }
    }

    function showContacts() {
        if (localStorage['phonebook'] === undefined) {
            localStorage['phonebook'] = '[]';
        } else {
            phoneBook = JSON.parse(localStorage['phonebook']);

            let targetContainer = document.getElementById('contacts-list'),
                template = document.getElementById('contactsListItem').innerHTML;

            targetContainer.innerHTML = '';

            for (let n in phoneBook) {
                let shows = {
                    'shows': [
                        {
                            'name': phoneBook[n].firstName + ' ' + phoneBook[n].lastName,
                            'email': phoneBook[n].email,
                            'phone': phoneBook[n].countryCode + phoneBook[n].phone,
                            'dataId': 'data-id',
                            'id': n
                        }
                    ]
                };

                let html = Mustache.render(template, shows);
                targetContainer.innerHTML += html;
                contactsList.classList.remove('hidden');
            }
        }
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

    function firstCodeBaseUpload() {
        let uploadBaseInput = document.getElementById('upload-code-base');
        uploadBaseBtn.disabled = true;

        uploadBaseInput.addEventListener('change', function () {
            if (uploadBaseInput.value != '') {
                uploadBaseBtn.removeAttribute('disabled');
            }
        });
    }

    function loadFileAsText() {
        fileToLoad = uploadInput.files[0];
        let fileReader = new FileReader();
        fileReader.readAsText(fileToLoad, 'UTF-8');

        fileReader.onload = function (fileLoadedEvent) {
            textFromFileLoaded = fileLoadedEvent.target.result;
            textFromFileLoadedJson = JSON.parse(textFromFileLoaded);
            localStorage['phonebook'] = JSON.stringify((phoneBook.concat(textFromFileLoadedJson)));
            uploadInput.value = '';
            importBtn.disabled = true;
            showContacts();
        };
    }

    function showCountries() {
        countryCodeBase = JSON.parse(localStorage['codeBase']);

        for (let i = 0; i < phoneBook.length; i++) {
            codesOfPhoneBook.push(phoneBook[i].countryCode);
        }

        let counts = {};
        codesOfPhoneBook.forEach(function (e) {
            for (let k in countryCodeBase) {
                let code = countryCodeBase[k].countryCode.slice(1).replace(/\s/g, '');
                if (e === code) {
                    e = countryCodeBase[k].name;
                }
            }
            counts[e] = (counts[e] || 0) + 1;
        });

        let targetContainer = document.getElementById('countries-count'),
            template = document.getElementById('countriesCount').innerHTML;

        targetContainer.innerHTML = '';

        document.getElementById('countries-count-panel').classList.add('shown');

        for (let key in counts) {
            let countriesCount = {
                'countriesCount': [
                    {
                        'country': key,
                        'count': counts[key]
                    }
                ]
            };

            let html = Mustache.render(template, countriesCount);
            targetContainer.innerHTML += html;
        }
    }

    function countries() {
        if (localStorage['codeBase'] === undefined) {

            loadBasePanel.style.display = 'block';

            firstCodeBaseUpload();

            function uploadCodeBase() {
                uploadInput = document.getElementById('upload-code-base');
                fileToLoad = uploadInput.files[0];
                let fileReader = new FileReader();
                fileReader.readAsText(fileToLoad, 'UTF-8');
                fileReader.onload = function (fileLoadedEvent) {
                    let textFromFileLoaded = fileLoadedEvent.target.result,
                        textFromFileLoadedJson = JSON.parse(textFromFileLoaded);
                    uploadInput.value = '';

                    countryCodeBase = textFromFileLoadedJson;
                    localStorage['codeBase'] = JSON.stringify(countryCodeBase);
                }
            }

            uploadBaseBtn.addEventListener('click', function () {
                uploadCodeBase();

                successfulUploadBlock.style.display = 'block';
            });
        } else {
            showCountries();
        }
    }

    showContacts();
};