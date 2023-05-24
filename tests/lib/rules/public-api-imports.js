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
      errors: []
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'entities/starRating'",
      errors: []
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'nodeModules/react/react/react/ui/blabla'",
      errors: []
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.test.ts',
      code: "import { blaReducer } from 'entities/blaEntity/testing'",
      errors: [],
      options: [{
        testFilesPatterns: ['**/*.test.*', '**/*.story.ts', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/model/StoreDecorator.tsx',
      code: "import { blaReducer } from '@/entities/blaEntity/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.story.ts', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/model/ProfilePage.stories.tsx',
      code: "import { blaReducer } from '@/entities/blaEntity/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.stories.tsx', '**/StoreDecorator.tsx']
      }]
    },
  ],

  invalid: [
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from 'pages/ProfilePage/ui/ProfilePage'",
      errors: [{ message: "Absolute imports are only allowed from Public API (index.ts/testing.ts)"}],
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from '@/pages/ProfilePage/ui/ProfilePage'",
      errors: [{ message: "Absolute imports are only allowed from Public API (index.ts/testing.ts)"}],
      options: [{
        alias: '@'
      }]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/entities/StoreDecorator.tsx',
      code: "import { blaReducer } from 'entities/Article/testing/test.ts'",
      errors: [{message: "Absolute imports are only allowed from Public API (index.ts/testing.ts)"}],
      options: [{
        testFilesPatterns: ['**/*.test.*', '**/*.stories.ts', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/model/ProfilePage.test.ts',
      code: "import { blaReducer } from '@/entities/blaEntity/model/blaSlice.ts'",
      errors: [{message: "Absolute imports are only allowed from Public API (index.ts/testing.ts)"}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.stories.ts', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/model/ProfilePage.stories.tsx',
      code: "import { blaReducer } from '@/entities/blaEntity/model/blaSlice.ts'",
      errors: [{message: "Absolute imports are only allowed from Public API (index.ts/testing.ts)"}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.stories.tsx', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/model/forbidden.ts',
      code: "import { blaReducer } from '@/entities/blaEntity/testing'",
      errors: [{message: "It is forbidden to import data not in test files from publicApi/testing"}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.stories.tsx', '**/StoreDecorator.tsx']
      }]
    },
  ],
});
