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
    texts:      getFile('./tests/assets/text.jpg'),
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

    describe('/POST faces', () => {
        it('it should gather informations on 5 faces', (done) => {
            chai.request(server)
                .post('/faces')
                .send({ data: images.faces })
                .end((err, res) => {
                    // Check errors and response http code
                    expect(err).to.be.null;
                    res.should.have.status(200);

                    // Check response type and length
                    res.body.should.be.a('array');
                    expect(res.body.length).to.not.equal(0);
                    expect(res.body.length).to.be.equal(5);

                    // Check reponse values
                    expect(res.body[2].gender).to.be.equal("male");
                    expect(res.body[2].age).to.be.closeTo(25, 2);
                    expect(res.body[2].emotion).to.be.equal("happiness");
                    expect(res.body[2].name).to.be.equal(undefined);

                    done();
                });
        });
    });

    describe('/POST faces', () => {
        it('it should NOT gather informations on faces', (done) => {
            chai.request(server)
                .post('/faces')
                .send({ data: 'Hello' })
                .end((err, res) => {
                    expect(err).to.not.be.null;
                    res.should.have.status(400);

                    done();
                });
        });
    });

    describe('/POST faces', () => {
        it('it should NOT gather informations on faces', (done) => {
            chai.request(server)
                .post('/faces')
                .send({ data: images.landscapes })
                .end((err, res) => {
                    expect(err).to.not.be.null;
                    res.should.have.status(400);

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

    describe('/POST faces', () => {
        it('it should gather informations on 1 face with name', (done) => {
            chai.request(server)
                .post('/faces')
                .send({ data: images.lola })
                .end((err, res) => {
                    // Check errors and response http code
                    expect(err).to.be.null;
                    res.should.have.status(200);

                    // Check response type and length
                    res.body.should.be.a('array');
                    expect(res.body.length).to.not.equal(0);
                    expect(res.body.length).to.be.equal(1);

                    // Check reponse values
                    expect(res.body[0].gender).to.be.equal("female");
                    expect(res.body[0].age).to.be.closeTo(25, 2);
                    expect(res.body[0].emotion).to.be.equal("happiness");
                    expect(res.body[0].name).to.be.equal("Lola");

                    done();
                });
        });
    });

});

// describe('Text', function () {
//     this.timeout(150000);

//     beforeEach((done) => {
//         //Before each test if needed
//         done();
//     });

//     describe('/POST text', () => {
//         it('it should say that there is NOT a text in the picture', (done) => {
//             chai.request(server)
//                 .post('/text')
//                 .send({ data: images.faces })
//                 .end((err, res) => {
//                     expect(err).to.be.null;

//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.message.should.be.a('string');
//                     expect(res.body.message).to.equal('Image does not contains text');

//                     done();
//                 });
//         });
//     });

//     describe('/POST text', () => {
//         it('it should NOT gather informations on texts', (done) => {
//             chai.request(server)
//                 .post('/text')
//                 .send({ data: 'Hello' })
//                 .end((err, res) => {
//                     expect(err).to.not.be.null;

//                     res.should.have.status(400);

//                     done();
//                 });
//         });
//     });

//     describe('/POST read', () => {
//         it('it should read the text', (done) => {
//             chai.request(server)
//                 .post('/read')
//                 .send({ data: images.texts })
//                 .end((err, res) => {
//                     expect(err).to.be.null;

//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.message.should.be.a('string');
//                     expect(res.body.message.length).to.not.equal(0);

//                     done();
//                 });
//         });
//     });

//     describe('/POST read', () => {
//         it('it should NOT read the text', (done) => {
//             chai.request(server)
//                 .post('/read')
//                 .send({ data: 'Hello' })
//                 .end((err, res) => {
//                     expect(err).to.not.be.null;

//                     res.should.have.status(500);

//                     done();
//                 });
//         });
//     });

// });

// describe('Vision', function () {
//     this.timeout(15000);

//     beforeEach((done) => {
//         //Before each test if needed
//         done();
//     });

//     describe('/POST landscape', () => {
//         it('it should describe the scenery in the picture', (done) => {
//             chai.request(server)
//                 .post('/landscape')
//                 .send({ data: images.landscapes })
//                 .end((err, res) => {
//                     expect(err).to.be.null;

//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     expect(res.body.landscapes.length).to.not.equal(0);

//                     done();
//                 });
//         });
//     });

//     describe('/POST landscape', () => {
//         it('it should NOT gather informations on the picture', (done) => {
//             chai.request(server)
//                 .post('/landscape')
//                 .send({ data: 'Hello' })
//                 .end((err, res) => {
//                     expect(err).to.not.be.null;

//                     res.should.have.status(400);

//                     done();
//                 });
//         });
//     });

// });
