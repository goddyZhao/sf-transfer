var xml2js = require('xml2js');
var path = require('path');
var fs = require('fs');
var os =require('os');
var log =require('./log');

var EOL = os.platform === 'win32' ? '\r\n' : '\n';

/**
 * Transfer the input xml to output js for nproxy
 *
 * @param {String} sfXML file path of sf combo configuration xml file
 * @param {String} output transfered output file
 */
function transfer(sfXML,output, callback){
  var xmlParser; 
  var groups;
  var responders = [];
  var fileList = [];
  var entry;
  var responder;
  var stat;

  if(typeof sfXML === 'undefined'){
    throw new Error('No input file specified');
  }

  if(!/\.xml$/.test(sfXML)){
    throw new Error('Input file must be a xml file!');
  }

  sfXML = sfXML.indexOf(path.sep) === 0 ? sfXML : path.join(process.pwd, sfXML);

  if(typeof output === 'undefined'){
    output = sfXML.replace('.xml', '.js');
  }else{
    output = output.indexOf(path.sep) === 0 ? output : path.join(process.cwd, output);
    try{
      stat = fs.statSync(output);
    }catch(e){
      throw e;
    }

    if(!stat.isDirectory()){
      throw new Error('Output is not a directory');
    }

    output = path.join(output, path.basename(sfXML, '.xml') + '.js');
  }

  xmlParser = new xml2js.Parser();

  fs.readFile(sfXML, function(err, xml){
    if(err){ throw err; }

    xmlParser.parseString(xml, function(err, result){
      var groupParser = function(group){
        var groupId;
        var resources;

        if(typeof group['@'] === 'undefined'){
          return;
        }

        groupId = group['@']['id'];

        if(typeof groupId !== 'undefined'){
          resources = group['resource'];
          entry = {
            comment: '// pattern for ' + groupId,
            pattern: 'url pattern',
            responder: {
              dir: 'fill the dir',
              src: []
            }
          };

          responder = entry.responder;

          if(typeof resources === 'object' && 
              typeof resources['@'] === 'object' && 
              typeof resources['@']['uri'] === 'string'){

            responder.src.push(resources['@']['uri']);

          }

          if(Array.isArray(resources)){
            resources.forEach(function(resource){
              if(typeof resource['@'] === 'object' && 
                  typeof resource['@']['uri'] === 'string'){
                responder.src.push(resource['@']['uri']);
              }
            });
          }
          responders.push(entry);

        }
      }
      groups = result.groups.group;
      if(Array.isArray(groups)){
        groups.forEach(groupParser);
      }else if(typeof groups === 'object'){
        groupParser(groups);
      }
    });

    _writeOutput(output, responders, callback);
    
  });

};

function _writeOutput(path, responders, callback){
  var TAP = '  ';
  var outputTpl = [
    'module.exports = [',
    '{{responders}}',
    '];'  
  ].join(EOL);

  var respondersArr = [];

  var respondersLen = responders.length;
  var srcLen;
  var fileStr;

  responders.forEach(function(entry, i){
    respondersArr.push(TAP + '{');
    respondersArr.push(TAP + TAP + 'pattern: \'' + entry.pattern + '\',' + entry.comment);
    respondersArr.push(TAP + TAP + 'responder: {');
    respondersArr.push(TAP + TAP + TAP + 'dir: ' + '\'' + entry.responder.dir + '\',');
    respondersArr.push(TAP + TAP + TAP + 'src: [');

    srcLen = entry.responder.src.length;

    entry.responder.src.forEach(function(file, j){
      fileStr = TAP + TAP + TAP + TAP + '\'' + file + '\'';
      if(j < srcLen - 1){
        fileStr += ',';
      }
      respondersArr.push(fileStr);
    });

    respondersArr.push(TAP + TAP + TAP + ']');
    respondersArr.push(TAP + TAP + '}');

    if( i < respondersLen){
      respondersArr.push(TAP + '},');
    }else{
      respondersArr.push(TAP + '}');
    }

  });

  fs.writeFile(path, 
    outputTpl.replace(/{{responders}}/, respondersArr.join(EOL)), 
    'utf-8', function(err){
      if(err){ throw err};
      log.info('Write output file successfully!');
      if(typeof callback === 'function'){
        callback(null);
      }

  });

};

exports.transfer = transfer;