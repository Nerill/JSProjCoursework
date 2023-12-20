export class CalendarAPI {
    #apiUrl;
    #isFetching;
    #abortController;
    #apiKey;
    #apiUrlCont;
    #response;

    constructor() {
        this.#isFetching = false;
        this.#abortController = null;
        this.#response = {};
    }

    logResult = (data) => {
        console.log(data);
    }

    getData = async (paramUrl) => {
        this.#isFetching = true;

        if (this.#abortController) {
            try {
                this.#abortController.abort();
            } catch (error) {
                throw new Error(error);
            }
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        this.#abortController = abortController;

        try {
            this.#response = await fetch(paramUrl, {signal});
            
            return await this.#response.json();
            
        } catch (error) {
            window.alert(error + "\nНе вдалося завантажити дані!");
            throw new Error(error);
        } finally {
            this.#isFetching = false;
        }
    };
    
}
