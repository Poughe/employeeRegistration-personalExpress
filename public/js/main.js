let edit = document.getElementsByClassName("fa-fa-pencil");
let trash = document.getElementsByClassName("fa-trash");

Array.from(edit).forEach(function (element) {
    element.addEventListener('click', function () {
        fetch('update', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'phone': phone,
                'pronoun': pronoun
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    });
});

Array.from(trash).forEach(function (element) {
    element.addEventListener('click', function () {
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('employee', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.id
            })
        }).then(function (response) {
            window.location.reload()
        })
    })
})