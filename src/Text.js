import React, {useState} from 'react';
import MultilineTextFields from './MultilineTextFields.js'
import SimpleBackdrop from './SimpleBackdrop.js'
import ChipsArray from './ChipsArray.js'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const houkokusakiData = [
  { key: 0, label: '米・麦・大豆'},
  { key: 1, label: '青果物'},
  { key: 2, label: '農機'},
];
const katudoNaiyoData = [
  { key: 0, label: '農業経営相談'},
  { key: 1, label: '営農相談'},
  { key: 2, label: '商品提案'},
];

function Text() {
  const [estimeStatus, setEstimeStatus] = useState(false);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);


  function handleTextChange(textValue) {
    setValue(textValue);
  }

  function handleSubmit(e) {
    alert(value);
  }

  const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

  function SimpleBackdrop(props) {
    const classes = useStyles();
    const label = props.label;
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setTimeout(() => {
              setOpen(false);
              setEstimeStatus(true);
            }, 3000);
          }}
        >
          {label}
        </button>
        <Backdrop
          className={classes.backdrop}
          open={open}
          onClick={() => {
            setOpen(false);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  return (
        <div>
          <div className="text">
            <MultilineTextFields className="title" label='タイトル' rows='1'/>
            <MultilineTextFields className="detail" label='詳細内容' rows='8'/>
            <SimpleBackdrop label='確認' />
          </div>
          { estimeStatus &&
            <div className="info" style={{width: '15%', }}>
            <p>報告先の候補</p>
            <ChipsArray data={houkokusakiData} />
            <p>活動内容の候補</p>
            <ChipsArray data={katudoNaiyoData} />
          </div>
          }
        </div>
      );
}

export default Text;
