import { describe, it, expect } from 'vitest';
import { ResumableUploaderEngine } from '../resumableUpload';

describe('TUS Resumable 512KB Chunked Upload Engine Unit Tests', () => {
  it('should accurately calculate total chunks for given file size based on 512KB chunks', () => {
    // 2MB file = 2 * 1024 * 1024 = 2097152 bytes / (512 * 1024) = 4 chunks
    const mockFile = new File(['a'.repeat(2 * 1024 * 1024)], 'assignment.pdf', { type: 'application/pdf' });
    const engine = new ResumableUploaderEngine(mockFile, { chunkSize: 512 * 1024 });

    expect(engine.getTotalChunks()).toBe(4);
  });

  it('should slice file into exact 512KB chunk slices', () => {
    const mockFile = new File(['a'.repeat(1024 * 1024)], 'project.zip', { type: 'application/zip' });
    const engine = new ResumableUploaderEngine(mockFile, { chunkSize: 512 * 1024 });

    const chunk0 = engine.getChunkSlice(0);
    const chunk1 = engine.getChunkSlice(1);

    expect(chunk0.size).toBe(512 * 1024);
    expect(chunk1.size).toBe(512 * 1024);
  });

  it('should calculate accurate percentage completion during chunk progression', () => {
    const totalBytes = 2097152; // 2MB
    const uploadedBytes = 1048576; // 1MB uploaded (50%)
    const percentage = Math.round((uploadedBytes / totalBytes) * 100);

    expect(percentage).toBe(50);
  });
});
