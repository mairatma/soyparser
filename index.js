var merge = require('merge');
var Tunic = require('tunic');

function extractNamespace(text) {
  return /{namespace (.*)}/.exec(text)[1];
}

function extractParams(text) {
  var params = [];
  var paramRegex = /{@param \s*(\S*)\s*:\s*(\S*)\s*\/}/g;
  var currentMatch = paramRegex.exec(text);
  while (currentMatch) {
    params.push({
      name: currentMatch[1],
      type: currentMatch[2]
    });
    currentMatch = paramRegex.exec(text);
  }
  return params;
}

function extractTemplateAttributes(text) {
  text = text || '';
  var attrs = {};
  var attrTexts = text.trim().split(/\s+/);
  attrTexts.forEach(function(attrText) {
    var split = attrText.split('=');
    if (split.length === 2) {
      attrs[split[0]] = split[1].substr(1, split[1].length - 2);
    }
  });
  return attrs;
}

function extractTemplateInfo(text) {
  var info = {};
  var match = /{(template|deltemplate) (\S+)(.*)?}/.exec(text);
  if (match) {
    info.deltemplate = match[1] === 'deltemplate';
    info.name = info.deltemplate ? match[2] : match[2].substr(1);
    info.attributes = extractTemplateAttributes(match[3]);
  }
  return info;
}

function extractTemplates(templates, blocks, block, index) {
  var code = blocks[index + 1];
  if (block.type === 'Comment' && code && code.type === 'Code') {
    var templateInfo = extractTemplateInfo(code.contents);
    if (templateInfo) {
      var info = merge(
        {
          contents: code.contents,
          docTags: block.tags,
          params: getAllParams(extractParams(code.contents), block.tags)
        },
        templateInfo
      );
      templates.push(info);
    }
  }
}

function getAllParams(extractedParams, docTags) {
  var params = extractedParams.concat();
  docTags.forEach(function(tag) {
    if (tag.tag === 'param') {
      params.push({
        name: tag.name,
        type: 'any'
      });
    }
  });
  return params;
}

function soyparser(text) {
  var parsed = {
    namespace: extractNamespace(text),
    templates: []
  };
  var ast = new Tunic().parse(text);
  ast.blocks.forEach(extractTemplates.bind(null, parsed.templates, ast.blocks));
  return parsed;
}

module.exports = soyparser;

