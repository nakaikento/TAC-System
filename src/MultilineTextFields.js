import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 500,
    },
  },
}));

export default function MultilineTextFields(props) {
  const classes = useStyles();
  // const [value, setValue] = React.useState('Controlled');
  const [label, setLabel] = React.useState(props.label);
  const [rows, setRows] = React.useState(props.rows);

  // const handleChange = event => {
  //   setValue(event.target.value);
  // };

  return (
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="outlined-multiline-static"
          label={label}
          multiline
          rows={rows}
          variant="outlined"
        />
      </form>
  );
}
