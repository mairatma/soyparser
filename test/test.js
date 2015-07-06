var assert = require('assert');
var fs = require('fs');
var path = require('path');
var soyparser = require('../index');

var testSoyContents = fs.readFileSync(path.join(__dirname, 'assets/test.soy'));

module.exports = {
  testNamespace: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual('My.Namespace', parsed.namespace);
    test.done();
  },

  testTemplateCount: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual(4, parsed.templates.length);
    test.done();
  },

  testTemplateNames: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual('hello', parsed.templates[0].name);
    assert.strictEqual('age', parsed.templates[1].name);
    assert.strictEqual('Del', parsed.templates[2].name);
    assert.strictEqual('Del', parsed.templates[3].name);
    test.done();
  },

  testTemplateAttributes: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual(0, Object.keys(parsed.templates[0].attributes).length);
    assert.strictEqual(2, Object.keys(parsed.templates[1].attributes).length);
    assert.strictEqual('true', parsed.templates[1].attributes.private);
    assert.strictEqual('false', parsed.templates[1].attributes.autoescape);
    test.done();
  },

  testDelTemplates: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.ok(!parsed.templates[0].deltemplate);
    assert.ok(!parsed.templates[1].deltemplate);
    assert.ok(parsed.templates[2].deltemplate);
    assert.ok(parsed.templates[3].deltemplate);
    test.done();
  },

  testDelTemplateVariants: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.ok(!parsed.templates[0].variant);
    assert.ok(!parsed.templates[1].variant);
    assert.ok(!parsed.templates[2].variant);
    assert.strictEqual('\'negation\'', parsed.templates[3].attributes.variant);
    test.done();
  },

  testDocTags: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual(1, parsed.templates[0].docTags.length);
    assert.strictEqual(0, parsed.templates[1].docTags.length);
    assert.strictEqual(1, parsed.templates[2].docTags.length);
    assert.strictEqual(1, parsed.templates[3].docTags.length);
    test.done();
  },

  testDocTagTags: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual('param', parsed.templates[0].docTags[0].tag);
    assert.strictEqual('param', parsed.templates[2].docTags[0].tag);
    assert.strictEqual('param', parsed.templates[3].docTags[0].tag);
    test.done();
  },

  testDocTagNames: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual('firstName', parsed.templates[0].docTags[0].name);
    assert.strictEqual('id', parsed.templates[2].docTags[0].name);
    assert.strictEqual('id', parsed.templates[3].docTags[0].name);
    test.done();
  },

  testParams: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual(2, parsed.templates[0].params.length);
    assert.strictEqual(1, parsed.templates[1].params.length);
    assert.strictEqual(1, parsed.templates[2].params.length);
    assert.strictEqual(1, parsed.templates[3].params.length);
    test.done();
  },

  testParamNames: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual('lastName', parsed.templates[0].params[0].name);
    assert.strictEqual('firstName', parsed.templates[0].params[1].name);
    assert.strictEqual('age', parsed.templates[1].params[0].name);
    assert.strictEqual('id', parsed.templates[2].params[0].name);
    assert.strictEqual('id', parsed.templates[3].params[0].name);
    test.done();
  },

  testParamTypes: function(test) {
    var parsed = soyparser(testSoyContents);
    assert.strictEqual('string', parsed.templates[0].params[0].type);
    assert.strictEqual('any', parsed.templates[0].params[1].type);
    assert.strictEqual('number', parsed.templates[1].params[0].type);
    assert.strictEqual('any', parsed.templates[2].params[0].type);
    assert.strictEqual('any', parsed.templates[3].params[0].type);
    test.done();
  }
};
