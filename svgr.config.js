/**
 * SVGR config — used by react-native-svg-transformer (v1.5.3)
 *
 * replaceAttrValues swaps hardcoded black fills with `currentColor` during the
 * SVG → JSX transform so icons automatically inherit their parent's color via
 * the `color` prop on the root <Svg> element (react-native-svg's currentColor).
 *
 * This means <Icon /> inside a <Button> correctly picks up the button's
 * textColor from ButtonColorContext without any explicit color prop.
 */
module.exports = {
  native: true,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],

  // Replace every hardcoded black fill with currentColor.
  // fill="none" and other non-black values are left untouched.
  replaceAttrValues: {
    '#111111': 'currentColor',
    '#000000': 'currentColor',
    black:     'currentColor',
  },

  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles:             { onlyMatchedOnce: false },
            removeViewBox:            false,
            removeUnknownsAndDefaults: false,
            convertColors:            false,
          },
        },
      },
    ],
  },
};
