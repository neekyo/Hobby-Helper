window.onload = () => {
    console.log('IronGenerator JS imported successfully!');

    const msgAdd = document.querySelector('#msgAdd')

    if (msgAdd) {
        msgAdd.addEventListener("click", function(e) {
            e.preventDefault()
            axios.post('/comments', { body: document.querySelector('#chatb0x > textarea').value, category: document.querySelector('.chatTitle').innerHTML })
                .then(response => {
                    console.log("this is the new msg >>>>> ", response.data);
                }).catch(err => console.log("error posting msg ----- ", err));
        }, false)

        setInterval(() => {
            axios.get(`/api/comments/${document.querySelector('.chatTitle').innerHTML}`)
                .then(response => {
                    document.querySelector('#comment-box').innerHTML = ''

                    response.data.forEach(oneMsg => {
                        let newDiv = document.createElement('div')
                        newDiv.setAttribute('class', 'msgDiv')
                        let newAuthor = document.createElement('h6')
                        let newMsg = document.createElement('h5')

                        newAuthor.innerHTML = oneMsg.author.username
                        newMsg.innerHTML = oneMsg.body
                        newDiv.append(newAuthor)
                        newDiv.append(newMsg)

                        document.querySelector('#comment-box').append(newDiv)
                    })
                }).catch(err => console.log("error getting chat <<<<<< ", err));

        }, 1000)
    }
}

function scrollToSearch() {
    var name = document.getElementById('searchForm').elements['searchItem'].value;
    var searchQuery = name.toLowerCase().trim();
    var categoryCardDivs = document.getElementsByClassName('col-sm-3');

    for (var i = 0; i < categoryCardDivs.length; i++) {
        var categoryCardATag = categoryCardDivs[i].getElementsByTagName('a')[0];
        if (categoryCardATag.innerText.toLowerCase().includes(searchQuery)) {
            categoryCardDivs[i].parentNode.scrollIntoView();
            break;
        }
    }
}
