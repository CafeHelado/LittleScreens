import { useState } from 'react'
import './App.css'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click Start to transcode');
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile('/flame.avi'));
    await ffmpeg.run('-i', 'test.avi', 'test.mp4');
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  const doTrim = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start trimming');
    ffmpeg.FS('writeFile', 'trim.avi', await fetchFile('/flame.avi'));
    await ffmpeg.run('-i', 'trim.avi', '-ss', '0', '-to', '1', 'output.mp4');
    setMessage('Complete trimming');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  return (
    <>
      <div>
        <video src={videoSrc} controls></video><br />
        <button onClick={doTranscode} className="logo">Start</button>
        <p>{message}</p>
      </div>
      <h1>Video editor</h1>
      <div className="card">
        <h3>Upload a mp4 (x264) video and trim its first 1 seconds and play!</h3>
        <video id="output-video" src={videoSrc} controls></video><br />
        <input type="file" id="uploader" onChange={doTrim}></input>'
      </div>
    </>
  )
}

export default App
