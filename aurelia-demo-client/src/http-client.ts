// for now, we are using jquery (coz jquery has been included for bootstrap already) to send http requests...
// we might change to use "axios" or "whatwg-fetch(github/fetch)" or aurelia-fetch-client" if do not need jquery anymore

export class HttpClient {
    
    static getJSON(url: string, data?: any, callback?: (reply: any)=>void, onerror?: (errmsg: string)=>void) {
        $.getJSON(url, data, (ret) => {
            console.log(ret);
            if (callback != null) callback(ret);
        })
        .fail((jqxhr, textStatus, error) => {
            console.log(jqxhr);
            console.log(textStatus);
            console.log(error);
            if (onerror != null) onerror(textStatus);
        });
    }

    static postJSON(url: string, data?: any, callback?: (reply: any)=>void, onerror?: (errmsg: string)=>void) {
        $.ajax({
            url: url,
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            data: JSON.stringify(data),
            dataType: "text",
            success: (response) => {
                let json = null;
                try {
                    json = JSON.parse(response);
                } catch(err) {
                    console.log("parse json error: ");
                    console.log(err);
                }
                if (callback) {
                    if (json) callback(json);
                    else callback(response);
                }
            },
            error: (xhr, status) => {
                console.log("post json error: ");
                console.log(xhr);
                console.log(status);
                if (onerror) onerror("post json error");
            }
        });
    }
    
}
