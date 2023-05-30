# eslint-plugin-relative-path-import-validation-plugin

plugin is designed to detect illegal imports, according to the FSD methodology such as:
* absolute import inside one module 
* import from lower layer to upper
* absolute import from external module not from Public API
* absolute import from testing API to external business components

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-relative-path-import-validation-plugin`:

```sh
npm install eslint-plugin-relative-path-import-validation-plugin --save-dev
```

## Usage

Add `relative-path-import-validation-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "relative-path-import-validation-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

1. Rule for detecting illegal absolute import of a component into a single module, according to the FSD methodology
```json
{
    "rules": {
      "path-import-validation-plugin/relative-path-import-checker": [
        "error",  
        { "alias": "@" }  // specify an alias if necessary
      ]
    }
}
```


2. Rule for detecting incorrect component imports from the internals of the module but not from the public API
```json
{
    "rules": {
      "path-import-validation-plugin/public-api-imports": [
        "error",
        {
          "alias": "@",  // specify an alias if necessary
          "testFilesPatterns": ["**/*.test.*", "**/*.stories.tsx", "**/StoreDecorator.tsx"]  // specify the files for which import from the testing API will be allowed
        }
      ]
    }
}
```


3. Rule for detecting illegal imports from one layer to another according to the FSD methodology
```json
{
    "rules": {
      "path-import-validation-plugin/layer-imports": [
        "error",
        {
          "alias": "@",  // specify an alias if necessary
          "ignoreImportPatterns": ["**/StoreProvider", "**/testing"]   // specify an exception
        }
      ]
    }
}
```






## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


