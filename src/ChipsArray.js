// Using @material-ui/core/Chip
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ChipsArray(props) {
  const classes = useStyles();
  // const handleDelete = chipToDelete => () => {
  //   setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  // };
  console.log(props.data);

  return (
    <div>
      <Paper className={classes.root}>
        {props.data.map(d => {
          return (
              <Chip
                key={d.key}
                label={d.label}
                // onDelete={handleDelete(data)}
                className={classes.chip}
              />
          );
        })}
      </Paper>
    </div>
  );
}
