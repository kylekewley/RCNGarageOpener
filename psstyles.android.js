var { StyleSheet, PixelRatio } = require('react-native')

const largePadding = 24;
const defaultPadding = 16;
const thinPadding = 8;

module.exports = StyleSheet.create({

  settingsTextInput: {
    paddingTop: thinPadding,
    fontSize: 16,
  },

  settingsItemLine: {
    height: 0,
  },
});

