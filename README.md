# It's not raining
*A browser-based game.*
You can play the game here, in [heroku](https://its-not-raining.herokuapp.com/).

## Table of Contents
* [Built with](#built-with)
* [Authors](#authors)
* [How to run](#how-to-run)
* [License](#license)

## Client built with
* [p5.js](https://p5js.org/)
* [p5.play](http://p5play.molleindustria.org/)
* [p5.sound](https://p5js.org/reference/#/libraries/p5.sound)
* [p5.scenemanager](https://github.com/mveteanu/p5.SceneManager)

## Built with
* [NodeJS](https://nodejs.org/)
* [Express.js](http://expressjs.com/)
* [MongoDB ATLAS](https://cloud.mongodb.com)

## Built with (Testing)
* [Mocha](https://mochajs.org): Asynchronous testing.
* [Chai](http://chaijs.com/): Assertion library.
* [Supertest](https://github.com/visionmedia/supertest): Requests testing.

## Authors
* [Arturo Fornés Arvayo](http://github.com/fornesarturo)
* [Gerardo Cesar Juarez Lopez](http://github.com/gerajuarez)
* [Miguel Angel Montoya Zaragoza](http://github.com/miguel-mzbi) ʕ•ᴥ•ʔ
* [Andrés Barro Encinas](http://github.com/andresbarroe)

## How to run
As we are using *node* in our project, make sure you have *NodeJS* and *npm*. To install *NodeJS* and *npm* follow the specific tutorial to your Operating System at their [download page](https://nodejs.org/en/download/).

First clone the repository:

```bash
# with ssh
$ git clone git@github.com:fornesarturo/its-not-raining.git

# with https
$ git clone https://github.com/fornesarturo/its-not-raining.git
```

Change into the directory created and install the required node modules.

```bash
$ cd its-not-raining
$ npm install
```

And run the project . . .

```bash
# with vanilla node and npm
$ npm start
# to run tests
$ npm test
# and to run DB scripts
$ npm run <desired-script>
```

## License
This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
