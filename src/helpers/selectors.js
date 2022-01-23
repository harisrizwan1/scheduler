export function getAppointmentsForDay(state, day) {
  const results = [];

  if (state.days.length > 0) {
    const filteredDay = state.days.filter(currDay => currDay.name === day)[0];
    if (filteredDay) {
      const appointments = filteredDay.appointments;
      for (const app of appointments) {
        results.push(state.appointments[app])
      }
    }
  }

  return results;
};

export function getInterviewersForDay(state, day) {
  const results = [];

  if (state.days.length > 0) {
    const filteredDay = state.days.filter(currDay => currDay.name === day)[0];
    if (filteredDay) {
      const interviewers = filteredDay.interviewers;
      for (const app of interviewers) {
        results.push(state.interviewers[app])
      }
    }
  }

  return results;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const result = {}

  result.student = interview.student;
  result.interviewer = state.interviewers[interview.interviewer];

  return result;
};