/**
 * @fileoverview checks the legitimacy of imports from one layer to another according to the FSD methodology
 * @author shevchenkooleg
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;

const aliasOptions = [
  {
    alias: '@'
  }
]


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(
    {
      parserOptions: {ecmaVersion: 6, sourceType: 'module'}
    }
);
ruleTester.run("layer-imports", rule, {
  valid: [
    // {
    //   filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/config/babel/babelRemoovePropsPlugin.ts',
    //   code: "import type { PluginItem } from '@babel/core'",
    //   errors: [],
    //   options: aliasOptions,
    // },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/cypress/support/commands.ts',
      code: "import {USER_LOCALSTORAGE_KEY} from '@/shared/const/localstorage';",
      options: aliasOptions,
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { classNames } from '@/shared/lib/classNames'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/pages/ProfilePage/ui/ProfilePage.tsx',
      code: "import { Navbar } from '@/widgets/Navbar'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/features/articleRating/ui/ArticleRating/ArticleRating.tsx',
      code: "import { CommentList } from '@/entities/Comment'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/features/articleRating/ui/ArticleRating/ArticleRating.tsx',
      code: "import { useTranslation } from 'react-i18next'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/app/providers/StoreProvider/ui/StoreProvider.tsx',
      code: "import { Provider } from 'react-redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/entities/Article/ui/ArticleDetails/ArticleDetails.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ]
    },
  ],

  invalid: [
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/features/articleRating/ui/ArticleRating/ArticleRating.tsx',
      code: "import { Navbar } from '@/widgets/Navbar'",
      errors: [{message: "Layer can only import underlying layers using the FSD methodology"}],
      options: aliasOptions
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/entities/articleRating/ui/ArticleRating/ArticleRating.tsx',
      code: "import { Navbar } from '@/widgets/Navbar'",
      errors: [{message: "Layer can only import underlying layers using the FSD methodology"}],
      options: aliasOptions
    },
    {
      filename: '/Users/oleg/programming_training/UlbiTV/my-blog-project/src/entities/Article/ui/ArticleDetails/ArticleDetails.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [{message: "Layer can only import underlying layers using the FSD methodology"}],
      options: aliasOptions
    },
  ],
});
