var path = require('path');
var fs = require('fs');
var Step = require('step');
var wrench = require('wrench');
var sf = require('../');

function isTwoFileEqual(resultFile, expecedFile, callback){
   Step(
    function(){
      fs.readFile(resultFile, this.parallel());
      fs.readFile(expecedFile, this.parallel());
    },

    function(err, resultBuffer, exprecedBuffer){
      if(err){
        callback(err);
        return;
      }
      if(resultBuffer.length === exprecedBuffer.length){
        callback(null, true);
      }else{
        callback(null, false);
      }
    }
  );
}

describe('sf', function(){
  describe('.transfer', function(){
    var supportDir = path.join(__dirname, 'support');
    var outputDir = path.join(supportDir, 'output');
    var expectedDir = path.join(supportDir, 'expected');

    before(function(done){
      fs.mkdirSync(outputDir);
      done();
    });

    it('should transfer xml with one group', function(done){
      var inputFile = path.join(supportDir, 'xmls', 'group.xml');
      var outputFile = path.join(outputDir, 'group.js');
      var expectedFile = path.join(expectedDir, 'group.js');

      sf.transfer(inputFile, outputDir, function(err){
        if(!err){
          isTwoFileEqual(outputFile, expectedFile, function(err, result){
            if(!err){
              result.should.be.ok;
              done();
            }
          });
        }
      })
    });

    it('should transfer xml with multiple groups', function(done){
      var inputFile = path.join(supportDir, 'xmls', 'groups.xml');
      var outputFile = path.join(outputDir, 'groups.js');
      var expectedFile = path.join(expectedDir, 'groups.js');

      sf.transfer(inputFile, outputDir, function(err){
        if(!err){
          isTwoFileEqual(outputFile, expectedFile, function(err, result){
            if(!err){
              result.should.be.ok;
              done();
            }
          })
        }
      })
    });

    after(function(done){
      wrench.rmdirRecursive(outputDir, function(err){
        if(!err){
          done();
        }
      });
    });

  });
});