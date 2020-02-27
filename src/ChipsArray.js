// Using @material-ui/core/Chip
import React from 'react';
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
  props.data.map(item => console.log(item));
  const classes = useStyles();
  const [chipData, setChipData] = React.useState(props.data);
  const handleDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  return (
    <div>
      <Paper className={classes.root}>
        {chipData.map(data => {
          return (
              <Chip
                key={data.key}
                label={data.label}
                onDelete={handleDelete(data)}
                className={classes.chip}
              />
          );
        })}
      </Paper>
    </div>
  );
}
