import { autoinject, BindingEngine } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { DialogController } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';

import {Contact, ContactModel} from './contact-model';
import {ContactUpdated,ContactViewed} from './messages';

@autoinject
export class EditContactDlg {

    subscribers: Array<Subscription> = [];

    contact: any;

    constructor(public controller: DialogController, public binding: BindingEngine, public i18n: I18N, public eventChannel: EventAggregator) {
        //controller.settings.centerHorizontalOnly = true;
        this.subscribers = [];
    }

    activate(message) {
        this.contact = message;
    }

    deactivate() {

    }
	
	attached() {
        this.subscribers = [];
	}

    detached() {
        for (let item of this.subscribers) item.dispose();
        this.subscribers = [];
    }

    get newContact() {
        return {
            id: this.contact.id,
            firstName: this.contact.firstName,
            lastName: this.contact.lastName,
            email: this.contact.email,
            phoneNumber: this.contact.phoneNumber
        }
    }
	
}
