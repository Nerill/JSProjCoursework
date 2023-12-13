import {CalendarAPI} from "./CalendarAPI.js";

import {tabBtn1, tabBtn2, dateFrom1, dateTo1, WMBtn, daysBtn, unitBtn, tabs, 
    resWM, resDays, resUnit, resultList, selectCountry, selectYear, holidayBtn, tableBody, resTitle} from './constants.js';

document.addEventListener('DOMContentLoaded', renderResult);

function openTab(tabId) {

    tabs.forEach(function(tab) {
        tab.style.display = 'none';
    });

    let selectedTab = document.getElementById(tabId);
    selectedTab.style.display = 'block';
    if(tabId === 'tab2'){
        getYearList();
    }
}

function differenceBetweenDates(unit = "days") //Різниця між двома датами
{
    const dateFrom = new Date(dateFrom1.value);
    const dateTo = new Date(dateTo1.value);
    switch (unit) {
        case 'days':
            return (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24);
            break;
        case 'hours':
            return (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60);
            break;
        case 'minutes':
            return (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60);
            break;
        case 'seconds':
            return (dateTo.getTime() - dateFrom.getTime()) / 1000;
            break;
    }
}

function countWM(){
    let selectWM = document.getElementById('selectWM').value;
    let result = 0;
    switch (selectWM) {
        case '7':
            result = differenceBetweenDates() / selectWM;
            resWM.textContent = `Результат: Між двома датами знаходяться ${result.toFixed(1)} ${result > 1 ? 'тижнів' : 'тиждень'}.`;
            break;
        case '30':
            result = differenceBetweenDates() / selectWM;
            resWM.textContent = `Результат: Між двома датами знаходяться ${result.toFixed(1)} ${result > 1 ? 'місяців' : 'місяць'}.`;
            break;
    }
    storeResultInLocalStorage(date2String() + '  -  ' + resWM.textContent);
    renderResult();
    
}

function countDays() {
    let currentDate = new Date(dateFrom1.value);
    let endDate = new Date(dateTo1.value);
    let weekendDays = 0;
    let result = 0;

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            weekendDays++;
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }

    switch (document.getElementById('selectDays').value) {
        case 'allDays':
            result = differenceBetweenDates();
            resDays.textContent = `Результат: Між двома датами знаходяться всього ${result} ${result > 1 ? 'днів' : 'день'}.`;
            break;
        case 'daysOn':
            result = differenceBetweenDates() - weekendDays;
            resDays.textContent = `Результат: Між двома датами знаходяться ${result} ${result > 1 ? 'робочих днів' : 'робочий день'}.`;
            break;
        case 'daysOff':
            resDays.textContent = `Результат: Між двома датами знаходяться ${weekendDays} ${weekendDays > 1 ? 'вихідних' : 'вихідний'}.`;
            break;
    }
    storeResultInLocalStorage(date2String() + '  -  ' + resDays.textContent);
    renderResult();
}

function countUnit(){
    let selectUnit = document.getElementById('selectUnit').value;
    switch (selectUnit) {
        case 'days':
            resUnit.textContent = `Результат: Між двома датами знаходяться ${differenceBetweenDates(selectUnit)} ${differenceBetweenDates(selectUnit) > 1 ? 'днів': 'день'}.`;
            break;
        case 'hours':
            resUnit.textContent = `Результат: Між двома датами знаходяться ${differenceBetweenDates(selectUnit)} годин.`;
            break;
        case 'minutes':
            resUnit.textContent = `Результат: Між двома датами знаходяться ${differenceBetweenDates(selectUnit)} хвилин.`;
            break;
        case 'seconds':
            resUnit.textContent = `Результат: Між двома датами знаходяться ${differenceBetweenDates(selectUnit)} секунд.`;
            break;
    }
    storeResultInLocalStorage(date2String() + '  -  ' + resUnit.textContent);
    renderResult();

}

function storeResultInLocalStorage(newRes){
    const results = localStorage.getItem('results') !== null
    ? JSON.parse(localStorage.getItem('results'))
    :[];

    results.forEach((res, index) => {
        if(res === newRes){
            results.splice(index, 1);
        }
    })

    if(results.length === 10){
        results.splice(0, 1);
        resultList.firstChild.remove();
    }

    results.push(newRes);

    localStorage.setItem('results', JSON.stringify(results));
}

function createSingleTaskElement(newRes){
    const li = document.createElement('li');
    li.className = 'collection-item';

    li.appendChild(document.createTextNode(newRes));

    resultList.appendChild(li);

    resTitle.style.display = 'block';
}

function renderResult(){
    resultList.innerHTML = '';
    const results = localStorage.getItem('results') !== null
    ? JSON.parse(localStorage.getItem('results'))
    :[];

    results.forEach((res) => {
        createSingleTaskElement(res);
    });

    getCountryList();
}

function date2String(){
    let startDate = new Date(dateFrom1.value);
    let endDate = new Date(dateTo1.value);

    return `${startDate.getDay()}.${startDate.getMonth()}.${startDate.getFullYear()} - ${endDate.getDay()}.${endDate.getMonth()}.${endDate.getFullYear()}`;
}

async function getCountryList() {
    if(localStorage.getItem('country') === null){
        const calendarAPI = new CalendarAPI();
        let countryList = await calendarAPI.getData('countries');

        countryList.response.countries.forEach((element)=>{
            let option = document.createElement("option");
            option.text = element.country_name;
            option.value = Object.values(element)[1];
            selectCountry.appendChild(option);
            storeCountryInLocalStorage(Object.values(element)[1]+'-'+element.country_name);
        })
    }
    else{
        const country = localStorage.getItem('country') !== null
        ? JSON.parse(localStorage.getItem('country'))
        :[];
        country.forEach((element)=>{
            let option = document.createElement("option");
            //console.log(element);
            option.text = element.slice(3);
            option.value = element.slice(0, 2);
            selectCountry.appendChild(option);
        })
    }

}

function getYearList(){
    for (let year = 2001; year <= 2049; year++) {
        let optionElement = document.createElement("option");
        optionElement.value = year;
        optionElement.text = year;
    
        if (year === new Date().getFullYear()) {
          optionElement.selected = true;
        }
        
        selectYear.appendChild(optionElement);
      }
}

async function getHolidaysList() {
    const calendarAPI = new CalendarAPI();
    tableBody.innerHTML = '';

    let tbody = document.createElement('tbody');

    let holidaysList = await calendarAPI.getData('holidays');
    console.log(holidaysList);
    holidaysList.response.holidays.forEach((element)=>{
        let row = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');

        td1.textContent = element.date.datetime.day.toString().padStart(2, '0')
                            +'.'+element.date.datetime.month.toString().padStart(2, '0')
                            +'.'+element.date.datetime.year.toString();
        td2.textContent = element.name;

        row.appendChild(td1);
        row.appendChild(td2);
        tbody.appendChild(row);
    });

    tableBody.appendChild(tbody);
    tableBody.style.display = 'table';

}

function storeCountryInLocalStorage(newCountry){
    const country = localStorage.getItem('country') !== null
    ? JSON.parse(localStorage.getItem('country'))
    :[];

    country.push(newCountry);

    localStorage.setItem('country', JSON.stringify(country));
}

tabBtn1.addEventListener('click', ()=>{openTab('tab1')});
tabBtn2.addEventListener('click', ()=>{openTab('tab2')});
WMBtn.addEventListener('click', ()=>{if(dateFrom1.value && dateTo1.value) {countWM()}});
daysBtn.addEventListener('click', ()=>{if(dateFrom1.value && dateTo1.value) {countDays()}});
unitBtn.addEventListener('click', ()=>{if(dateFrom1.value && dateTo1.value) {countUnit()}});

holidayBtn.addEventListener('click', getHolidaysList);

dateFrom1.addEventListener('input', (event)=>{event.target.value ? dateTo1.disabled=false : dateTo1.disabled=true});

