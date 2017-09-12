window.onload = function(){
    //Buttons

    var addContactButton = document.getElementById('add-contact'),
        addButton = document.getElementById('add'),
        cancelButton = document.getElementById('cancel'),
        addFormPanel = document.querySelector('.add-panel');
    //document.getElementByClassName('add-panel')[0]

    //Form Fields
    var name = document.getElementById('name'),
        phone = document.getElementById('phone'),
        email = document.getElementById('email'),
        note = document.getElementById('note');

    //Phone Book Display (Book Items)
    var contactsList = document.querySelector('.contacts-list');

    //Create Storage Array
    var phoneBook = [];

    //Event Listeners
    addContactButton.addEventListener('click', function () {
        addFormPanel.style.display = 'block';
    })
};