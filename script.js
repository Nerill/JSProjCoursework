import {CalendarAPI} from "./CalendarAPI.js";

import {tabBtn1, tabBtn2, dateFrom1, dateTo1, unitBtn, tabs, resultList, selectCountry, selectYear, holidayBtn,
    tableBody, tBody, tblDate, resTitle, countrySelect, yearSelect, btnWeek, btnMonth, apiKey} from './constants.js';

let sortDirection = 1;

document.addEventListener('DOMContentLoaded', renderResult);

function openTab(tabId) {

    tabs.forEach(function(tab) {
        tab.style.display = 'none';
    });

    let selectedTab = document.getElementById(tabId);
    selectedTab.style.display = 'block';
}

function countDays() {
    const currentDate = new Date(dateFrom1.value);
    const startDate = new Date(dateFrom1.value);
    const endDate = new Date(dateTo1.value);
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
            return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        break;
        case 'daysOn':
            return ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) - weekendDays;
        break;
        case 'daysOff':
            return weekendDays;
        break;
    }
}

function countUnit(){
    const selectUnit = document.getElementById('selectUnit').value;
    let resUnit = '';
    switch (selectUnit) {
        case 'days':
            resUnit = `Результат: Між двома датами знаходяться ${countDays()} ${countDays() > 1 ? 'днів': 'день'}.`;
            break;
        case 'hours':
            resUnit = `Результат: Між двома датами знаходяться ${countDays()*24} годин.`;
            break;
        case 'minutes':
            resUnit = `Результат: Між двома датами знаходяться ${countDays()*24*60} хвилин.`;
            break;
        case 'seconds':
            resUnit = `Результат: Між двома датами знаходяться ${countDays()*24*60*60} секунд.`;
            break;
    }
    storeResultInLocalStorage(date2String() + '  -  ' + resUnit);
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

function createSingleCollectElement(newRes){
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
        createSingleCollectElement(res);
    });

    getCountryList();
    getYearList();
}

function date2String(){
    const startDate = new Date(dateFrom1.value);
    const endDate = new Date(dateTo1.value);
    return `${startDate.getDate()}.${startDate.getMonth()+1}.${startDate.getFullYear()} - ${endDate.getDate()}.${endDate.getMonth()+1}.${endDate.getFullYear()}`;
}

async function getCountryList() {
    if(sessionStorage.getItem('country') === null){
        const calendarAPI = new CalendarAPI();
        const countryList = await calendarAPI.getData(`https://calendarific.com/api/v2/countries?api_key=${apiKey}`);

        countryList.response.countries.forEach((element)=>{
            const option = document.createElement("option");
            option.text = element.country_name;
            option.value = element['iso-3166'];
            selectCountry.appendChild(option);
            storeCountryInLocalStorage(element['iso-3166']+'-'+element.country_name);
        })
    }
    else{
        const country = sessionStorage.getItem('country') !== null
        ? JSON.parse(sessionStorage.getItem('country'))
        :[];
        country.forEach((element)=>{
            const option = document.createElement("option");
            option.text = element.slice(3);
            option.value = element.slice(0, 2);
            selectCountry.appendChild(option);
        })
    }

}

function getYearList(){
    for (let year = 2001; year <= 2049; year++) {
        const optionElement = document.createElement("option");
        optionElement.value = year;
        optionElement.text = year;
    
        if (year === new Date().getFullYear()) {
          optionElement.selected = true;
        }
        
        selectYear.appendChild(optionElement);
      }
}

async function getHolidaysList() {
    if(countrySelect.value !== "0"){
        const calendarAPI = new CalendarAPI();
        
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
          }

        const country = countrySelect.value;
        const year = yearSelect.value;

        const holidaysList = await calendarAPI.getData(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`);
        holidaysList.response.holidays.forEach((element)=>{
            const row = document.createElement('tr');
            const td1 = document.createElement('td')
            const td2 = document.createElement('td');

            td1.textContent = element.date.datetime.day.toString().padStart(2, '0')
                                +'.'+element.date.datetime.month.toString().padStart(2, '0')
                                +'.'+element.date.datetime.year.toString();
            td2.textContent = element.name;

            row.appendChild(td1);
            row.appendChild(td2);
            tBody.appendChild(row);
        });

        tableBody.style.display = 'table';
    }
}

function storeCountryInLocalStorage(newCountry){
    const country = sessionStorage.getItem('country') !== null
    ? JSON.parse(sessionStorage.getItem('country'))
    :[];

    country.push(newCountry);

    sessionStorage.setItem('country', JSON.stringify(country));
}

function checkDates(){
    if(new Date(dateTo1.value) <= new Date(dateFrom1.value)){
        window.alert('The "Date From" cannot be greater than the "Date To"!');
        dateTo1.value = '';
    }                                  
}

function setWeekMonthToDate(param = 'week'){
    const startDate = new Date(dateFrom1.value);
    switch (param) {
        case 'week':
            startDate.setDate(startDate.getDate()+7);
            break;
        case 'month':
            startDate.setMonth(startDate.getMonth()+1);
            break;
        
        default:
            break;
    }
    dateTo1.value = startDate.getFullYear()
                            +(startDate.getMonth() < 9 ? '-0'+(startDate.getMonth()+1) : '-'+(startDate.getMonth()+1))
                            +(startDate.getDate() < 10 ? '-0'+startDate.getDate() : '-'+startDate.getDate());
}

function sortTable() {
    let rows, switching, i, x, y, shouldSwitch;
    switching = true;

    while (switching) {
        switching = false;
        rows = tableBody.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[0].innerText;
            y = rows[i + 1].getElementsByTagName("td")[0].innerText;

            x = x.substring(6,10)+'-'+x.substring(3,5)+'-'+x.substring(0,2);
            y = y.substring(6,10)+'-'+y.substring(3,5)+'-'+y.substring(0,2);

            if ((sortDirection < 0 && (new Date(x) > new Date(y))) || (sortDirection > 0 && (new Date(x) < new Date(y)))) {
            shouldSwitch = true;
            break;
            }
        }

        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
    }
    updateSortArrow()
    sortDirection = -sortDirection;
}

function updateSortArrow() {
    let arrow = document.querySelector(".sort-arrow");
    arrow.innerHTML = "";
    arrow.classList.remove('asc');
    arrow.classList.remove('desc');
    arrow.classList.add(sortDirection === 1 ? "asc" : "desc");

}

tabBtn1.addEventListener('click', ()=>{openTab('tab1')});
tabBtn2.addEventListener('click', ()=>{openTab('tab2')});

unitBtn.addEventListener('click', ()=>{if(dateFrom1.value && dateTo1.value) {countUnit()}});

holidayBtn.addEventListener('click', getHolidaysList);

dateFrom1.addEventListener('input', (event)=>{event.target.value ? dateTo1.disabled=false : dateTo1.disabled=true});
dateTo1.addEventListener('input', checkDates);

countrySelect.addEventListener('click', ()=>{countrySelect.value !== "0" ? yearSelect.disabled=false : yearSelect.disabled=true})

btnWeek.addEventListener('click', ()=>{if(dateFrom1.value){setWeekMonthToDate('week')}});
btnMonth.addEventListener('click', ()=>{if(dateFrom1.value){setWeekMonthToDate('month')}});
tblDate.addEventListener('click', sortTable)
