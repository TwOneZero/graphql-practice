import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';


let tweets = [
  {
    id: '1',
    text: 'hello',
    userId: '2'
  },
  {
    id: '2',
    text: 'hello2',
    userId: '1'
  },
  {
    id: '3',
    text: 'hello3',
    userId: '2'
  }
]
let users = [
  {
    id: '1',
    firstname: 'wony',
    lastname: 'lee'
  },
  {
    id: '2',
    firstname: 'wony2',
    lastname: 'lee2'
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    fullname: String!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String
    title_long: String
    slug: String
    year: Int!
    rating: Float
    runtime: Float
    genres: [String]
    summary: String
    description_full: String
    synopsis: String
    yt_trailer_code: String
    language: String
    mpa_rating: String
    background_image: String
    background_image_original: String
    small_cover_image: String
    medium_cover_image: String
    large_cover_image: String
    state: String
    torrents: String
    date_uploaded: String
    date_uploaded_unix: String
  }

  """
  Tweet object represents a resources for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!) : Tweet
    movie(id: String!): Movie 
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(tweetId: ID!): Boolean!
   }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {

      return tweets.find(tweet => tweet.id === id);
    },
    allUsers() {
      return users;
    },
    async allMovies() {
      return await fetch('https://yts.torrentbay.net/api/v2/list_movies.json')
        .then(res =>
          res.json()
        )
        .then(json => json.data.movies)
    },
    async movie(_, { id }) {
      return await fetch(`https://yts.torrentbay.net/api/v2/movie_details.json?movie_id=${id}`)
        .then(res =>
          res.json()
        )
        .then(json => json.data.movie)
    }
  },

  Mutation: {
    postTweet(root, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { tweetId }) {
      const istweet = tweets.find(tweet => tweet.id === tweetId);
      if (istweet) {
        tweets = tweets.filter(tweet => tweet.id !== tweetId);
        return true;
      }
      return false;
    }
  },
  User: {
    fullname({ lastname, firstname }) {
      return `${firstname} ${lastname}`;
    }
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId);
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Running on the ${url}`);
})

