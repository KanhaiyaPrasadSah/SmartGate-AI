const groupBySem = (data) => {
  const result = {};

  data.forEach((v) => {
    const sem = v.SEM;

    if (!result[sem]) {
      result[sem] = 0;
    }

    result[sem]++;
  });

  return result;
};

export default groupBySem;