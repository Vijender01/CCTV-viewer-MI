// generate-recordings.js
import fs from "fs";
import path from "path";
import util from "util";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";

const stat = util.promisify(fs.stat);

// 👇 Change this to your latest CCTV video folder
const VIDEO_FOLDER =
  "public/First Floor front/xiaomi_camera_videos/607ea4cf60db/2025081714";

// 👇 Output TypeScript file
const OUTPUT_FILE = path.resolve("./src/data/recording.ts");

// Helper to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Helper to format date without Z (local time)
function formatLocal(date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    "T" +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
}

// promisify ffprobe
function getVideoMetadata(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.setFfprobePath(ffprobeStatic.path);
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration || 0;
      resolve(duration);
    });
  });
}

async function generate() {
  if (!fs.existsSync(VIDEO_FOLDER)) {
    console.error("❌ Video folder not found:", VIDEO_FOLDER);
    process.exit(1);
  }

  const files = fs.readdirSync(VIDEO_FOLDER).filter((f) => f.endsWith(".mp4"));
  const recordings = [];

  for (const file of files) {
    const fullPath = path.join(VIDEO_FOLDER, file);
    const stats = await stat(fullPath);

    try {
      const duration = await getVideoMetadata(fullPath);

      recordings.push({
        name: file,
        path: fullPath.replace(/\\/g, "/"), // Browser expects forward slashes
        duration: Math.floor(duration),
        size: stats.size,
        createdAt: formatLocal(stats.birthtime),
      });
    } catch (err) {
      console.warn(`⚠️ Skipping corrupted file: ${file} (${err.message})`);
      continue;
    }
  }

  const today = formatDate(new Date());

  const content = `// CCTV Recordings Data - Auto-generated
export interface Recording {
  name: string;
  path: string;
  duration: number;
  size: number;
  createdAt: string;
}

export interface CameraRecordings {
  [camera: string]: Recording[];
}

export interface RecordingsData {
  [date: string]: CameraRecordings;
}

export const RECORDINGS: RecordingsData = {
  "${today}": {
    "first floor front": ${JSON.stringify(recordings, null, 2)},
    "camera2": [],
    "camera3": [],
    "camera4": [],
    "camera5": [],
    "camera6": []
  }
};
`;

  fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
  console.log(`✅ Recordings file generated at ${OUTPUT_FILE}`);
}

generate();


// import fs from "fs";
// import path from "path";
// import util from "util";
// import ffmpeg from "fluent-ffmpeg";
// import ffprobeStatic from "ffprobe-static";

// const stat = util.promisify(fs.stat);

// // 👇 Change this to your latest CCTV video folder
// const VIDEO_FOLDER =
//   "public/First Floor front/xiaomi_camera_videos/607ea4cf60db/2025081714";

// // 👇 Output TypeScript file
// const OUTPUT_FILE = path.resolve("./src/data/recording.ts");

// // Helper to format date as YYYY-MM-DD
// function formatDate(date) {
//   return date.toISOString().split("T")[0];
// }

// // Helper to format date without Z (local time)
// function formatLocal(date) {
//   return (
//     date.getFullYear() +
//     "-" +
//     String(date.getMonth() + 1).padStart(2, "0") +
//     "-" +
//     String(date.getDate()).padStart(2, "0") +
//     "T" +
//     String(date.getHours()).padStart(2, "0") +
//     ":" +
//     String(date.getMinutes()).padStart(2, "0") +
//     ":" +
//     String(date.getSeconds()).padStart(2, "0")
//   );
// }

// // promisify ffprobe
// function getVideoMetadata(file) {
//   return new Promise((resolve, reject) => {
//     ffmpeg.setFfprobePath(ffprobeStatic.path);
//     ffmpeg.ffprobe(file, (err, metadata) => {
//       if (err) return reject(err);
//       const duration = metadata.format.duration || 0;
//       resolve(duration);
//     });
//   });
// }

// async function generate() {
//   if (!fs.existsSync(VIDEO_FOLDER)) {
//     console.error("❌ Video folder not found:", VIDEO_FOLDER);
//     process.exit(1);
//   }

//   const files = fs.readdirSync(VIDEO_FOLDER).filter((f) => f.endsWith(".mp4"));
//   const recordings = [];

//   for (const file of files) {
//     const fullPath = path.join(VIDEO_FOLDER, file);
//     const stats = await stat(fullPath);
//     const duration = await getVideoMetadata(fullPath);

//     recordings.push({
//       name: file,
//       // Browser expects forward slashes
//       path: fullPath.replace(/\\/g, "/"),
//       duration: Math.floor(duration),
//       size: stats.size,
//       createdAt: formatLocal(stats.birthtime),
//     });
//   }

//   const today = formatDate(new Date());

//   const content = `// CCTV Recordings Data - Auto-generated
// export interface Recording {
//   name: string;
//   path: string;
//   duration: number;
//   size: number;
//   createdAt: string;
// }

// export interface CameraRecordings {
//   [camera: string]: Recording[];
// }

// export interface RecordingsData {
//   [date: string]: CameraRecordings;
// }

// export const RECORDINGS: RecordingsData = {
//   "${today}": {
//     "first floor front": ${JSON.stringify(recordings, null, 2)},
//     "camera2": [],
//     "camera3": [],
//     "camera4": [],
//     "camera5": [],
//     "camera6": []
//   }
// };
// `;

//   fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
//   console.log(`✅ Recordings file generated at ${OUTPUT_FILE}`);
// }

// generate();

