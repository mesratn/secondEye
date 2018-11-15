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
    return 'data:image/jpeg;base64,' + new Buffer(bitmap).toString('base64');
}

const images = {
    texts: getFile('./tests/assets/text.jpg'),
    faces: getFile('./tests/assets/face.jpg')
}


// Required testers
const expect = chai.expect;


describe('Face', function () {
    this.timeout(15000);

    beforeEach((done) => {
        //Before each test if needed
        done();
    });

    describe('/POST emotions', () => {
        it('it should GET emotions on a picture', (done) => {
            chai.request(server)
                .post('/emotions')
                .send({ data: images.faces })
                .end((err, res) => {
                    expect(err).to.be.null;

                    console.log(res.body);

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.global.should.be.a('string');
                    expect(res.body.faces.length).to.not.equal(0);

                    done();
                });
        });
    });

});