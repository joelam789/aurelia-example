
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { DialogService } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';

import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { Contact, ContactModel } from './contact-model';
import { ContactUpdated, ContactViewed, RefreshContactListUI } from './messages';

import { EditContactDlg } from './contact-edit';

@autoinject()
export class Contacts {

    selectedId = 0;

    contacts: Array<Contact> = [];

    subscribers: Array<Subscription> = [];

    constructor(public model: ContactModel, public eventChannel: EventAggregator, public router: Router, public i18n: I18N, public dialogService: DialogService) {
        this.subscribers = [];
    }

    attached(argument) {
        console.log("contact list created");

        this.subscribers.push(this.eventChannel.subscribe(RefreshContactListUI, () => this.refreshData()));
        this.subscribers.push(this.eventChannel.subscribe(ContactViewed, msg => this.select(msg.contact)));
        this.subscribers.push(this.eventChannel.subscribe(ContactUpdated, msg => {
            let id = msg.contact.id;
            let found = this.contacts.filter(x => x.id == id);
            if (found != null && found.length > 0) Object.assign(found[0], msg.contact);
        }));

        this.refreshData();
    }

    detached(argument) {
		for (let item of this.subscribers) item.dispose();
        this.subscribers = [];
    }

    refreshData() {
        this.selectedId = 0;
        this.model.refreshContactList((list) => {
            if (list == null) console.log('Failed to get data!');
            else {
                this.contacts = list.slice();
                console.log('Refreshed contact list!');
            }
        });
	}

    select(contact) {
        if (contact) {
            this.selectedId = contact.id;
            return true;
        }
        return false;
    }

    editItem(contactId) {
        console.log("editItem - " , contactId);

        let id = contactId;
        let found = this.contacts.filter(x => x.id == id);
        let editingContact = JSON.parse(JSON.stringify(found[0]));
        
        console.log("open edit dialog...");
        this.dialogService.open({viewModel: EditContactDlg, model: editingContact})
        .whenClosed((response) => {
            if (!response.wasCancelled && response.output != undefined) {
                console.log(response.output);
                this.model.updateContact(response.output, (data) => {
                    if (data) {
                        this.eventChannel.publish(new ContactUpdated(data));
                        console.log("saved item");
                    } else console.log('Failed to save item!');
                });
            } else {
                console.log('Give up editing a contact record');
            }
        });
    }
}

