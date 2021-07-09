
import {autoinject} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Contact, ContactModel} from './contact-model';
import {RefreshContactListUI} from './messages';

@autoinject()
export class App {

	router: Router;

	constructor(public eventChannel: EventAggregator, public mainModel: ContactModel) {

	}

	configureRouter(config: RouterConfiguration, router: Router) {
		config.title = 'Contacts';
		config.map([ // router will take the website's root directory as cwd
			{ route: ['', 'welcome'], moduleId: 'welcome',   title: 'Welcome'},
			{ route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
		]);
		this.router = router;
	}

	refreshUI() {
		this.eventChannel.publish(new RefreshContactListUI());
		this.router.navigate("welcome");
	}
}
