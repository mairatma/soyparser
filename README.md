soyparser
===================================

A parser for Closure Templates (or Soy Templates).

## Usage

This tool is able to parse valid closure templates, returning a JSON object with the extracted information.
Right now it's able to extract the namespace and some template info, like their names and params.

For example, say you want to parse the following soy file:

```
{namespace My.Namespace}

/**
 * @param firstName
 */
{template .hello}
	{@param lastName: string /}
	Hello {$firstName} {$lastName}!
{/template}

/**
 * @param id
 */
{deltemplate Del variant="'negation'"}
	My id is not {$id}.
{/deltemplate}
```

You just need to call soyparser with the file contents like this:

```javascript
var fs = require('fs');
var soyparser = require('soyparser');

var parsed = soyparser(fs.readFileSync('example.soy', 'utf8'));
```

The return value of the soyparser function is a JSON object with the parsed information. For the example soy template above this object would look like this:

```javascript
{
	namespace: 'My.Namespace',
	templates: [
		{
			contents: '{template .hello}\n\t{@param lastName: string /}\n\tHello {$firstName} {$lastName}!\n{/template}',
			docTags: [
				{
					tag: 'param',
					type: undefined,
					name: 'firstName',
					description: undefined
				}
			],
			params: [
				{
					name: 'lastName',
					type: 'string'
				},
  				{
					name: 'firstName',
					type: 'any'
				}
			],
			name: 'hello'
		},
		{
			contents: '{deltemplate Del variant="\'negation\'"}\n\tMy id is not {$id}.\n{/deltemplate}',
			docTags: [
				{
					tag: 'param',
					type: undefined,
					name: 'id',
					description: undefined
				}
			],
			params: [
  				{
					name: 'id',
					type: 'any'
				}
			],
			deltemplate: true,
			name: 'Del',
			variant: 'negation'
    	}
    ]
}
```
