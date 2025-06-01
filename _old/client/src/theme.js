import { createMuiTheme } from '@material-ui/core/styles';

const cyan = 'cyan';
const red = '#EE766D';
const green = 'limegreen';
const purple = '#98389E';
const pink = '#EF8CF9';
const cool = 'cadetblue';
const water = '#6876f7';
const maroon = '#BFBB3C';
const highlight = '#fffb7f';
const lightgray = 'rgb(47, 47, 47)';

export default createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: 0,
        border: `1px dashed ${lightgray}`,
        borderBottom: null,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        '&:last-child': {
          paddingRight: 0,
        },
      },
      body: {
        color: pink,
      },
    },
    MuiTypography: {
      root: {
        fontFamily: 'Courier !important',
        fontSize: '16px !important',
      },
    },
  },
  props: {
    MuiTableCell: {
      align: 'center',
    },
  },
  colors: { cyan, red, green, purple, pink, cool, water, maroon, highlight, lightgray },
  typography: {
    useNextVariants: true,
  },
});
