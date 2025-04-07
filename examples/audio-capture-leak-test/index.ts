import {
  AudioFrame,
  AudioSource,
  dispose,
} from '@livekit/rtc-node';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get AudioSourceCapt threads in current process
async function getAudioSourceCaptThreads(): Promise<string[]> {
  const pid = process.pid;
  try {
    // Find all threads in our process
    const { stdout: tasks } = await execAsync(`ls -1 /proc/${pid}/task/`);
    const threadIds = tasks.trim().split('\n').filter(line => line !== `${pid}`);
    
    // Check each thread name
    const audioSourceCaptThreads: string[] = [];
    for (const tid of threadIds) {
      try {
        const { stdout: commName } = await execAsync(`cat /proc/${process.pid}/task/${tid}/comm`);
        const name = commName.trim();
        if (name.includes('AudioSourceCapt')) {
          audioSourceCaptThreads.push(tid);
        }
      } catch {
        // Ignore errors reading thread name
      }
    }
    
    return audioSourceCaptThreads;
  } catch (error) {
    console.error('Error finding AudioSourceCapt threads:', error);
    return [];
  }
}

// Count AudioSourceCapt threads
async function countAudioSourceCaptureThreads(): Promise<number> {
  const threads = await getAudioSourceCaptThreads();
  return threads.length;
}

// Print details of AudioSourceCapt threads
async function printAudioSourceCaptureThreadDetails(): Promise<void> {
  try {
    const threads = await getAudioSourceCaptThreads();
    
    if (threads.length === 0) {
      console.log('No AudioSourceCapt threads found');
      return;
    }
    
    console.log(`Found ${threads.length} AudioSourceCapt threads:`);
    console.log('TID');
    for (const tid of threads) {
      console.log(tid);
    }
    
    // Try to get more detailed thread info
    try {
      const pid = process.pid;
      const { stdout } = await execAsync(`ps -T -p ${pid} | grep AudioSourceCapt`);
      console.log('\nThread details:');
      console.log(stdout);
    } catch {
      // Ignore grep errors (no matches)
    }
  } catch (error) {
    console.error('Error printing AudioSourceCapt thread details:', error);
  }
}

async function captureSilentFrame(source: AudioSource): Promise<void> {
  const sampleRate = 48000;
  const channels = 2;
  const frameDuration = 20; // ms
  const samplesPerChannel = (sampleRate * frameDuration) / 1000;
  const totalSamples = samplesPerChannel * channels;
  
  // Create buffer with non-zero values to ensure processing
  const buffer = new Int16Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    buffer[i] = Math.floor(Math.sin(i * 0.01) * 10000);
  }
  
  const frame = new AudioFrame(
    buffer,
    sampleRate,
    channels,
    samplesPerChannel,
  );
  
  await source.captureFrame(frame);
}

async function testAudioSourceLifecycle(iteration: number): Promise<void> {
  console.log(`\n[Iteration ${iteration}] Starting test`);
  
  // Check for AudioSourceCapt threads at start
  const beforeCount = await countAudioSourceCaptureThreads();
  console.log(`[Iteration ${iteration}] AudioSourceCapt threads before test: ${beforeCount}`);
  if (beforeCount > 0) {
    console.log(`[Iteration ${iteration}] WARNING: AudioSourceCapt threads already exist at start!`);
    await printAudioSourceCaptureThreadDetails();
  }
  
  // Step 1: Test with zero queue size (shouldn't create threads)
  console.log(`[Iteration ${iteration}] Creating AudioSource with zero queue size`);
  const source1 = new AudioSource(48000, 2, 0);
  
  // Wait a moment for potential thread creation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check for threads after creating with zero queue
  const afterZeroQueueCount = await countAudioSourceCaptureThreads();
  console.log(`[Iteration ${iteration}] AudioSourceCapt threads after creating with zero queue: ${afterZeroQueueCount}`);
  if (afterZeroQueueCount > beforeCount) {
    console.log(`[Iteration ${iteration}] New AudioSourceCapt threads created with zero queue:`);
    await printAudioSourceCaptureThreadDetails();
  }
  
  // Close first source
  console.log(`[Iteration ${iteration}] Closing AudioSource with zero queue`);
  await source1.close();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check for threads after closing first source
  const afterFirstCloseCount = await countAudioSourceCaptureThreads();
  console.log(`[Iteration ${iteration}] AudioSourceCapt threads after closing zero queue source: ${afterFirstCloseCount}`);
  
  // Step 2: Test with large queue size (should create threads)
  console.log(`[Iteration ${iteration}] Creating AudioSource with large queue size (2000ms)`);
  const source2 = new AudioSource(48000, 2, 2000);
  
  // Wait a moment for thread creation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check for threads after creating with large queue
  const afterLargeQueueCount = await countAudioSourceCaptureThreads();
  console.log(`[Iteration ${iteration}] AudioSourceCapt threads after creating with large queue: ${afterLargeQueueCount}`);
  if (afterLargeQueueCount > afterFirstCloseCount) {
    console.log(`[Iteration ${iteration}] New AudioSourceCapt threads created with large queue:`);
    await printAudioSourceCaptureThreadDetails();
  }
  
  // Capture frames to ensure queue is active
  console.log(`[Iteration ${iteration}] Capturing frames to fill queue`);
  for (let i = 0; i < 10; i++) {
    await captureSilentFrame(source2);
    
    // Check for new threads periodically
    if (i === 4) {
      const duringCaptureCount = await countAudioSourceCaptureThreads();
      console.log(`[Iteration ${iteration}] AudioSourceCapt threads during capture: ${duringCaptureCount}`);
      if (duringCaptureCount > afterLargeQueueCount) {
        console.log(`[Iteration ${iteration}] New threads appeared during capture:`);
        await printAudioSourceCaptureThreadDetails();
      }
    }
  }
  
  await source2.waitForPlayout();
  
  console.log(`[Iteration ${iteration}] Clearing queue`);
  source2.clearQueue();
  
  console.log(`[Iteration ${iteration}] Closing AudioSource with large queue`);
  await source2.close();
  
  // Give more time for cleanup
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check for threads after closing second source
  const afterSecondCloseCount = await countAudioSourceCaptureThreads();
  console.log(`[Iteration ${iteration}] AudioSourceCapt threads after closing large queue source: ${afterSecondCloseCount}`);
  
  if (afterSecondCloseCount > beforeCount) {
    console.error(`[Iteration ${iteration}] LEAK DETECTED: ${afterSecondCloseCount - beforeCount} AudioSourceCapt threads leaked!`);
    console.log('Leaked thread details:');
    await printAudioSourceCaptureThreadDetails();
  } else {
    console.log(`[Iteration ${iteration}] No AudioSourceCapt thread leaks detected`);
  }
}

async function runLeakTest() {
  try {
    console.log("Starting AudioSourceCapture thread leak test...");
    
    const iterations = 3;
    for (let i = 1; i <= iterations; i++) {
      await testAudioSourceLifecycle(i);
      
      if (i < iterations) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log("\nFinal thread check:");
    await printAudioSourceCaptureThreadDetails();
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    console.log("\nCleaning up...");
    await dispose();
    console.log("Test complete!");
  }
}

runLeakTest().catch(console.error);
