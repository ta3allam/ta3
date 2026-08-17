import { cqrsBus, QueryResult, IQuery } from './index';

export const QUERY_TYPES = {
  GET_COURSE_READ_MODEL: 'COURSE:GET_READ_MODEL',
  GET_TODAYS_DEADLINES: 'CALENDAR:GET_TODAYS_DEADLINES',
} as const;

cqrsBus.registerQuery(QUERY_TYPES.GET_COURSE_READ_MODEL, async (query: IQuery<{ courseId: number }>): Promise<QueryResult> => {
  const { courseId } = query.params;
  return {
    data: { courseId, retrievedAt: new Date().toISOString() },
    cached: true,
    timestamp: new Date().toISOString()
  };
});
