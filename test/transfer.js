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
      var outputFile = path.join(outputDir, 'nproxy-rule.js');
      var expectedFile = path.join(expectedDir, 'group.js');

      sf.transfer([inputFile], outputDir, false, function(err){
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
      var outputFile = path.join(outputDir, 'nproxy-rule.js');
      var expectedFile = path.join(expectedDir, 'groups.js');

      sf.transfer([inputFile], outputDir, false, function(err){
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

    it('should transfer multiple xml', function(done){
      var inputFiles = [
        path.join(supportDir, 'xmls', 'group.xml'),
        path.join(supportDir, 'xmls', 'groups.xml')
      ];
      var outputFile = path.join(outputDir, 'nproxy-rule.js');
      var expectedFile = path.join(expectedDir, 'merged.js');

      sf.transfer(inputFiles, outputDir, false, function(err){
        if(!err){
          isTwoFileEqual(outputFile, expectedFile, function(err, result){
            if(!err){
              result.should.be.ok;
              done();
            }
          });
        }
      });
    });

    it('should transfer xml and append it to existed rule file', function(done){
      var inputFile = path.join(supportDir, 'xmls', 'groups.xml');
      var outputFile = path.join(supportDir, 'rules', 'group.js');
      var outputTplFile = path.join(supportDir,'rules', 'group.tpl');
      var expectedFile = path.join(expectedDir, 'merged.js');

      fs.createReadStream(outputTplFile)
        .pipe(fs.createWriteStream(outputFile))
        .on('close', function(err){
          if(err){
            throw err;
          }
            sf.transfer([inputFile], outputFile, true, function(err){
              if(!err){
                isTwoFileEqual(outputFile, expectedFile, function(err, result){
                  if(err){
                    throw err;
                  }
                  result.should.be.ok;
                  done();
                });
              }
            });
        });
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