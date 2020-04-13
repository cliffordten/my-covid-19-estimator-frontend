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
  


$().ready(function () {
  $("[data-go-estimate]").click((e) => {
    const population = $("[data-population]").val();
    const timeToElapse = $("[data-time-to-elapse]").val();
    const reportedCases = $("[data-reported-cases]").val();
    const totalHospitalBeds = $("[data-total-hospital-beds]").val();
    const periodType = $("[data-period-type]").val();

    if(population == '' || timeToElapse == '' || reportedCases == '' || totalHospitalBeds == ''){
        $('p.p').removeClass('p').addClass('hide');
        return;
    }

    if( typeof population == 'string' || typeof timeToElapse == 'string' || typeof reportedCases == 'string' || typeof totalHospitalBeds == 'string'){
        $('p.hide').addClass('p')
        $('p.p1').removeClass('p1').addClass('hide');
        return;
    }

    const data = {
      region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71,
      },
      periodType: periodType,
      timeToElapse: parseInt(timeToElapse),
      reportedCases: parseInt(reportedCases),
      population: parseInt(population),
      totalHospitalBeds: parseInt(totalHospitalBeds),
    };

    const result = covid19ImpactEstimator(data)
    
    $('.wrapper.result #result').html('<pre>' + JSON.stringify(result, undefined, 2) + '</pre>');
    
  });

});

// if (typeof myVar === 'string' || myVar instanceof String)
// // it's a string
// else