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

export default createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        border: '1px dashed white',
        borderBottom: null,
      },
      body: {
        color: pink,
      },
    },
  },
  props: {
    MuiTableCell: {
      align: 'center',
    },
  },
  colors: { cyan, red, green, purple, pink, cool, water, maroon, highlight },
  typography: {
    useNextVariants: true,
  },
});
