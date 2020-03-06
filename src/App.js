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
import BasicTextField from './BasicTextField.js'

const FLASK_ENDPOINT = 'http://127.0.0.1:5050/query/';

function App() {

  const [reportTos, setReportTos] = useState([])
  const [inputText, setInputText] = useState('')

  function handleGetApiData(e) {
    console.log('input text: ', inputText);
    // prevent page reload
    e.preventDefault();
    // set loading status
    // setLoading(true);
    // HTTP request for Flask
    axios
      .get(FLASK_ENDPOINT, {
        params : {
          text : inputText
        }
      })
      .then(res => {
        const data = res.data;
        console.log(data);
        const setData = (data.map(d =>
          {key: d.key, label : d.label}
        ));
        // console.log(setData);
        // state update
        setReportTos(setData);
      }).catch(err => {
        console.log('err:', err);
      }).then(function () {
        // always executed
        // set loading status
        // setLoading(false);
      });
  }

  function handleInputTextChange(text) {
    // state update
    setInputText(text);
  }

  return (
    <div className="App" style={{padding: '50px 100px'}}>
        <h1>TACシステム</h1>
        <div className="topContainer">
          <TimePicker />
          <InputWithIcon label='報告者ID'/>
          <InputWithIcon label='組合員ID'/>
          <BasicTextField label="都道府県"/>
          <BasicTextField label="農協コード"/>
          <BasicTextField label="農家区分"/>

          <Text handleInputTextChange={e => handleInputTextChange(e)}
                handleGetApiData={e => handleGetApiData(e)}
                reportTos = {reportTos}
          />
          <BasicTextField label="活動内容"/>
          <BasicTextField label="活動項目"/>
          // <p>{reportTos}</p>
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
