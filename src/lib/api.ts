import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export interface UploadResponse {
  jobId: string;
}

export interface StatusResponse {
  status: "pending" | "processing" | "done" | "failed";
  percent?: number;
  chunkCount?: number;
  error?: string;
}

export async function uploadVideo(
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("video", file);

  const response = await api.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  });

  return response.data;
}

export async function getJobStatus(jobId: string): Promise<StatusResponse> {
  const response = await api.get<StatusResponse>(`/status/${jobId}`);
  return response.data;
}

export function getDownloadUrl(jobId: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "/api";
  return `${baseUrl}/download/${jobId}`;
}
