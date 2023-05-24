/**
 * @fileoverview plugin is designed to detect incorrect component imports from the internals of the module and not from the public api
 * @author shevchenkooleg
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(
    {
      parserOptions: {ecmaVersion: 6, sourceType: 'module'}
    }
);
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'shared/lib/classNames/classNames'",
      errors: [{message: "Absolute imports are only allowed from Public API"}]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'entities/starRating'",
      errors: [{message: "Absolute imports are only allowed from Public API"}]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'nodeModules/react/react/react/ui/blabla'",
      errors: [{message: "Absolute imports are only allowed from Public API"}]
    },
  ],

  invalid: [
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'pages/ProfilePage/ui/ProfilePage'",
      errors: [{ message: "Absolute imports are only allowed from Public API"}],
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from '@/pages/ProfilePage/ui/ProfilePage'",
      errors: [{ message: "Absolute imports are only allowed from Public API"}],
      options: [{
        alias: '@'
      }]
    },
  ],
});
