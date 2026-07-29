const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, '.')));

const KITCHEN_DIRECTORY_PATH = path.join(__dirname, 'forge_kitchen_project');
const MAIN_SOURCE_FILE_PATH = path.join(KITCHEN_DIRECTORY_PATH, 'src', 'main.cpp');
const EXECUTION_TIMEOUT_MS = 10000;

const compileTaskQueue = [];
let isProcessingQueue = false;

function processCompileQueue() {
  if (isProcessingQueue || compileTaskQueue.length === 0) return;

  isProcessingQueue = true;
  const currentTask = compileTaskQueue.shift();
  const { jobId, cppCode, responseStream } = currentTask;

  console.log(`[JOB ${jobId}] Compilation process initiated.`);

  fs.writeFile(MAIN_SOURCE_FILE_PATH, cppCode, 'utf8', (writeError) => {
    if (writeError) {
      isProcessingQueue = false;
      console.error(`[JOB ${jobId}] Failed to write source file.`);
      responseStream.status(500).json({
        success: false,
        jobId: jobId,
        error: 'File I/O Error: Unable to write source file.'
      });
      processCompileQueue();
      return;
    }

    exec('pros make', { cwd: KITCHEN_DIRECTORY_PATH, timeout: EXECUTION_TIMEOUT_MS }, (compileError, stdout, stderr) => {
      isProcessingQueue = false;

      if (compileError) {
        console.error(`[JOB ${jobId}] Compilation failed.`);
        responseStream.status(400).json({
          success: false,
          jobId: jobId,
          error: 'Compilation Failed',
          details: stdout || stderr
        });
      } else {
        console.log(`[JOB ${jobId}] Compilation completed successfully.`);
        responseStream.json({
          success: true,
          jobId: jobId,
          message: 'Project compiled successfully.'
        });
      }

      processCompileQueue();
    });
  });
}

app.get('/ping', (req, res) => {
  res.status(200).send('FORGE Server is Awake!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FORGE Backend operational.' });
});

app.post('/api/compile', (req, res) => {
  const { cppCode } = req.body;

  if (!cppCode) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request: No source code provided.'
    });
  }

  const jobId = crypto.randomUUID().substring(0, 8);
  console.log(`[JOB ${jobId}] Queued successfully.`);

  compileTaskQueue.push({ jobId, cppCode, responseStream: res });
  processCompileQueue();
});

app.listen(PORT, () => {
  console.log(`FORGE Server running on port ${PORT}`);
});