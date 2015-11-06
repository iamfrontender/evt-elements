var gulp = require('gulp');
var config = require('./.build/buildconfig.js');
var docgen = require('./.build/utils/docgen.js');
var fs = require('fs');
var EOL = require('os').EOL;

gulp.task('readme', function(done) {
  docgen(config.entry, function(err, data) {
    fs.writeFile('RDME.md', data.docs.join(EOL), done);
  });
});