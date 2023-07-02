module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    'tailwindcss': {},
    'postcss-preset-env': {},
    'autoprefixer': {},
    'postcss-prefix-selector': {
      prefix: '.editor-styles-wrapper .is-root-container.block-editor-block-list__layout',
      includeFiles: ['editor.css'],
      transform: function(prefix, selector, prefixedSelector, filepath) {
        if (selector.match(/^(html|body)/)) {
          return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
        } else if(selector.match(/^\.(wp-admin|editor-styles-wrapper)/)) {
          return selector;
        } else {
          return prefixedSelector;
        }
      }
    }
  }
}