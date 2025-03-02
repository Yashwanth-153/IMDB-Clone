const fetchMovies = debounce((searchTerm) => {
    if (searchTerm.length > 2) {
      fetch(`${API_URL}&s=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setMovies(data.Search || []));
    }
  }, 500);
  