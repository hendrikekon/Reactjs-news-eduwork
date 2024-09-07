import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import noImage from './img/noimage.png'

class NewsLifecycle extends Component {
    state = {
      articles: [],
      cari: ''
    };

  componentDidMount() {
    this.fetchNews('latest');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cari !== this.state.cari) {
      this.fetchNews(this.state.cari || 'latest'); 
    }
  }

  //note belajar: latest sebagai default untuk dimasukkan ke url, jika qInTitle kosong maka newsapi akan error penggunaan normalnya di componentDidUpdate adalah this.fetchNews(this.state.cari)
  //error yang muncul saat tidak menggunakan latest:
  //"message": "Required parameters are missing, the scope of your search is too broad. Please set any of the following required parameters and try again: q, qInTitle, sources, domains."

  fetchNews = (cari = 'latest') => {
    const apikey = '6ad41eab56c647d1b769e86a82a0239c';
    const url = `https://newsapi.org/v2/everything?qInTitle=${cari}&from=2024-08-14&sortBy=publishedAt&language=en&apiKey=${apikey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.articles) {
          this.setState({ articles: data.articles });
        } else {
          console.log('Error fetching data');
        }
      })
      .catch(err => console.log('Error fetching data', err));
  };

  handleSearch = (event) => {
    this.setState({ cari: event.target.value });
  };

  handleButton = () => {
    const { cari } = this.state;
    const searchQuery = cari.length === 0 ? 'latest' : cari;

    this.fetchNews(searchQuery);
  };

  //note belajar: saat button di click tanpa ada input text maka akan terjadi error pada fetching url sama seperti yang di atas
  //jadi dibuat searchquery sehingga jika button di click tanpa input text maka akan memanggil latest

  render() {
    return (
      <div className="container">
        <h1>Portal Berita</h1>

        <div className="input-group mb-3">
          <input
            type="text"
            id="search"
            className="form-control"
            placeholder="Cari Berita ...."
            value={this.state.cari}
            onChange={this.handleSearch}
          />
          <button onClick={this.handleButton} className="btn btn-primary">Get News</button>
        </div>

        <div id="newsListContainer" className="row">
          {this.state.articles.map((article, index) => (
            <div key={index} className="news-item col-md-4 mb-4">
              <div className="card">
                <img
                  className="card-img-top"
                  src={article.urlToImage || noImage} 
                  //note belajar: gambar yang sudah dihapus (meski ada urlnya) gambar tidak akan muncul dan tidak akan terganti oleh noImage
                  alt={article.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-subtitle mb-2 text-muted">{article.author}</p>
                  <p className="card-text">{article.publishedAt}</p>
                  <p className="card-text">{article.description || 'Tidak Ada Deskripsi'}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Baca Lengkap
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default NewsLifecycle;
