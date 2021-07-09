

import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Contact, ContactModel} from './contact-model';
import {ContactUpdated,ContactViewed} from './messages';

@autoinject()
export class ContactDetail {

    routeConfig;
    
    contact: Contact;
    originalContact: Contact;

    constructor(public model: ContactModel, public eventChannel: EventAggregator) { }

    private areEqual(obj1, obj2) {
        return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
    };

    activate(params, routeConfig) {

        this.routeConfig = routeConfig;
        this.model.getContact(params.id, (data) => {
            if (data) {
                this.contact = data;
                this.routeConfig.navModel.setTitle(this.contact.firstName);
                this.originalContact = JSON.parse(JSON.stringify(this.contact));
                this.eventChannel.publish(new ContactViewed(data));
                console.log("refreshed details");
            } else console.log('Failed to get item!');
        });
    }

    get canSave() {
        return this.contact && this.contact.firstName && this.contact.lastName && !this.model.isRequesting;
    }

    save() {
        this.model.updateContact(this.contact, (data) => {
            if (data) {
                this.contact = data;
                this.routeConfig.navModel.setTitle(this.contact.firstName);
                this.originalContact = JSON.parse(JSON.stringify(data));
                this.eventChannel.publish(new ContactUpdated(data));
                console.log("saved item");
            } else console.log('Failed to save item!');
        });
    }

    canDeactivate() {
        if (!this.areEqual(this.originalContact, this.contact)) {
            let result = confirm('You have unsaved changes. Are you sure you wish to leave?');
            if (!result) this.eventChannel.publish(new ContactViewed(this.contact));
            return result;
        }
        return true;
    }
}

