const path = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const { name, version, repository } = require('./package.json');
const { styles, theme } = require('./styleguide.styles');
const webpack = require('webpack');

let sections = [
  {
    name: 'README',
    content: 'README.md',
  },
  {
    name: 'Resources ',
    content: 'src/components/resources/_readme.md',
    components: () => {
      const componentNames = ['Resource.context'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/resources`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Selections ',
    content: 'src/components/selections/_readme.md',
    components: () => {
      const componentNames = ['Selections.context'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/selections`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'USFM ',
    content: 'src/components/usfm/_readme.md',
    components: () => {
      const componentNames = [
        //'useUsfm',
        'Usfm.context',
      ];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/usfm`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Parallel Scripture ',
    content: 'src/components/parallel-scripture/_readme.md',
    components: () => {
      const componentNames = ['ParallelScripture', 'ScriptureTable'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/parallel-scripture`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Book ',
    content: 'src/components/book/_readme.md',
    components: () => {
      const componentNames = ['BookHeaders', 'Book'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/book`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Chapters ',
    content: 'src/components/chapters/_readme.md',
    components: () => {
      const componentNames = ['Chapter', 'Chapters'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/chapters`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Verses ',
    content: 'src/components/verses/_readme.md',
    components: () => {
      const componentNames = ['Verse', 'Verses'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/verses`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Verse Objects',
    content: 'src/components/verse-objects/_readme.md',
    components: () => {
      const componentNames = [
        'VerseObjects',
        'VerseObject',
        'TextObject',
        'WordObject',
        'MilestoneObject',
        'AlignedWordsObject',
        'OriginalWordObject',
        'SectionObject',
        'FootnoteObject',
        'UnsupportedObject',
      ];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/verse-objects`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'License',
    content: 'src/components/license/README.md',
    components: () => {
      const componentNames = ['License'];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/license`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: 'Core',
    content: 'src/core/README.md',
    sections: [
      {
        name: 'Selections',
        content: 'src/core/selections/selections.md',
      },
    ],
  },
  {
    name: 'Unicode Encoding & Normalization',
    content: 'src/components/parallel-scripture/examples/unicode/_readme.md',
    sections: [
      {
        name: 'Hebrew Cases',
        content:
          'src/components/parallel-scripture/examples/unicode/hebrew/_readme.md',
      },
      {
        name: 'Greek Cases',
        content:
          'src/components/parallel-scripture/examples/unicode/greek/_readme.md',
      },
    ],
  },
];

module.exports = {
  title: `${upperFirst(camelCase(name))} v${version}`,
  ribbon: {
    url: repository.url,
    text: 'View on GitHub',
  },
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, '.js');
    const file = dirname.split('/').slice(-1)[0];
    const componentName = upperFirst(camelCase(file));
    return `import { ${componentName} } from "${name}";`;
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  pagePerSection: true,
  sections,
  components: 'src/components/**/[A-Z]*.js',
  moduleAliases: {
    'scripture-resources-rcl': path.resolve(__dirname, 'src'),
  },
  version,
  serverPort: 6060,
  webpackConfig: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        process: { env: {} },
      }),
    ],
  },
};
