function extractNamespace(text) {
  return /{namespace (.*)}/.exec(text)[1];
}

function soyparser(text) {
  var parsed = {
    namespace: extractNamespace(text)
  };
  return parsed;
};

module.exports = soyparser;

