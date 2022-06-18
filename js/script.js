// Fetch data from the AIC API

// Link to the Artwork of interest for this simple App is: https://www.artic.edu/collection?subject_ids=landscapes&is_public_domain=1&artwork_type_id=Painting

// AIC API documentation can be found here: https://api.artic.edu/docs/#quick-start

// All published Artwork can be found using this endpoint: https://api.artic.edu/api/v1/artworks

// All possible fields: https://api.artic.edu/api/v1/artworks?fields=id,title,artist_display,date_display,main_reference_number

let artWorkRepository = (function() {
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

  let randomPageUrl = "";

  function createRandomPageArtWorkListUrl() {
    let randomPageSelection = Math.round(
      Math.random() * nbOfPagesAvailableInApi
    );

    let randomPageArtWorkListUrl =
      "https://api.artic.edu/api/v1/artworks?page=" +
      randomPageSelection +
      "&limit=" +
      artWorkToShow;

    randomPageUrl = randomPageArtWorkListUrl;

    return randomPageUrl;
  }

  // We fetch data from the AIC API end point and create a JavaScript Object containing the data
  // Then we select the data key that contains the Array of artWorks

  function loadList() {
    createRandomPageArtWorkListUrl();

    return fetch(randomPageUrl)
      .then(response => response.json())
      .then(dataObject => {
        console.log(dataObject);
        console.log(dataObject.data);
        dataObject.data.forEach(item => {
          // We create an Artwork object for each item
          let baseIiifImageApiEndpoint = "https://www.artic.edu/iiif/2/";
          let imageId = item.image_id;
          let imageEnding = "/full/843,/0/default.jpg";
          let builtUrlforImg = baseIiifImageApiEndpoint + imageId + imageEnding;

          // We build the link to the AIC corresponding page
          let artworkId = item.id;
          // console.log('The item id: '+artworkId);
          let aicUrlStart = "https://www.artic.edu/artworks/";
          let builtUrlforAicPage = aicUrlStart + artworkId;
          // console.log(builtUrlforAicPage);

          let artWork = {
            artistName: item.artist_title,
            artistInfos: item.artist_display,
            artworkTitle: item.title,
            artworkTypeTitle: item.artwork_type_title,
            departmentTitle: item.department_title,
            imageId: item.image_id,
            imageUrl: builtUrlforImg,
            artWorkLinkToAic: builtUrlforAicPage
          };
          add(artWork);
        });
      });

    function add(artWork) {
      console.log(artWork);
      if (artWork.artistName === null) {
        artWork.artistName = "Unknown Artist";
        // console.log('There is a missing data');
        artWorkList.push(artWork);
      } else {
        artWorkList.push(artWork);
      }
    }
  }

  function addListItem(artwork) {
    // let listArtwork = document.querySelector('.artwork-list');
    // We define the container for the artworks
    // let containerArtworks = $('.artworks-container');
    let containerArtworks = $(".row-artworks");

    let listItem = $(
      '<div class="col-xl-3 col-lg-4 col-md-6 mt-3 list-item text-center shadow-sm rounded"></div>'
    );
    // containerArtworks.append(listItem);

    // We create button elements for each arwork
    // let buttonArtworks = $('<button class="btn"></button>');
    // buttonArtworks.append('<h1>'+artwork.artistName+'</h1>' + '<p>'+artwork.artworkTitle+'</p>'+'<img class="buttonImg" src='+artwork.imageUrl+'>')
    // console.log("The name of the button: "+artwork.artistName);

    // let buttonArtworks = $('<div class="btn btn-artwork col-lg-3 align-top" style="border: 2px solid blue;"></div>');
    let buttonArtworks = $(
      '<button type="button" class="btn btn-artwork align-top" data-toggle="modal" data-target="#artworkModalCenter"></button>'
    );

    // buttonArtworks.append('<h1>'+artwork.artistName+'</h1>' + '<p>'+artwork.artworkTitle+'</p>'+'<img class="buttonImg img-fluid" src='+artwork.imageUrl+'>');
    buttonArtworks.append("<h1>" + artwork.artistName + "</h1>");
    buttonArtworks.append("<p>" + artwork.artworkTitle + "</p>");

    let imageElement = $('<img class="buttonImg img-fluid mx-auto d-block">');
    imageElement.attr("src", artwork.imageUrl);

    buttonArtworks.append(imageElement);
    // console.log("The name of the button: "+artwork.artistName);

    // Create a button and add it to the DOM
    // let button = document.createElement('button');
    // button.innerHTML = '<h1>'+artwork.artistName+'</h1>' + '<p>'+artwork.artworkTitle+'</p>'+'<img class="buttonImg" src='+artwork.imageUrl+'>';
    // console.log("The name of the button: "+artwork.artistName);

    // We add a class to our button to style it
    // buttonArtworks.addClass('btn');
    listItem.append(buttonArtworks);
    containerArtworks.append(listItem);

    // listItem.appendChild(button);

    // listArtwork.appendChild(listItem);

    // Add an event listener to our button element
    // buttonArtworks.addEventListener('click', function(){
    //   showDetails(artwork);
    // })
    buttonArtworks.on("click", function() {
      showDetails(artwork);
    });
  }

  function showDetails(artwork) {
    showModal(artwork);
  }

  function getAll() {
    return artWorkList;
  }

  // This function is activated only in case User wants to see more (last ten items add)
  function getMore() {
    let latestArtworkList = artWorkList.slice(-10);
    artWorkList = latestArtworkList;
    return artWorkList;
  }

  // Show artworks in the modal using Bootstrap modal

  function showModal(artwork) {
    // We define the elements that will go inside each artwork's modal

    let modalTitleArtistName = $("#artworkModalCenterArtistName");
    modalTitleArtistName.empty();

    let artistNameElement = $(
      "<h5>" + artwork.artistName.toUpperCase() + "</h5>"
    );
    modalTitleArtistName.append(artistNameElement);

    let modalArtworkTitle = $("#artworkModalCenterTitle");
    modalArtworkTitle.empty();

    let artworkTitleElement = $("<h6>" + artwork.artworkTitle + "</h6>");
    modalArtworkTitle.append(artworkTitleElement);

    let modalArtworkImage = $("#artworkModalImage");
    modalArtworkImage.empty();

    let artworkImageElement = $(
      '<img class="modal-img mx-auto d-block" style="width:50%">'
    );
    // artworkImageElement.empty();
    artworkImageElement.attr("src", artwork.imageUrl);
    modalArtworkImage.append(artworkImageElement);

    let btnArtworkLinkToAic = $("#btn-artwork-link-to-aic");
    btnArtworkLinkToAic.attr("href", artwork.artWorkLinkToAic);
  }

  return {
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    getMore: getMore
  };
})();

// Load Artwork from the API
artWorkRepository.loadList().then(function() {
  artWorkRepository.getAll().forEach(function(artwork) {
    return artWorkRepository.addListItem(artwork);
  });
});

// We implement a see more event listener associated to the button-see-more'
let buttonSeeMore = $("#button-see-more");
buttonSeeMore.on("click", loadMore);

// We implement the refresh list event listener associated to the button-refresh-list'
$("#button-refresh-list").on("click", function() {
  window.location.reload();
});

// // Function that would refresh the page when user clicks on the related button
// function refreshArtworkList() {
//   // alert("Hello World");
//   window.location.reload();
// }

function loadMore() {
  artWorkRepository.loadList().then(function() {
    artWorkRepository.getMore().forEach(function(artwork) {
      return artWorkRepository.addListItem(artwork);
    });
  });
}
