export class CalendarAPI {
    #apiUrl;
    #isFetching;
    #abortController;
    #apiKey;
    #apiUrlCont;
    #response;

    constructor() {
        this.#apiUrl = 'https://calendarific.com/api/v2/holidays';
        this.#apiKey = 'u1k8kL9rVsbaT3RQOrmkAo6fqqZLpbxT';
        this.#apiUrlCont = "https://calendarific.com/api/v2/countries";
        this.#isFetching = false;
        this.#abortController = null;
        this.#response = {};
    }

    logResult = (data) => {
        console.log(data);
    }

    getData = async (param) => {
        this.#isFetching = true;

        if (this.#abortController) {
            try {
                console.log(this.#abortController)
                this.#abortController.abort();
            } catch (error) {
                throw new Error(error);
            }
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        this.#abortController = abortController;

        try {
            
            if(param === 'holidays'){
                let country = document.getElementById('selectCountry').value
                let year = document.getElementById('selectYear').value
                this.#response = await fetch(`${this.#apiUrl}?api_key=${this.#apiKey}&country=${country}&year=${year}`, {signal});
            }else{
                this.#response = await fetch(`${this.#apiUrlCont}?api_key=${this.#apiKey}`, {signal});
            }
            
            return await this.#response.json();
            
        } catch (error) {
            throw new Error(error);
        } finally {
            this.#isFetching = false;
        }
    };
    
}
