/**
 * @fileoverview rule is designed to detect illegal absolute import of a component into a single module, according to the FSD methodology
 * @author shevchenkooleg
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/relative-path-import-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(
    {
      parserOptions: {ecmaVersion: 6, sourceType: 'module'}
    }
);
ruleTester.run("relative-path-import-checker", rule, {
  valid: [
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'shared/lib/classNames/classNames'",
      errors: [{message: "Component imports within the same module should be relative"}]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/cypress/support/commands.ts',
      code: "import {USER_LOCALSTORAGE_KEY} from '@/shared/const/localstorage';",
      options: [{
        alias: '@'
      }]
    },
  ],

  invalid: [
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'pages/ProfilePage/ui/lib'",
      errors: [{ message: "Component imports within the same module should be relative"}],
      output: 'import { classNames } from "./lib"',
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/model/Slice.ts',
      code: "import { classNames } from '@/pages/ProfilePage'",
      errors: [{ message: "Component imports within the same module should be relative"}],
      output: 'import { classNames } from ".."',
      options: [{
        alias: '@'
      }]
    },
  ],
});


