'use strict';

var path = require('path')
  , fs = require('fs')
  , rimraf = require('rimraf')
  , concatenate = require('..');

var FIXTURES = path.join(__dirname, 'fixtures');

describe('concatenate', function () {

  // create fixtures
  before(function () {
    function fixture(name) {
      var file = path.join(FIXTURES, name + '.txt')
        , contents = 'This is file "' + name + '".';

      fs.writeFileSync(file, contents);
    }

    var index;
    fs.mkdirSync(FIXTURES);
    for (index = 0; index < 20; index++) {
      if (index < 10) {
        index = '0' + index;
      }
      fixture(index);
    }
  });

  // remove fixtures
  after(function (done) {
    rimraf(FIXTURES, done);
  });

  it('should be a function', function () {
    concatenate.should.be.a.function;
  });

  it('should support file paths', function (done) {
    var expected = [
        'This is file "01".', 'This is file "02".',
        'This is file "03".', 'This is file "04".'
      ].join('\n')
      , paths = [
        path.join(FIXTURES, '01.txt'),
        path.join(FIXTURES, '02.txt'),
        path.join(FIXTURES, '03.txt'),
        path.join(FIXTURES, '04.txt')
      ];

    concatenate(paths, function (err, text) {
      text.should.be.equal(expected);
      done();
    });
  });
  it('should support file patterns', function (done) {
    var expected = [
        'This is file "00".', 'This is file "01".',
        'This is file "02".', 'This is file "03".',
        'This is file "04".', 'This is file "05".',
        'This is file "06".', 'This is file "07".',
        'This is file "08".', 'This is file "09".',
        'This is file "10".', 'This is file "11".',
        'This is file "12".', 'This is file "13".',
        'This is file "14".', 'This is file "15".',
        'This is file "16".', 'This is file "17".',
        'This is file "18".', 'This is file "19".'
      ].join('\n')
      , paths = [
        path.join(FIXTURES, '0*.txt'),
        path.join(FIXTURES, '1*.txt')
      ];

    concatenate(paths, function (err, text) {
      text.should.be.equal(expected);
      done();
    });
  });
  it('should optionally write a file', function (done) {
    var expected = [
        'This is file "01".', 'This is file "02".',
        'This is file "03".', 'This is file "04".'
      ].join('\n')
      , paths = [
        path.join(FIXTURES, '01.txt'),
        path.join(FIXTURES, '02.txt'),
        path.join(FIXTURES, '03.txt'),
        path.join(FIXTURES, '04.txt')
      ],
      out = path.join(FIXTURES, 'async-write-file.txt');

    concatenate(paths, out);
    setTimeout(function () {
      fs.readFileSync(out, 'utf-8').should.be.equal(expected);
      done();
    }, 10);
  });

  describe('error handling', function () {
    it('should pass an error on a bad glob', function (done) {
      concatenate('lol not here', function (err) {
        if (!err) {
          throw new Error('Did not pass error');
        }
        done();
      });
    });
    it('should only pass a single error', function (done) {
      var patterns = [ '*', 'lol not here', 'lol still not here' ];
      concatenate(patterns, function (err) {
        if (!err) {
          throw new Error('Did not pass any errors');
        }
        done();
      });
    });
  });

  describe('.sync()', function () {
    it('should be a function', function () {
      concatenate.sync.should.be.a.function;
    });
    it('should support file paths', function () {
      var expected = [
          'This is file "01".', 'This is file "02".',
          'This is file "03".', 'This is file "04".'
        ].join('\n')
        , paths = [
          path.join(FIXTURES, '01.txt'),
          path.join(FIXTURES, '02.txt'),
          path.join(FIXTURES, '03.txt'),
          path.join(FIXTURES, '04.txt')
        ];

      concatenate.sync(paths).should.be.equal(expected);
    });
    it('should support file patterns', function () {
      var expected = [
          'This is file "00".', 'This is file "01".',
          'This is file "02".', 'This is file "03".',
          'This is file "04".', 'This is file "05".',
          'This is file "06".', 'This is file "07".',
          'This is file "08".', 'This is file "09".',
          'This is file "10".', 'This is file "11".',
          'This is file "12".', 'This is file "13".',
          'This is file "14".', 'This is file "15".',
          'This is file "16".', 'This is file "17".',
          'This is file "18".', 'This is file "19".'
        ].join('\n')
        , paths = [
          path.join(FIXTURES, '0*.txt'),
          path.join(FIXTURES, '1*.txt')
        ];

      concatenate.sync(paths).should.be.equal(expected);
    });
    it('should support a single pattern', function () {
      var expected = [
          'This is file "00".', 'This is file "01".',
          'This is file "02".', 'This is file "03".',
          'This is file "04".', 'This is file "05".',
          'This is file "06".', 'This is file "07".',
          'This is file "08".', 'This is file "09".'
        ].join('\n');

      concatenate.sync(path.join(FIXTURES, '0*.txt')).should.be.equal(expected);
    });
    describe('given a file to write', function () {
      it('should write the file', function () {
        var expected = [
            'This is file "01".', 'This is file "02".',
            'This is file "03".', 'This is file "04".'
          ].join('\n')
          , paths = [
            path.join(FIXTURES, '01.txt'),
            path.join(FIXTURES, '02.txt'),
            path.join(FIXTURES, '03.txt'),
            path.join(FIXTURES, '04.txt')
          ],
          out = path.join(FIXTURES, 'sync-write-file.txt');

        concatenate.sync(paths, out).should.be.equal(expected);
        fs.readFileSync(out, 'utf-8').should.be.equal(expected);
      });
    });
  });
});
