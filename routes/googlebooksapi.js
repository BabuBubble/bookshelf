const maxResults = 11;

async function get_books( query, startIndex ) {
    if ( !query ) {
        return null;
    }
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&maxResults=${maxResults}${startIndex ? `&startIndex=${(startIndex-1)*10}` : ''}&orderBy=newest`;
        console.log(url);
        const response = await fetch( url );
        if (!response.ok) { 
            throw new Error('Network error');
        }
        const response_data = await response.json();
        return response_data;
    } catch ( err ) {
        console.error('api error', err);
    }
}

module.exports = { get_books };
