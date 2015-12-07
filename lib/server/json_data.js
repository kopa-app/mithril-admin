'use strict';

var faker = require('faker');

module.exports = function () {
  var data = {};
  var num = 100;
  data.posts = [];
  data.comments = [];
  data.albums = [];
  data.photos = [];
  data.todos = [];
  data.users = [];

  function fill(target, constr, num) {
    while (target.length < num) {
      target.push(constr(target.length));
    }
  }

  function post(index) {
    return {
      id: index + 1,
      userId: faker.random.number(data.users.length),
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      published: faker.random.boolean(),
      createdAt: faker.date.past(),
      publishAt: faker.date.past()
    };
  }

  function  comment(index) {
    return {
      id: index + 1,
      postId: faker.random.number(data.posts.length),
      name: faker.lorem.sentence(),
      email: faker.internet.email(),
      body: faker.lorem.paragraph(),
      published: faker.random.boolean(),
      createdAt: faker.date.past()
    };
  }

  function album(index) {
    return {
      id: index + 1,
      userId: faker.random.number(data.users.length),
      title: faker.lorem.sentence()
    };
  }

  function photo(index) {
    var imageId = faker.random.number(9) + 1;
    return  {
      id: index +1,
      albumId: faker.random.number(data.albums.length),
      title: faker.lorem.sentence(),
      url: faker.image.imageUrl(640, 480, 'animals') + '/' + imageId,
      thumbnailUrl: faker.image.imageUrl(200, 200, 'animals') + '/' + imageId,
      takenAt: faker.date.past()
    };
  }

  function todo(index) {
    return {
      id: index + 1,
      userId: faker.random.number(data.users.length),
      title: faker.lorem.sentence(),
      completed: faker.random.boolean()
    };
  }

  function user(index) {
    return {
      id: index + 1,
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      address: {
        street: faker.address.streetName(),
        suite: faker.address.streetSuffix(),
        city: faker.address.city(),
        zipcode: faker.address.zipCode(),
        geo: {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
        }
      },
      phone: faker.phone.phoneNumber(),
      website: faker.internet.url(),
      company: {
        name: faker.company.companyName(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.bs
      },
      role: faker.random.arrayElement(['admin', 'manager', 'guest'])
    };
  }

  console.log('Generating heaps of data ...');

  fill(data.users, user, num);
  fill(data.todos, todo, num);
  fill(data.posts, post, num);
  fill(data.comments, comment, num);
  fill(data.albums, album, num);
  fill(data.photos, photo, num);

  return data;
};
