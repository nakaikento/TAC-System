import React, {useState} from 'react';
import MultilineTextFields from './MultilineTextFields.js'
import SimpleBackdrop from './SimpleBackdrop.js'
import ChipsArray from './ChipsArray.js'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

// const houkokusakiData = [
//   { key: 0, label: '米・麦・大豆'},
//   { key: 1, label: '青果物'},
//   { key: 2, label: '農機'},
// ];
// const katudoNaiyoData = [
//   { key: 0, label: '農業経営相談'},
//   { key: 1, label: '営農相談'},
//   { key: 2, label: '商品提案'},
// ];

function Text(props) {

  const [open, setOpen] = useState(false);
  const reportTos = props.reportTos;
  // const houkokusakiData = props.reportTos.map(reportTo =>{
  //   { key : reportTo.key,
  //     label : reportTo.label }
  // });



  const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

  return (
        <div>
          <div className="text">
            <MultilineTextFields className="title" label='タイトル' rows='1'/>
            <MultilineTextFields className="detail"
                                 label='詳細内容'
                                 rows='8'
                                 handleInputTextChange={e => props.handleInputTextChange(e)}/>
            <SimpleBackdrop label='確認' handleGetApiData={e => props.handleGetApiData(e)}/>
          </div>
            <div className="info" style={{width: '15%', }}>
            <p>報告先</p>
            <ChipsArray data={reportTos} />
          </div>
        </div>
      );
}

export default Text;
