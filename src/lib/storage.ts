import { supabase } from './supabase';

export interface StorageUploadResult {
  path: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Uploads a course material file (PDF, DOCX, SLIDES) to the 'course-materials' public bucket.
 */
export async function uploadCourseMaterial(
  courseId: number,
  file: File
): Promise<StorageUploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${courseId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('course-materials')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload error, falling back to blob URL', error);
      return {
        path: fileName,
        publicUrl: URL.createObjectURL(file)
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('course-materials')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (e: any) {
    console.warn('Storage upload exception', e);
    return {
      path: file.name,
      publicUrl: URL.createObjectURL(file)
    };
  }
}

/**
 * Uploads a student assignment submission file (PDF or ZIP) to 'assignment-submissions' bucket.
 */
export async function uploadAssignmentSubmission(
  studentId: string,
  assignmentId: number,
  file: File
): Promise<StorageUploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/${assignmentId}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('assignment-submissions')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase assignment upload error, falling back to local URL', error);
      return {
        path: fileName,
        publicUrl: URL.createObjectURL(file)
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('assignment-submissions')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl || URL.createObjectURL(file)
    };
  } catch (e: any) {
    return {
      path: file.name,
      publicUrl: URL.createObjectURL(file)
    };
  }
}

/**
 * Resolves a public download/view URL for a file in Supabase Storage.
 */
export function getPublicFileUrl(bucket: 'course-materials' | 'assignment-submissions', path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
