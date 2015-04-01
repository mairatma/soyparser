var assert = require('assert');
var soyparser = require('../index');

module.exports = {
	testNamespace: function(test) {
		var parsed = soyparser('{namespace My.Namespace}');
		assert.strictEqual('My.Namespace', parsed.namespace);
		test.done();
	}
};
