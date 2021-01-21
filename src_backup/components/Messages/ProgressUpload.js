import React from 'react';
import { Progress } from "semantic-ui-react";

const ProgressUpload = ({dataMsgForm}) => {
  return dataMsgForm.modalUpload.uploadState === 'uploading' && (
  <Progress 
    className="progress__bar"
    percent={dataMsgForm.modalUpload.percentUploaded}
    progress
    indicating
    size="medium"
    inverted
  />)
}
export default ProgressUpload;