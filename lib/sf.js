var xml2js = require('xml2js');
var Step = require('step');
var path = require('path');
var fs = require('fs');
var os =require('os');
var log =require('./log');

var EOL = os.platform === 'win32' ? '\r\n' : '\n';
var TAP = '  ';

/**
 * Transfer sf rules in inputs to nproxy rule file
 *
 * @param {Array} xmlFiles xml files
 * @param {String} output output dir or file when append is true
 * @param {String} dir dir in the rule files
 * @param {Boolean} needAppend if true, the transfered rule will be appended
 */
function transfer(xmlFiles, output, dir, needAppend, _callback){
  /**
   * If needAppend is true, output must be a file but not a directory
   */
  Step(
    function(){
      if(typeof output === 'undefined'){
        output = path.dirname(xmlFiles[0]);
      }
      output = output.indexOf(path.sep) === 0 ? output : path.join(process.cwd(), output);
      fs.stat(output, this); 
    },

    function(err, stat){
      if(err){
        throw err;
      }

      if(needAppend){
        if(!stat.isFile()){
          throw new Error('Output must be a file but not a directory when --append is enabled');
        }
      }else{
        if(!stat.isDirectory()){
          throw new Error('Output must be a directory');
        }
        output = path.join(output, 'nproxy-rule.js');
      }
      
      return output;
    },

    function transferBatch(err, outputFile){
      var group;

      if(err){
        throw err;
      }

      group = this.group();

      xmlFiles.forEach(function(xmlFile){
        transferSingleFile(xmlFile, dir, group());
      });
    },

    function append(err, rules){
      var wrapperTpl;
      var result;
      var isTargetEmpty = true;

      if(err){
        throw err;
      }

      if(needAppend){
        wrapperTpl = fs.readFileSync(output, 'utf-8');
        isTargetEmpty = false;
      }else{
        wrapperTpl = [
          'module.exports = [/*{{more}}*/',
          '];'
        ].join(EOL);
      }

      return _append(wrapperTpl, rules, isTargetEmpty);
    },

    function writeOutput(err, content){
      if(err){
        throw err;
      }

      fs.writeFile(output, 
        content,
        'utf-8', function(err){
          if(err){ throw err};
          log.info('Write output file successfully!');
          if(typeof _callback === 'function'){
            _callback(null);
          }
      });
    }
  );

}

/**
 * Transfer the input xml to output js for nproxy
 *
 * @param {String} sfXML file path of sf combo configuration xml file
 * @param {String} dir dir in the rule file
 */
function transferSingleFile(sfXML, dir, callback){
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
            pattern: groupId,
            responder: {
              dir: dir || 'fill the dir',
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

    _getRuleAsString(responders, callback);
    
  });

};

/**
 * Get the transferd rules as a string
 * 
 * @param {Object} responders the object of responder
 * @param {Function} callback
 */
function _getRuleAsString(responders, callback){

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

    if( i < respondersLen - 1){
      respondersArr.push(TAP + '},');
    }else{
      respondersArr.push(TAP + '}');
    }

  });

  if(typeof callback === 'function'){
    callback(null, respondersArr.join(EOL));
  }
};


/**
 * Append rules to target one by one
 * 
 * @param {String} target 
 * @param {Årray} rules
 * @param {Boolean} isTargetEmpty whether the target is empty

 * @api private
 */
function _append(target, rules, isTargetEmpty){
  var concatedRules = [];
  var rulesContent;
  var l = rules.length;
  rules.forEach(function(rule, i){
    if(i < l - 1){
      concatedRules.push(rule + ',');
    }else{
      concatedRules.push(rule + '/*{{more}}*/');
    }
  });

  if(isTargetEmpty){
    rulesContent = EOL + concatedRules.join(EOL);
  }else{
    rulesContent = ',' + EOL + concatedRules.join(EOL);
  }

  return target.replace(/\/\*{{more}}\*\//, rulesContent);
}

exports.transfer = transfer;