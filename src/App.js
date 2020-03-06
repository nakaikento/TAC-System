import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ChipsArray from './ChipsArray.js'
import MultilineTextFields from './MultilineTextFields.js'
import TimePicker from './TimePicker.js'
// import HorizontalLabelPositionBelowStepper from './HorizontalLabelPositionBelowStepper.js'
import SimpleBackdrop from './SimpleBackdrop.js'
import NestedGrid from './NestedGrid.js'
import Text from './Text.js'
import InputWithIcon from './InputWithIcon.js'
// import BasicTextField from './BasicTextField.js'

const FLASK_ENDPOINT = 'http://127.0.0.1:5050/query/';
function App() {

  const [reportTos, setReportTos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [inputTitle, setInputTitle] = useState('');

  function handleGetApiData(e) {
    console.log('input text: ', inputText);
    // prevent page reload
    e.preventDefault();
    // 報告先
    axios
      .get(FLASK_ENDPOINT, {
        params : {
          text : inputText
        }
      })
      .then(res => {
        const datas = res.data;
        const setData = datas.map(data => {
          return data.label
        });
        // state update
        setReportTos(setData);
      }).catch(err => {
        console.log('err:', err);
      });
  }

  function handleInputTextChange(text) {
    // state update
    setInputText(text);
  }

  function handleInputTitleChange(title) {
    // state update
    setInputTitle(title);
  }

  return (
    <div className="App" style={{padding: '50px 100px'}}>
        <h1>TACシステム</h1>
        <div className="topContainer">
          <TimePicker />
          <InputWithIcon label='報告者ID'/>
          <InputWithIcon label='組合員ID'/>
          <Text handleInputTextChange={e => handleInputTextChange(e)}
                handleInputTitleChange={e => handleInputTitleChange(e)}
                handleGetApiData={e => handleGetApiData(e)}
                reportTos = {reportTos}
          />
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
