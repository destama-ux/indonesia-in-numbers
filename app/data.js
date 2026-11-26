// Indonesia in Numbers — the figures.
//
// Every number below is a World Bank World Development Indicators (WDI)
// value for Indonesia, retrieved from the World Bank API on 26 November
// 2026. Values are stored as published; the site only formats them.
// Two WDI series returned no values for Indonesia in 2015-2024
// (CO2 emissions per capita, central government debt) and are not shown.
//
// Years run 2015-2024. "Latest" always means 2024 unless a series ends
// earlier (adult literacy ends in 2020).

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  population: {
    code: 'SP.POP.TOTL',
    label: 'Population, total',
    unit: 'people',
    values: [261799249, 264627418, 267346658, 269951846, 272489381, 274814866, 276758053, 278830529, 281190067, 283487931],
  },
  gdp: {
    code: 'NY.GDP.MKTP.CD',
    label: 'GDP (current US$)',
    unit: 'US$',
    values: [860854232686, 931877364038, 1015618744160, 1042271532989, 1119099871350, 1059054842698, 1186509691087, 1319101183380, 1371166925750, 1396301788462],
  },
  gdpPerCapita: {
    code: 'NY.GDP.PCAP.CD',
    label: 'GDP per capita (current US$)',
    unit: 'US$',
    values: [3288.22, 3521.47, 3798.88, 3860.95, 4106.95, 3853.70, 4287.17, 4730.83, 4876.30, 4925.44],
  },
  growth: {
    code: 'NY.GDP.MKTP.KD.ZG',
    label: 'GDP growth (annual %)',
    unit: '%',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
  },
  inflation: {
    code: 'FP.CPI.TOTL.ZG',
    label: 'Inflation, consumer prices (annual %)',
    unit: '%',
    values: [6.36, 3.53, 3.81, 3.20, 3.03, 1.92, 1.56, 4.21, 3.67, 2.18],
  },
  unemployment: {
    code: 'SL.UEM.TOTL.ZS',
    label: 'Unemployment, total (% of labour force)',
    unit: '%',
    values: [4.51, 4.30, 3.78, 4.39, 3.59, 4.26, 3.83, 3.46, 3.31, 3.30],
  },
  lifeExpectancy: {
    code: 'SP.DYN.LE00.IN',
    label: 'Life expectancy at birth (years)',
    unit: 'years',
    values: [69.52, 69.73, 69.95, 70.08, 70.35, 68.82, 67.45, 70.93, 71.15, 71.29],
  },
  internet: {
    code: 'IT.NET.USER.ZS',
    label: 'Individuals using the Internet (% of population)',
    unit: '%',
    values: [22.06, 25.45, 32.34, 39.90, 47.69, 53.73, 62.10, 66.48, 69.21, 72.78],
  },
  urban: {
    code: 'SP.URB.TOTL.IN.ZS',
    label: 'Urban population (% of total population)',
    unit: '%',
    values: [53.17, 53.81, 54.45, 55.10, 55.74, 56.28, 56.88, 57.49, 58.12, 58.75],
  },
  forest: {
    code: 'AG.LND.FRST.ZS',
    label: 'Forest area (% of land area)',
    unit: '%',
    values: [50.61, 50.67, 50.73, 50.78, 50.84, 50.90, 50.54, 50.58, 50.63, 50.67],
  },
  exports: {
    code: 'NE.EXP.GNFS.ZS',
    label: 'Exports of goods and services (% of GDP)',
    unit: '% of GDP',
    values: [21.16, 19.09, 20.18, 21.00, 18.59, 17.33, 21.42, 24.50, 21.81, 22.31],
  },
  imports: {
    code: 'NE.IMP.GNFS.ZS',
    label: 'Imports of goods and services (% of GDP)',
    unit: '% of GDP',
    values: [20.78, 18.33, 19.18, 22.07, 19.04, 15.64, 18.79, 20.96, 19.65, 20.50],
  },
  fdi: {
    code: 'BX.KLT.DINV.CD.WD',
    label: 'Foreign direct investment, net inflows (BoP, current US$)',
    unit: 'US$',
    values: [19779127977, 4541713739, 20510310832, 18909826044, 24993551748, 19175077748, 21213080330, 24702029705, 21543358781, 24275445280],
  },
  popGrowth: {
    code: 'SP.POP.GROW',
    label: 'Population growth (annual %)',
    unit: '%',
    values: [1.12, 1.07, 1.02, 0.97, 0.94, 0.85, 0.70, 0.75, 0.84, 0.81],
  },
  underFiveMortality: {
    code: 'SH.DYN.MORT',
    label: 'Mortality rate, under-5 (per 1,000 live births)',
    unit: 'per 1,000',
    values: [26.1, 25.0, 23.8, 22.8, 21.8, 20.8, 19.9, 19.1, 18.4, 17.7],
  },
  ageYoung: {
    code: 'SP.POP.0014.TO.ZS',
    label: 'Population ages 0-14 (% of total population)',
    unit: '%',
    values: [26.97, 26.77, 26.56, 26.33, 26.09, 25.83, 25.58, 25.27, 24.93, 24.60],
  },
  ageOld: {
    code: 'SP.POP.65UP.TO.ZS',
    label: 'Population ages 65 and above (% of total population)',
    unit: '%',
    values: [6.08, 6.15, 6.24, 6.35, 6.49, 6.61, 6.69, 6.82, 7.05, 7.29],
  },
  fertility: {
    code: 'SP.DYN.TFRT.IN',
    label: 'Fertility rate, total (births per woman)',
    unit: 'births',
    values: [2.35, 2.31, 2.25, 2.22, 2.21, 2.19, 2.17, 2.15, 2.13, 2.12],
  },
  labourForce: {
    code: 'SL.TLF.TOTL.IN',
    label: 'Labour force, total',
    unit: 'people',
    values: [127299364, 128501300, 130940742, 134532894, 137425585, 137375390, 135672770, 139637843, 143318723, 145198137],
  },
  literacy: {
    code: 'SE.ADT.LITR.ZS',
    label: 'Literacy rate, adult total (% of people ages 15 and above)',
    unit: '%',
    // Latest published value is 2020 (96%). Earlier values shown where published.
    values: [95.22, 95.38, null, null, null, 96.0, null, null, null, null],
    latestYear: 2020,
  },
};

// Value added by sector, % of GDP, 2024. The three shares sum to 95.7%;
// the remainder is net taxes on products, which WDI reports separately.
export const SECTORS_2024 = [
  { key: 'agriculture', label: 'Agriculture, forestry and fishing', code: 'NV.AGR.TOTL.ZS', value: 12.61 },
  { key: 'industry', label: 'Industry (including construction)', code: 'NV.IND.TOTL.ZS', value: 39.32 },
  { key: 'services', label: 'Services', code: 'NV.SRV.TOTL.ZS', value: 43.77 },
];

export const SOURCE_NOTE =
  'Source: World Bank World Development Indicators, Indonesia, retrieved 26 November 2026. ' +
  'Figures are as published by the World Bank; nothing here is estimated by this site.';

// Latest non-null value of a series, with its year.
export function latest(series) {
  for (let i = series.values.length - 1; i >= 0; i--) {
    if (series.values[i] !== null && series.values[i] !== undefined) {
      return { year: YEARS[i], value: series.values[i] };
    }
  }
  return { year: null, value: null };
}

// Value of a series in a given year (or null when unpublished).
export function valueIn(series, year) {
  const i = YEARS.indexOf(year);
  if (i === -1) return null;
  return series.values[i];
}
