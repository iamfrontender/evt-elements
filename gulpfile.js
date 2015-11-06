var gulp = require('gulp');
var config = require('./.build/buildconfig.js');
var docgen = require('./.build/utils/docgen.js');
var fs = require('fs');

gulp.task('readme', function(done) {
  docgen(config.entry, function(err, data) {
    console.log(data);
  });
});