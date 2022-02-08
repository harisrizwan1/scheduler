import { useReducer, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value,
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers,
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.value.appointments,
          days: action.value.days,
        };

      default:
        return { ...state };
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // // websockets
  // useEffect(() => {
  //   const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  //   webSocket.onopen = function () {
  //     webSocket.send("ping");
  //   };

  //   webSocket.onmessage = function (event) {
  //     const { type, id, interview } = JSON.parse(event.data);
  //     if (type === SET_INTERVIEW) {
  //       const appointment = {
  //         ...state.appointments[id],
  //         interview: interview ? { ...interview } : null,
  //       };
  //       const appointments = {
  //         ...state.appointments,
  //         [id]: appointment,
  //       };
  //       const days = updateSpots(state, appointments, id);
  //       dispatch({
  //         type: type,
  //         value: { appointments: appointments, days: days },
  //       });
  //     }
  //   };
  // }, [state]);

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data,
        },
      });
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

    const newDay = state.days.filter((day) => day.name === state.day)[0];
    if (!state.appointments[id].interview) {
      newDay.spots -= 1;
    }
    const days = state.days.map((day) => (day.id === newDay.id ? newDay : day));

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        value: { appointments: appointments, days: days },
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
      dispatch({
        type: SET_INTERVIEW,
        value: { appointments: appointments, days: days },
      });
    });
  };

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
