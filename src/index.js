import axios from 'axios'
import Notiflix from 'notiflix';

const refs = {
    card: document.querySelector('.gallery'),
    input: document.querySelector('.search-form input'),
    formButton: document.querySelector('.search-btn')
}



function feashImage(inputValue) {
    return axios.get(`https://pixabay.com/api/?key=33815318-5c172bb5b30b5850127c8a49a&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true`).then(({ data }) => { 
        return data
    } )
};

// const inputValue = refs.input.value

refs.formButton.addEventListener('click', (e) => {
    e.preventDefault();
    // const inputValue = refs.input.value
    const inputValue = refs.input.value
    console.log(inputValue)
    feashImage(inputValue).then(data => {
    console.log(data)
    const dataHits = data.hits
    const murkups = dataHits.reduce((murkup,dataHit) => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = dataHit
        const murkupOneImage = `<div class="photo-card">
  <img src="${largeImageURL}" alt="${tags}" loading="lazy" class="image"/>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
        return murkup + murkupOneImage 
    },"")
    
    refs.card.innerHTML = murkups;
});
})




// feashImage(inputValue).then(data => {
//     console.log(data)
//     const dataHits = data.hits
//     const murkups = dataHits.reduce((murkup,dataHit) => {
//         const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = dataHit
//         const murkupOneImage = `<div class="photo-card">
//   <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads ${downloads}</b>
//     </p>
//   </div>
// </div>`;
//         return murkup + murkupOneImage 
//     },"")
    
//     refs.card.innerHTML = murkups;
// });