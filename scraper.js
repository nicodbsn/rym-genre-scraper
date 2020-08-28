// SC variables
var recordArtist = document.querySelector('[itemprop="creator"] a span[itemprop="name"]').innerHTML.trim();
var formattedRecordArtist = recordArtist.split(' ').join('+');
var recordTitle = document.querySelector('[itemprop="name"]').innerHTML.trim();
var formattedRecordTitle = recordTitle.split(' ').join('+');
var detailsSection = document.getElementsByClassName('pvi-productDetails');
// RYM variables
var mainGenres;
var secondaryGenres;

// Create the new node with RYM genres informations
var rymGenresSection = document.createElement('div.rym-section');
rymGenresSection.innerHTML = `
    <h2 
        id="rym-title"
    ><i>... Sauvetage des genres en cours... Viva la musica !</i><h2><br>
`;
detailsSection[0].appendChild(rymGenresSection);

var url = "https://rateyourmusic.com/search?searchtype=l&searchterm="+ formattedRecordArtist +'+'+ formattedRecordTitle;

fetch(url).then(response =>  {
    return response.text();
}).then(html => {
    var parser = new DOMParser();
    var htmlDocument = parser.parseFromString(html, "text/html");
    var resultArtist = htmlDocument.documentElement.querySelector("div#searchresults table tbody tr td table:first-child tbody tr td:first-child a");
    var resultTitle = htmlDocument.documentElement.querySelector("div#searchresults table tbody tr td table:first-child tbody tr td:first-child i a");
    var recordLink = resultTitle.getAttribute('href');

    if (resultArtist.innerHTML.trim().includes(recordArtist)) {
        fetch('https://rateyourmusic.com' + recordLink).then(response => {
            return response.text();
        }).then(html => {
            var parser = new DOMParser();
            var htmlDocument = parser.parseFromString(html, "text/html");
            var mainGenresNode = htmlDocument.documentElement.querySelector(".release_pri_genres");
            var secondaryGenresNode = htmlDocument.documentElement.querySelector(".release_sec_genres");
            mainGenres = mainGenresNode ? mainGenresNode.innerText : 'aucun';
            secondaryGenres = secondaryGenresNode ? secondaryGenresNode.innerText : 'aucun';
    
            rymGenresSection.innerHTML = `
                <h2 
                    id="rym-title"
                    style="font-weight: 700"
                >Genres RateYourMusic :<h2><br>
                    <span style="margin-left: 15px; font-weight: 500"><i>· `+ mainGenres +`</i></span><br>
                    <span style="margin-left: 15px"><i>· `+ secondaryGenres +`</i></span>
            `;
            
            // Display RYM informations under the original details section
            detailsSection[0].appendChild(rymGenresSection);
        })
    } else {
        rymGenresSection.innerHTML = `
            <h2 
                id="rym-title"
            ><i>Il y a eu un soucis lors de la recherche sur RYM, désolé pour l'incident... C'est peut-être de ma faute, peut-être pas. Dans tous les cas, je t'ai préparé une petite <a href="https://www.youtube.com/results?search_query=`+ recordArtist.split(' ').join('+') +`+`+ recordTitle.split(' ').join('+') + `"target="_blank">recherche YouTube</a> pour me faire pardonner.</i><h2><br>
        `;
            
        // Display RYM informations under the original details section
        detailsSection[0].appendChild(rymGenresSection);
    }
}).catch(() => {
    rymGenresSection.innerHTML = `
        <h2 
            id="rym-title"
        ><i>Tu es un robot.. C'est en tout cas ce que pense RateYourMusic. Rends-toi <a href='https://rateyourmusic.com' target=_blank>sur le site</a> pour vérifier la connexion.</i><h2><br>
    `;
    
    // Display RYM informations under the original details section
    detailsSection[0].appendChild(rymGenresSection);
});
