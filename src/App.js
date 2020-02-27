import React from 'react';
import './App.css';
import ChipsArray from './ChipsArray.js'
import MultilineTextFields from './MultilineTextFields.js'
import TimePicker from './TimePicker.js'
// import HorizontalLabelPositionBelowStepper from './HorizontalLabelPositionBelowStepper.js'
import SimpleBackdrop from './SimpleBackdrop.js'
import NestedGrid from './NestedGrid.js'
import Text from './Text.js'
import InputWithIcon from './InputWithIcon.js'

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

function App() {

  return (
    <div className="App" style={{padding: '50px 100px'}}>
        <h1>TACシステム</h1>
        <div className="topContainer">
          <InputWithIcon label='報告者ユーザーID'/>
          <InputWithIcon label='組合員コード'/>
          <TimePicker />
          <Text />
        </div>

    </div>
  );
}

export default App;

// <div className="bottomContainer" style={{marginTop: '100px'}}>
//   <div className='taskBox' styles={{marginTop: '300px'}}>
//     <NestedGrid />
//     <br/>
//     <SimpleBackdrop label='登録' />
//   </div>
// </div>
