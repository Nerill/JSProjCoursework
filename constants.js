const tabBtn1 = document.querySelector('.tab-btn1');
const tabBtn2 = document.querySelector('.tab-btn2');
const dateFrom1 = document.querySelector('.date1');
const dateTo1 = document.querySelector('.date2');
const WMBtn = document.querySelector('.WM-btn');
const daysBtn = document.querySelector('.Days-btn');
const unitBtn = document.querySelector('.Unit-btn');
const tabs = document.querySelectorAll('.tab-content');
const resWM = document.getElementById('resultWM');
const resDays = document.getElementById('resultDays');
const resUnit = document.getElementById('resultUnit');
const resultList = document.querySelector('.collection');
const selectCountry = document.getElementById('selectCountry');
const selectYear = document.getElementById('selectYear');
const holidayBtn = document.querySelector('.holiday-btn');
const tableBody = document.querySelector('table');
const resTitle = document.querySelector('.res-title');
const countrySelect = document.getElementById('selectCountry');
const yearSelect = document.getElementById('selectYear');

const apiKey = 'u1k8kL9rVsbaT3RQOrmkAo6fqqZLpbxT';

export {tabBtn1, tabBtn2, dateFrom1, dateTo1, WMBtn, daysBtn, unitBtn, tabs, countrySelect, yearSelect,
    resWM, resDays, resUnit, resultList, selectCountry, selectYear, holidayBtn, tableBody, resTitle, apiKey};