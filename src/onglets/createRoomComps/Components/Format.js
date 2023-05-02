import React from 'react'
import {Form } from 'react-bootstrap'

function Format({sport, choice,format}) {
  function  HandleChange(e){
  choice(e)
}
    return (
      <Form onChange={HandleChange}>
        <div key={`inline-radio`} className="mt-3">
          {sport.Formats?.map(el => <Form.Check inline type="radio" id="custom-radio" value={el} name="group1" key={el} label={el} />)}
        </div>
      </Form>
    )
}


export default  React.memo(Format)