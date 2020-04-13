const calculatePeriod = (data) => {
  if (data.periodType === 'weeks') {
    return 2 ** Math.trunc((data.timeToElapse * 7) / 3);
  }
  if (data.periodType === 'months') {
    return 2 ** Math.trunc((data.timeToElapse * 30) / 3);
  }
  return 2 ** Math.trunc(data.timeToElapse / 3);
};
const getDays = (data) => {
  if (data.periodType === 'weeks') {
    return 7 * data.timeToElapse;
  }
  if (data.periodType === 'months') {
    return 30 * data.timeToElapse;
  }
  return data.timeToElapse;
};
const currentInfections = (data) => {
  const currentlyInfected = data.reportedCases * 10;
  const infectionsByRequestedTime = currentlyInfected * calculatePeriod(data);
  const severeCasesByRequestedTime = (15 / 100) * infectionsByRequestedTime;
  const compute = (35 / 100) * data.totalHospitalBeds;
  const hospitalBedsByRequestedTime = Math.ceil(compute - severeCasesByRequestedTime);
  const casesForICUByRequestedTimeR = ((5 / 100) * infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTimeR = ((2 / 100) * infectionsByRequestedTime);
  const result = data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation;
  const dollarsInFlightR = (infectionsByRequestedTime * result) / getDays(data);

  const casesForICUByRequestedTime = Math.trunc(casesForICUByRequestedTimeR);
  const casesForVentilatorsByRequestedTime = Math.trunc(casesForVentilatorsByRequestedTimeR);
  const dollarsInFlight = Math.trunc(dollarsInFlightR);

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};
const projectedInfections = (data) => {
  const currentlyInfected = data.reportedCases * 50;
  const infectionsByRequestedTime = currentlyInfected * calculatePeriod(data);
  const severeCasesByRequestedTime = (15 / 100) * infectionsByRequestedTime;
  const compute = (35 / 100) * data.totalHospitalBeds;
  const hospitalBedsByRequestedTime = Math.ceil(compute - severeCasesByRequestedTime);
  const casesForICUByRequestedTimeR = ((5 / 100) * infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTimeR = ((2 / 100) * infectionsByRequestedTime);
  const result = data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation;
  const dollarsInFlightR = (infectionsByRequestedTime * result) / getDays(data);


  const casesForICUByRequestedTime = Math.trunc(casesForICUByRequestedTimeR);
  const casesForVentilatorsByRequestedTime = Math.trunc(casesForVentilatorsByRequestedTimeR);
  const dollarsInFlight = Math.trunc(dollarsInFlightR);

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => ({
  data,
  impact: currentInfections(data),
  severeImpact: projectedInfections(data)
});
