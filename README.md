# eslint-plugin-relative-path-import-validation-plugin

plugin is designed to detect illegal absolute import of a component into a single module, according to the FSD methodology

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

```json
{
    "rules": {
        "relative-path-import-validation-plugin/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


