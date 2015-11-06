var chalk = require('chalk');
var async = require('async');
var path = require('path');
var fs = require('fs');

var htmlparser = require('htmlparser2').Parser;
var EOL = require('os').EOL;

function log() {
  console.log.apply(console, [
    chalk.blue('[DOCGEN]'),
    ' : '
  ].concat(Array.prototype.slice.call(arguments)));
}

function error() {
  console.log.apply(console, [
    chalk.blue('[DOCGEN]'),
    ' : ',
    chalk.red('ERROR ')
  ].concat(Array.prototype.slice.call(arguments)));
}

function docgen(entry, store, done) {
  log('parsing', entry);

  entry = path.resolve(entry);

  fs.readFile(entry, function(err, data) {
    if (err) {
      error(err);
    }

    var parser = new htmlparser({
      onopentag: function(name, attrs) {
        if (name === 'link' && attrs.rel === 'import') {
          if (~attrs.href.indexOf('evt-')) {
            var href = path.resolve(path.dirname(entry), attrs.href);

            store.imports.push(href);
          }
        }
      },

      oncomment: function(content) {
        store.docs.push(content)
      }
    });

    parser.write(data);
    parser.end();

    store.done[entry] = true;

    async.eachSeries(store.imports, function(item, next) {
      if (!store.done[item]) {
        docgen(item, store, next);
      } else {
        next();
      }
    }, function(err) {
      if (err) {
        error(err);
      }

      done(err, store);
    });
  });
}

module.exports = function(entry, done) {
  var store = {
    imports: [],
    docs: [],
    done: {}
  };

  docgen(entry, store, function(err, data) {
    if (err) {
      error(err);
      done(err);
    } else {
      done(null, data);
    }
  });
};