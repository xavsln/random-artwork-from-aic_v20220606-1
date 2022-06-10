// Fetch data from the AIC API

// Link to the Artwork of interest for this simple App is: https://www.artic.edu/collection?subject_ids=landscapes&is_public_domain=1&artwork_type_id=Painting

// AIC API documentation can be found here: https://api.artic.edu/docs/#quick-start

// All published Artwork can be found using this endpoint: https://api.artic.edu/api/v1/artworks

// All possible fields: https://api.artic.edu/api/v1/artworks?fields=id,title,artist_display,date_display,main_reference_number

let artWorkRepository = (function () {
// let artWorkListUrl = 'https://api.artic.edu/api/v1/artworks?subject_ids=landscapes&is_public_domain=1&artwork_type_id=Painting&limit=20';

// let artWorkListUrl2 = 'https://api.artic.edu/api/v1/artworks/search?q=landscapes&query[term][is_public_domain]=true&limit=20;'

// let nbOfPagesAvailableInApi = 11614; // Number of pages available in the API as per the 2022-06-06
// let artWorkToShow = 10; // number of Artwork to show
// let randomPageSelection = Math.round(Math.random()*nbOfPagesAvailableInApi);
//
// let randomPageArtWorkListUrl = "https://api.artic.edu/api/v1/artworks?page="+randomPageSelection+"&limit="+artWorkToShow;
//
// console.log(randomPageArtWorkListUrl);

let artWorkList = [];

let nbOfPagesAvailableInApi = 11614; // Number of pages available in the API as per the 2022-06-06
let artWorkToShow = 10; // number of Artwork to show

let randomPageUrl = '';

function createRandomPageArtWorkListUrl (){

  let randomPageSelection = Math.round(Math.random()*nbOfPagesAvailableInApi);

  let randomPageArtWorkListUrl = "https://api.artic.edu/api/v1/artworks?page="+randomPageSelection+"&limit="+artWorkToShow;

  randomPageUrl = randomPageArtWorkListUrl;

  return randomPageUrl;
}


// We fetch data from the AIC API end point and create a JavaScript Object containing the data
// Then we select the data key that contains the Array of artWorks

function loadList(){

  createRandomPageArtWorkListUrl ();

  return fetch(randomPageUrl).then(response => response.json()).then(dataObject => {
    console.log(dataObject);
    console.log(dataObject.data);
    dataObject.data.forEach(item => {
      // We create an Artwork object for each item
      let baseIiifImageApiEndpoint = 'https://www.artic.edu/iiif/2/';
      let imageId = item.image_id;
      let imageEnding = '/full/843,/0/default.jpg';
      let builtUrlforImg = baseIiifImageApiEndpoint+imageId+imageEnding;

      // We build the link to the AIC corresponding page
      let artworkId = item.id;
      console.log('The item id: '+artworkId);
      let aicUrlStart = 'https://www.artic.edu/artworks/';
      let builtUrlforAicPage = aicUrlStart + artworkId;
      console.log(builtUrlforAicPage);

      let artWork = {
        artistName: item.artist_title,
        artistInfos: item.artist_display,
        artworkTitle: item.title,
        artworkTypeTitle: item.artwork_type_title,
        departmentTitle: item.department_title,
        imageId: item.image_id,
        imageUrl: builtUrlforImg,
        artWorkLinkToAic: builtUrlforAicPage
      }
      add(artWork);
    });
  });

  function add(artWork){
    artWorkList.push(artWork);
  }

};

  function addListItem(artwork){
    let listArtwork = document.querySelector('.artwork-list');

    let listItem = document.createElement('li');

    // Create a button and add it to the DOM
    let button = document.createElement('button');
    button.innerHTML = '<h1>'+artwork.artistName+'</h1>' + '<p>'+artwork.artworkTitle+'</p>'+'<img class="buttonImg" src='+artwork.imageUrl+'>';
    console.log("The name of the button: "+artwork.artistName);

    // We add a class to our button to style it
    button.classList.add('btn');
    listItem.appendChild(button);

    listArtwork.appendChild(listItem);

    // Add an event listener to our button element
    button.addEventListener('click', function(){
      showDetails(artwork);
    })
  }


  function showDetails(artwork){
    showModal(artwork);
  }


function getAll(){
  return artWorkList;
}

// This function is activated only in case User wants to see more (last ten items add)
function getMore(){
  let latestArtworkList = artWorkList.slice(-10);
  artWorkList = latestArtworkList;
  return artWorkList;
}


  // We define modalContainer which is the EXISTING #modal-container of our html
  let modalContainer = document.querySelector('#modal-container');
  function showModal(artwork){

    // We define a modal as a <div> that will be CREATED in this JS file
    modalContainer.innerHTML = '';

    // We create a close button element that will trigger the hideModal function of the modal
    let modalCloseButton = document.createElement('button');
    modalCloseButton.innerHTML = 'close';
    modalCloseButton.classList.add('modal-close');
    modalCloseButton.addEventListener('click', hideModal);

    // We create a new div for our Modal
    let modal = document.createElement('div');
    // # We add a class to this modal to give it some styling
    modal.classList.add('modal');

    // # We define the content of our modal
    // ## We define and create the h1 of our modal that will contain the name of the Artwork
    let modalTitle = document.createElement('h1');
    modalTitle.innerText = artwork.artistName.toUpperCase();

    // ## We define and create the p of our modal that will contain the title of the Artwork
    let modalArtworkTitle = document.createElement('p');
    modalArtworkTitle.innerText = artwork.artworkTitle;

    // ## We define and create the <img> of our modal
    let modalImg = document.createElement('img');
    modalImg.src = artwork.imageUrl;
    modalImg.classList.add('modal-img');

    // ## We define and create the http link to the AIC webpage of the artwork
    let modalLinkToAic = document.createElement('a');
    modalLinkToAic.href = artwork.artWorkLinkToAic;
    modalLinkToAic.target = '_blank';
    modalLinkToAic.innerText = 'Link to the Artwork page on AIC'
    modalLinkToAic.classList.add('modalLinkToAic');



    // We append our created elements to the modal
    modal.appendChild(modalCloseButton);
    modal.appendChild(modalTitle);
    modal.appendChild(modalArtworkTitle);
    modal.appendChild(modalImg);
    modal.appendChild(modalLinkToAic);
    // modal.appendChild(modalTypes);
    // We append our modal to our modalContainer
    modalContainer.appendChild(modal);

    // We display the content of our modal
    modalContainer.classList.add('is-visible');

    // console.log(artwork);

  }

  function hideModal(){
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  modalContainer.addEventListener('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });



  return {
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    getMore: getMore
  }
})();


// Load Artwork from the API
artWorkRepository.loadList().then(function() {
  artWorkRepository.getAll().forEach(function(artwork){
    return artWorkRepository.addListItem(artwork);
  });
});


// We implement the refresh list function associated to the button-see-more

let buttonRefreshList = document.querySelector('#button-see-more');

buttonRefreshList.addEventListener("click", loadMore);

// Function that would refresh the page when user clicks on the related button
function refreshArtworkList() {
  // alert("Hello World");
  window.location.reload();
}

function loadMore(){
  artWorkRepository.loadList().then(function() {
    artWorkRepository.getMore().forEach(function(artwork){
      return artWorkRepository.addListItem(artwork);
    });
  });
}
