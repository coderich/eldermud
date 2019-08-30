import React, { PropTypes, memo } from '@coderich/hotrod/react';
import { Grid, Table, TableBody, TableRow, TableCell, Typography } from '@material-ui/core';

const numToArray = num => Array.from(Array(num));
const letters = numToArray(26).map((_, i) => String.fromCharCode(97 + i));

const axis = {
  color: 'white',
  fontSize: '12px',
  height: '100%',
};

const Party = memo((props) => {
  const { index, width, height, matrix } = props;

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Grid container item direction="column" justify="space-around" style={axis}>
          <Grid item xs>&nbsp;</Grid>
          {numToArray(height).map((_, i) => <Grid item key={letters[index + i]} xs>{letters[index + i]}</Grid>)}
        </Grid>
      </Grid>
      <Grid item xs>
        <Grid container item direction="column" xs>
          <Grid container item justify="space-around" style={axis}>
            {numToArray(width).map((_, i) => <Grid item key={letters[i + 1]}>{i + 1}</Grid>)}
          </Grid>
          <Grid container item>
            <Table style={{ tableLayout: 'fixed' }}>
              <TableBody>
                {matrix.map((row, i) => {
                  const rowKey = `row-${i}`;

                  return (
                    <TableRow key={rowKey}>
                      {row.map((cell, j) => {
                        const colKey = `col-${j}`;
                        if (cell.skip) return <TableCell key={colKey} />;
                        return <TableCell {...cell.props} style={{ overflow: 'hidden' }} key={colKey}><Typography>{cell.label}</Typography></TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default Party;

Party.propTypes = {
  index: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  matrix: PropTypes.instanceOf(Array).isRequired,
};
