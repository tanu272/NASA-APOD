//Scraping NASA's APOD images using NASA's API

const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.Save-conf');
const loader = document.querySelector('.loader');


//NASA API
const count = 10;
const apiKey = 'SH3XhwDv8EU1JlBBZcXhZwvxsY37o18paCmrcKlT';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showcontent(page) {
    window.scrollTo({ top: 0, behavior: 'instant'});
    if(page === 'results')
    {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    }
    else
    {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    //console.log(page, currentArray);
    currentArray.forEach((result) => {
        const card = document.createElement('div');
        card.classList.add('card');
        //link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //card titile
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent= result.title;
        //Save Text
        const saveText= document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results')
        {
            saveText.textContent = 'Add to Favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        }
        else
        {
            saveText.textContent = 'Remove from Favourites';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }

        //Card Text
        const cardText =document.createElement('p');
        cardText.textContent = result.explanation;
        //Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //Copyright
        const copyrightResult = result.copyright === undefined? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        //Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    //get from local storage
    if(localStorage.getItem('nasafaves')) {
        favourites = JSON.parse(localStorage.getItem('nasafaves'));
        console.log('from storage', favourites);
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showcontent(page);
}

async function getNasaPictures() {
    //loader
    loader.classList.remove('hidden');
    try{
        const response= await fetch(apiUrl);
        resultsArray = await response.json();
        //console.log(resultsArray);
        updateDOM('results');
    } catch(error) {
        //catch errors
    }
}

function saveFavourite(itemURL){
    resultsArray.forEach((item) => {
        if(item.url.includes(itemURL) && !favourites[itemURL]) {
            favourites[itemURL] =item;
            //console.log(JSON.stringify(favourites));
            saveConfirmed.hidden =false;
            setTimeout(()=> {
                saveConfirmed.hidden =true;
            }, 2000);
            //set favourites in local storage
            localStorage.setItem('nasafaves', JSON.stringify(favourites));
        }
    });
}

function removeFavourite(itemURl) {
    if(favourites[itemURl]) {
        delete favourites[itemURl];
        //set favourites in local storage
        localStorage.setItem('nasafaves', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

//on load
getNasaPictures();
