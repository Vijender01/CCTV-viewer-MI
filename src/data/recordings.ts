// CCTV Recordings Data - Simulates backend response
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
  "2025-08-21": {
    "camera1": [
      {
        "name": "camera1_08-00-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera1_08-00-00.mp4",
        "duration": 600,
        "size": 10485760,
        "createdAt": "2025-08-21T08:00:00"
      },
      {
        "name": "camera1_08-10-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera1_08-10-00.mp4",
        "duration": 120,
        "size": 5242880,
        "createdAt": "2025-08-21T08:10:00"
      }
    ],
    "camera2": [
      {
        "name": "camera2_09-00-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera2_09-00-00.mp4",
        "duration": 300,
        "size": 7340032,
        "createdAt": "2025-08-21T09:00:00"
      },
      {
        "name": "camera2_09-08-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera2_09-08-00.mp4",
        "duration": 60,
        "size": 2097152,
        "createdAt": "2025-08-21T09:08:00"
      }
    ],
    "camera3": [
      {
        "name": "camera3_07-30-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera3_07-30-00.mp4",
        "duration": 420,
        "size": 8388608,
        "createdAt": "2025-08-21T07:30:00"
      }
    ],
    "camera4": [
      {
        "name": "camera4_14-00-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera4_14-00-00.mp4",
        "duration": 900,
        "size": 15728640,
        "createdAt": "2025-08-21T14:00:00"
      }
    ],
    "camera5": [
      {
        "name": "camera5_11-45-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera5_11-45-00.mp4",
        "duration": 180,
        "size": 4194304,
        "createdAt": "2025-08-21T11:45:00"
      }
    ],
    "camera6": [
      {
        "name": "camera6_22-10-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera6_22-10-00.mp4",
        "duration": 75,
        "size": 2621440,
        "createdAt": "2025-08-21T22:10:00"
      },
      {
        "name": "camera6_22-12-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-21/camera6_22-12-00.mp4",
        "duration": 600,
        "size": 10485760,
        "createdAt": "2025-08-21T22:12:00"
      }
    ]
  },
  "2025-08-22": {
    "camera1": [
      {
        "name": "camera1_06-00-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-22/camera1_06-00-00.mp4",
        "duration": 300,
        "size": 6291456,
        "createdAt": "2025-08-22T06:00:00"
      }
    ],
    "camera2": [
      {
        "name": "camera2_10-15-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-22/camera2_10-15-00.mp4",
        "duration": 120,
        "size": 3145728,
        "createdAt": "2025-08-22T10:15:00"
      }
    ],
    "camera3": [
      {
        "name": "camera3_12-00-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-22/camera3_12-00-00.mp4",
        "duration": 480,
        "size": 9437184,
        "createdAt": "2025-08-22T12:00:00"
      }
    ],
    "camera4": [],
    "camera5": [
      {
        "name": "camera5_18-30-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-22/camera5_18-30-00.mp4",
        "duration": 240,
        "size": 5242880,
        "createdAt": "2025-08-22T18:30:00"
      }
    ],
    "camera6": []
  },
  "2025-08-20": {
    "camera1": [
      {
        "name": "camera1_05-50-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-20/camera1_05-50-00.mp4",
        "duration": 60,
        "size": 1572864,
        "createdAt": "2025-08-20T05:50:00"
      }
    ],
    "camera2": [],
    "camera3": [],
    "camera4": [
      {
        "name": "camera4_21-00-00.mp4",
        "path": "D:/CCTV_Recordings/2025-08-20/camera4_21-00-00.mp4",
        "duration": 720,
        "size": 12582912,
        "createdAt": "2025-08-20T21:00:00"
      }
    ],
    "camera5": [],
    "camera6": []
  }
};