import { cqrsBus, CommandResult, ICommand } from './index';

export const COMMAND_TYPES = {
  SUBMIT_ASSIGNMENT: 'ASSIGNMENT:SUBMIT',
  GRADE_SUBMISSION: 'SUBMISSION:GRADE',
  CREATE_LECTURE: 'LECTURE:CREATE',
  UPDATE_STUDY_GROUP: 'STUDY_GROUP:UPDATE',
} as const;

export interface SubmitAssignmentPayload {
  courseId: number;
  assignmentId: number;
  studentId: string;
  studentName: string;
  fileName: string;
  fileUrl?: string;
  comment?: string;
}

export interface GradeSubmissionPayload {
  courseId: number;
  assignmentId: number;
  studentId: string;
  grade: number;
  feedback?: string;
}

// Register Submit Assignment Command Handler
cqrsBus.registerCommand(COMMAND_TYPES.SUBMIT_ASSIGNMENT, async (cmd: ICommand<SubmitAssignmentPayload>): Promise<CommandResult> => {
  const { courseId, assignmentId, studentId, studentName, fileName, fileUrl, comment } = cmd.payload;

  if (!courseId || !assignmentId || !studentId || !fileName) {
    return {
      success: false,
      error: 'Missing required assignment submission fields',
      commandId: cmd.commandId,
      timestamp: new Date().toISOString()
    };
  }

  const submission = {
    assignmentId,
    studentId,
    studentName,
    submittedAt: new Date().toISOString(),
    fileName,
    fileUrl,
    comment,
  };

  return {
    success: true,
    data: submission,
    commandId: cmd.commandId,
    timestamp: new Date().toISOString()
  };
});

// Register Grade Submission Command Handler
cqrsBus.registerCommand(COMMAND_TYPES.GRADE_SUBMISSION, async (cmd: ICommand<GradeSubmissionPayload>): Promise<CommandResult> => {
  const { grade, feedback } = cmd.payload;

  if (grade < 0 || grade > 100) {
    return {
      success: false,
      error: 'Grade must be between 0 and 100',
      commandId: cmd.commandId,
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: true,
    data: { grade, feedback, gradedAt: new Date().toISOString() },
    commandId: cmd.commandId,
    timestamp: new Date().toISOString()
  };
});
