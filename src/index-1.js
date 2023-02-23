import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchApiImages from './js/search-api-images';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input'),
};

const searchApiImages = new SearchApiImages();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });

refs.form.addEventListener('submit', searchImg);
loadMoreBtn.button.addEventListener('click', fetchImages);

hiTitle()

let totalPages = null;

const lightbox = new SimpleLightbox('.gallery a');

function searchImg(e) {
  e.preventDefault();

  const value = refs.input.value;

  if (value.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    hiTitle()
    loadMoreBtn.hide();
    return;
  }

  searchApiImages.searchQuery = value;

  searchApiImages.resetPage();
  clearImages();
  loadMoreBtn.show();
  fetchImages();
  resetForm();
}

async function fetchImages() {
  try {
    // loadMoreBtn.disable();
    const hits = await searchApiImages.getImages();

    totalPages = Math.ceil(searchApiImages.totalHits / searchApiImages.perPage);

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImages();
      hiTitle();
      loadMoreBtn.hide();
      return;
    }

    if (searchApiImages.page === 2) {
      Notify.success(`We found ${searchApiImages.totalHits} images.`);
    }

    if (searchApiImages.page > totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.hide();
    }

    createMarkup(hits);

    if (searchApiImages.page > 2) scrollTheCollection();

    lightbox.refresh();
  } catch (error) {
    errorShow();
  }
}

function createMarkup(arr) {
  const markupImagesCollectiom = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <div class="image-wrap">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320 class="image" "
  /></a>
  </div>
  <div class="info-wrap">
    <p class="info-item"><span><svg class="icon" width="20" height="20">
    <use href="#icon-like"></use>
  </svg> </span>${likes}</p>
    <p class="info-item"><span><svg class="icon" width="20" height="20">
    <use href="#icon-view"></use>
  </svg></span> ${views}</p>
    <p class="info-item"><span><svg class="icon" width="20" height="20">
    <use href="#icon-comments"></use>
  </svg></span> ${comments}</p>
    <p class="info-item"><span><svg class="icon" width="20" height="20">
    <use href="#icon-download"></use>
  </svg></span>${downloads}</p>
  </div>
</div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markupImagesCollectiom);
  loadMoreBtn.enable();
}

function resetForm() {
  refs.form.reset();
}

function clearImages() {
  refs.gallery.innerHTML = '';
}

function errorShow(error) {
  Notify.failure('Error');
  loadMoreBtn.hide();
  console.error(error.massege);
}

function scrollTheCollection() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function hiTitle() {
  refs.gallery.innerHTML = '<h1 class="title">enter your query in the search field</h1>';
}