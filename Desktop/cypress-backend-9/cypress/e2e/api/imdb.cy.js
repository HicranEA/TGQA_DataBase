/// <reference types='cypress'/>

const baseURL = 'http://www.omdbapi.com/'
const apiKey = '83ae8389'
const movieTitle = 'Hercules'
const movieID = 'tt9218128'
const movieSearch = 'Matrix'
const invalidMovieSearch = 'abdndjruff'

describe('Get a Movie by its Title and Validate Response', () => {
  it('Get a Movie by Its Title', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?t=${movieTitle}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)

      const { Title, Year, Director, Writer, imdbRating, imdbID } =
        response.body

      expect(Title).to.eq(movieTitle)
      expect(imdbID).to.match(/^tt\d{7}$/)

      const propertiesToValidate = [Year, Director, Writer, imdbRating]

      // Iterate over properties and assert they are not empty or null
      propertiesToValidate.forEach((property) => {
        expect(property).to.not.be.empty
        expect(property).to.not.be.null
      })
    })
  })

  it('Get a Movie by its ID and Validate Response', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?i=${movieID}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)

      const { Title, Year, Director, Writer, imdbRating, imdbID } =
        response.body

      expect(imdbID).to.eq(movieID)

      const propertiesToValidate = [Title, Year, Director, Writer, imdbRating]

      // Iterate over properties and assert they are not empty or null
      propertiesToValidate.forEach((property) => {
        expect(property).to.not.be.empty
        expect(property).to.not.be.null
      })
    })
  })

  it('Search Movies with Valid Search Query and Validate Response', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?s=${movieSearch}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)

      //const [ Title, Year, imdbID, Type, Poster ] = response.body.Search;

      expect(response.body).to.have.property('Search').that.is.an('array')
      expect(Number(response.body.totalResults)).to.gt(0)
      expect(response.body).to.have.property('Response').to.eq('True')
      expect(response.body.Search).length.to.gt(0)

      response.body.Search.forEach((property) => {
        expect(property.Title).to.not.be.empty
        expect(property.Year).to.not.be.null
        expect(property.imdbID).to.match(/^tt\d{7,8}$/)
        expect(property.Type).to.not.be.null
        expect(property.Poster).to.not.be.null
      })
    })
  })

  it('Search Movies with Invalid Search Query and Validate Error Response', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?s=${invalidMovieSearch}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('Response').to.eq('False')
      expect(response.body).to.have.property('Error').to.eq('Movie not found!')
    })
  })
})
