# `@stream-io/graphql-feeds` Twitter Example

This is example repo uses Apollo GraphQL, MongoDB & Stream Activity Feeds to create a simple Twitter style application with batteries included.

## Setup

To run the project you'll need a couple of prerequisites.

First, create a `.env` file in the root with the following variables:

```
STREAM_KEY=
STREAM_SECRET=
STREAM_ID=
AUTH_SECRET=
MONGODB_URI=
```

- Create an Activity Feeds application over on the Stream Dashboard to get your Key, Secret and ID.
  - Once there, you should set up the following feeds
    - a `flat` feed called `user`
    - a `flat` feed called `timeline`
    - a `notification` feed called `notification`
- Open your terminal an run `openssl rand -base64 128` to generate an Authentication secret for the `AUTH_SECRET` var
- Go to cloud.mongodb.com and provision a new MongoDB Database, get your connection string for the `MONGODB_URI` var

Once the above is complete, you can run `yarn`, followed by `yarn dev` to begin running the server and immediately have access to:

- User Authentication powered by MongoDB, `bcrypt` and JWT.
- GraphQL Resolvers to manipulate your Stream Feeds, including `tweet`, `follow`, `unfollow` etc.
- Adapted `graphql-compose-mongoose` resolvers to perform `signup`, `login` etc.
- Relational fields to "stitch" together the Users and their Stream Activity Feed.
