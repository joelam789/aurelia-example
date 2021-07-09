
import { HttpClient } from "./http-client";

export interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export class ContactModel {

    isRequesting: boolean = false;
    contacts: Array<Contact> = [];

    serviceAddress: string = "http://localhost:9080";
    actionSuffix: string = "";

    //serviceAddress: string = "http://localhost:58376/contactservice";
    //actionSuffix: string = ".ashx";

    constructor() {
        console.log("data model created");
    }

    private updateItem(contact: Contact) {
        //console.log(this.contacts);
        //console.log(contact);
        let found = this.contacts.filter(x => x.id == contact.id);
        if (found && found.length > 0) {
            let index = this.contacts.indexOf(found[0]);
            this.contacts[index] = contact;
        } else {
            this.contacts.push(contact);
        }
    }

    refreshContactList(callback?: (list: Array<Contact>) => void): void {
        
        this.getData(this.serviceAddress + "/list" + this.actionSuffix, (data) => {
            if (data != null && data.data != null) {
                this.contacts = data.data.slice();
            }
            if (callback != null) callback(this.contacts);
        });
        
    }

    getContact(id: number, callback: (item: Contact) => void): void {
        
        this.getData(this.serviceAddress + "/item" + this.actionSuffix + "?id=" + id, (data) => {
            let item: Contact = null;
            if (data == null || data.data == null || data.data.length <= 0) console.log('Failed to get item!');
            else {
                item = <Contact>(data.data[0]);
                console.log("refreshed item");
            }
            if (callback != null) callback(item);
        });
        
    }

    updateContact(contact: Contact, callback?: (item: Contact) => void): void {
        
        this.postData(this.serviceAddress + "/save" + this.actionSuffix, contact, (data) => {
            let item: Contact = null;
            if (data == null) console.log('Failed to update item!');
            else {
                item = <Contact>data;
                this.updateItem(item);
                console.log("updated item");
            }
            if (callback != null) callback(item);
        });
        
    }
    
    getData(url: string, callback: (data: any) => void): void {
        this.isRequesting = true;
        try {
            HttpClient.getJSON(url, null, (reply) => {
                this.isRequesting = false;
                //console.log('json-data: ', reply);
                callback(reply);
            }, (errmsg) => {
                this.isRequesting = false;
                console.log('error: ', errmsg);
                callback(null);
            });

        } catch (error) {
            this.isRequesting = false;
            console.log('error: ', error);
            callback(null);
        }
    }

    postData(url: string, json: any, callback: (data: any) => void): void {
        this.isRequesting = true;
        try {
            HttpClient.postJSON(url, json, (reply) => {
                this.isRequesting = false;
                //console.log('reply: ', reply);
                callback(reply);
            }, (errmsg) => {
                this.isRequesting = false;
                console.log('error: ', errmsg);
                callback(null);
            });
        } catch (error) {
            this.isRequesting = false;
            console.log('error: ', error);
            callback(null);
        }
    }
    
}
