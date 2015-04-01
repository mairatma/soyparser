var merge = require('merge');
var tunic = require('tunic');

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
    })
    currentMatch = paramRegex.exec(text);
  }
  return params;
}

function extractTemplateInfo(text) {
  var info = {};
  var match = /{template (.*)}/.exec(text);
  if (match){
    info.name = match[1].substr(1);
  } else {
    var regex = new RegExp('{deltemplate (\\S+)\\s*(variant="\'(\\w+)\'")?\\s*}');
    match = regex.exec(text);
    if (match) {
      info.deltemplate = true;
      info.name = match[1];
      info.variant = match[3];
    }
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
  var ast = tunic().parse(text);
  ast.blocks.forEach(extractTemplates.bind(null, parsed.templates, ast.blocks));
  return parsed;
};

module.exports = soyparser;

