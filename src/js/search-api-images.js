import axios from 'axios';

export default class SearchApiImages {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = null;
    this.perPage = 20;
  }

  async getImages() {
    const options = {
      params: {
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: `${this.perPage}`,
        page: `${this.page}`,
      },
    };

    const URL = `https://pixabay.com/api/?key=33815318-5c172bb5b30b5850127c8a49a`;

    const response = await axios.get(URL, options);
    const hits = await response.data.hits;
    this.totalHits = response.data.totalHits;
    this.nextPage();

    return hits;
  }
  resetPage() {
    this.page = 1;
  }
  nextPage() {
    this.page += 1;
  }


}