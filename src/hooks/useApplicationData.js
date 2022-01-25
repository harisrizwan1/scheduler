import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    console.log("days: ", state.days);

    const newDay = state.days.filter((day) => day.name === state.day)[0];
    newDay.spots -= 1;
    const days = state.days.map((day) => (day.id === newDay.id ? newDay : day));

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state,
        days,
        appointments,
      });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const newDay = state.days.filter((day) => day.name === state.day)[0];
    newDay.spots += 1;
    const days = state.days.map((day) => (day.id === newDay.id ? newDay : day));

    return axios.delete(`/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state,
        days,
        appointments,
      });
    });
  };

  const setDay = (day) => setState({ ...state, day });

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
