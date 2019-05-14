// Set env to test
process.env.NODE_ENV = 'test';


//Require the dev-dependencies
const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should(),
    fs = require('fs');


// Use http requests
chai.use(chaiHttp);


/**
 * @param {String} file Path to the file
 * @returns {String} Return file base64 content
 */
const getFile = (file) => {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return 'data:image/jpeg;base64,' + new Buffer.from(bitmap).toString('base64');
}

const images = {
    lola:       getFile('./tests/assets/lola.jpg'),
    texts:      getFile('./tests/assets/text.png'),
    faces:      getFile('./tests/assets/face.jpg'),
    landscapes: getFile('./tests/assets/landscape.jpg')
}


// Required testers
const expect = chai.expect;


describe('Face', function () {
    this.timeout(30000);

    beforeEach((done) => {
        //Before each test if needed
        done();
    });

    describe('/POST detection', () => {
        it('it should gather informations on 5 faces', (done) => {
            chai.request(server)
                .post('/detection')
                .send({ data: images.faces })
                .end((err, res) => {
                    // Check errors and response http code
                    res.should.have.status(200);
                    expect(err).to.be.null;
                    expect(res.body.faces.error).to.be.equal(undefined);
                    expect(res.body.landscape.error).to.be.equal(undefined);

                    // Check response type and length
                    res.body.should.be.a('object');
                    res.body.faces.should.be.a('array');
                    expect(res.body.faces.length).to.not.equal(0);
                    expect(res.body.faces.length).to.be.equal(5);

                    // Check faces reponse values
                    expect(res.body.faces[2].gender).to.be.equal("male");
                    expect(res.body.faces[2].age).to.be.closeTo(25, 2);
                    expect(res.body.faces[2].emotion).to.be.equal("happiness");
                    expect(res.body.faces[2].name).to.be.equal(undefined);

                    // Check landscape response value
                    expect(res.body.landscape[0]).to.be.equal('a group of people posing for the camera');
                    
                    // Check text response value
                    expect(res.body.text.error).to.be.equal('No text detected.');
                    expect(res.body.text.httpCode).to.be.equal(400);
                    expect(res.body.text.code).to.be.equal(21);

                    done();
                });
        });
    });

    describe('/POST detection', () => {
        it('it should NOT gather informations on faces whithout image', (done) => {
            chai.request(server)
                .post('/detection')
                .send({ data: 'Hello' })
                .end((err, res) => {
                    // Check errors and response http code
                    res.should.have.status(200);
                    expect(err).to.be.null;
                    expect(res.body.faces.error).to.be.equal('File error or bad file format.');
                    expect(res.body.landscape.error).to.be.equal('File error or bad file format.');
                    expect(res.body.text.error).to.be.equal('File error or bad file format.');
                    expect(res.body.faces.httpCode).to.be.equal(400);
                    expect(res.body.landscape.httpCode).to.be.equal(400);
                    expect(res.body.text.httpCode).to.be.equal(400);
                    expect(res.body.faces.code).to.be.equal(10);
                    expect(res.body.landscape.code).to.be.equal(10);
                    expect(res.body.text.code).to.be.equal(10);

                    done();
                });
        });
    });

    describe('/POST detection', () => {
        it('it should NOT gather informations on faces with landscape', (done) => {
            chai.request(server)
                .post('/detection')
                .send({ data: images.landscapes })
                .end((err, res) => {
                    // Check errors and response http code
                    expect(err).to.be.null;
                    res.should.have.status(200);

                    // Check faces reponse values
                    expect(res.body.faces.error).to.be.equal('No face detected.');
                    expect(res.body.faces.httpCode).to.be.equal(400);
                    expect(res.body.faces.code).to.be.equal(20);

                    // Check landscape response value
                    expect(res.body.landscape[0]).to.be.equal('a house covered in snow with Kinkaku-ji in the background');

                    // Check text response value
                    expect(res.body.text.error).to.be.equal('No text detected.');
                    expect(res.body.text.httpCode).to.be.equal(400);
                    expect(res.body.text.code).to.be.equal(21);

                    done();
                });
        });
    });

    describe('/POST face/add', () => {
        it('it should add a face and confirm it', (done) => {
            chai.request(server)
                .post('/face/add')
                .send({ data: images.lola, name: 'Lola' })
                .end((err, res) => {
                    expect(err).to.be.null;

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body.message).to.equal("Person added");

                    done();
                });
        });
    });


    describe('/POST detection', () => {
        it('it should gather informations on 1 face with name', (done) => {
            chai.request(server)
                .post('/detection')
                .send({ data: images.lola })
                .end((err, res) => {
                    // Check errors and response http code
                    expect(err).to.be.null;
                    res.should.have.status(200);

                    // Check response type and length
                    res.body.should.be.a('object');
                    expect(res.body.faces.length).to.not.equal(0);
                    expect(res.body.faces.length).to.be.equal(1);

                    // Check reponse values
                    expect(res.body.faces[0].gender).to.be.equal("female");
                    expect(res.body.faces[0].age).to.be.closeTo(25, 2);
                    expect(res.body.faces[0].emotion).to.be.equal("happiness");
                    expect(res.body.faces[0].name).to.be.equal("Lola");

                    // Check landscape response value
                    expect(res.body.landscape[0]).to.be.equal('a woman smiling for the camera');


                    // Check text response value
                    expect(res.body.text.error).to.be.equal('No text detected.');
                    expect(res.body.text.httpCode).to.be.equal(400);
                    expect(res.body.text.code).to.be.equal(21);

                    done();
                });
        });
    });

});

describe('Vision', function () {
    this.timeout(15000);

    beforeEach((done) => {
        //Before each test if needed
        done();
    });

    describe('/POST landscape', () => {
        it('it should describe the scenery in the picture', (done) => {
            chai.request(server)
                .post('/detection')
                .send({ data: images.landscapes })
                .end((err, res) => {
                    // Check errors and response http code
                    expect(err).to.be.null;
                    res.should.have.status(200);

                    // Check faces reponse values
                    expect(res.body.faces.error).to.be.equal('No face detected.');
                    expect(res.body.faces.httpCode).to.be.equal(400);
                    expect(res.body.faces.code).to.be.equal(20);

                    // Check landscape response value
                    expect(res.body.landscape[0]).to.be.equal('a house covered in snow with Kinkaku-ji in the background');

                    // Check text response value
                    expect(res.body.text.error).to.be.equal('No text detected.');
                    expect(res.body.text.httpCode).to.be.equal(400);
                    expect(res.body.text.code).to.be.equal(21);

                    done();
                });
        });
    });
});


describe('Text', function () {
    this.timeout(150000);

    beforeEach((done) => {
        //Before each test if needed
        done();
    });

    describe('/POST read', () => {
        it('it should read the text', (done) => {
            chai.request(server)
                .post('/detection')
                .send({ data: images.texts })
                .end((err, res) => {
                    expect(err).to.be.null;

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.text.should.be.a('string');

                    // Check faces reponse values
                    expect(res.body.faces.error).to.be.equal('No face detected.');
                    expect(res.body.faces.httpCode).to.be.equal(400);
                    expect(res.body.faces.code).to.be.equal(20);

                    // Check landscape response value
                    expect(res.body.landscape[0]).to.be.equal('a screenshot of a cell phone on a table');

                    // Check text response value
                    expect(res.body.text).to.be.equal('It was the best of. times, it was the worst. of times, it was the age. of wisdom, it was the. age of foolishness.... ');

                    done();
                });
        });
    });
});
