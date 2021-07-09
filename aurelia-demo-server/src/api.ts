
import * as express from "express";
import * as parser from "body-parser";
import * as cors from "cors";

interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

class ContactBook {

    private _nextId: number = 0;
    private _contacts: Array<Contact>;

    constructor() {
        this._nextId = 0;
        this.initContacts();
    }

    private getNextId(): number {
        return ++this._nextId;
    }

    private initContacts(): void {
        this._contacts = [
        {
            id:this.getNextId(),
            firstName:'John',
            lastName:'Tolkien',
            email:'tolkien@inklings.com',
            phoneNumber:'867-5305'
        },
        {
            id:this.getNextId(),
            firstName:'Clive',
            lastName:'Lewis',
            email:'lewis@inklings.com',
            phoneNumber:'867-5306'
        },
        {
            id:this.getNextId(),
            firstName:'Owen',
            lastName:'Barfield',
            email:'barfield@inklings.com',
            phoneNumber:'867-5307'
        },
        {
            id:this.getNextId(),
            firstName:'Charles',
            lastName:'Williams',
            email:'williams@inklings.com',
            phoneNumber:'867-5308'
        },
        {
            id:this.getNextId(),
            firstName:'Roger',
            lastName:'Green',
            email:'green@inklings.com',
            phoneNumber:'867-5309'
        }];
    }

    getContactList(): Array<Contact> {
        return this._contacts;
    }

    getContactItem(id: number): Array<Contact> {
        return this._contacts.filter(x => x.id == id);
    }

    saveContactItem(contact: Contact): Contact {
        //let instance = JSON.parse(JSON.stringify(contact));
        let found = this._contacts.filter(x => x.id == contact.id);

        if (found && found.length > 0) {
            let index = this._contacts.indexOf(found[0]);
            this._contacts[index] = contact;
        } else {
            contact.id = this.getNextId();
            this._contacts.push(contact);
        }

        return contact;
    }

}


// create server and data ...

const app = express();
const book = new ContactBook();

app.use(cors({credentials: true, origin: true}));

app.get('/test', function(req, res) {
    res.json({message: "hello"});
});

app.get('/list', function(req, res) {
    console.log("[" + new Date().toLocaleTimeString() + "]", "request for list");
    res.json({data: book.getContactList()});
});

app.get('/item', function(req, res) {
    console.log("[" + new Date().toLocaleTimeString() + "]", "request for item");
    res.json({data: book.getContactItem(req.query.id)});
});

app.post('/save', parser.json(), function(req, res) {
    console.log("[" + new Date().toLocaleTimeString() + "]", "request for save - ");
	//console.log(req.body);
    if (!req.body) return res.sendStatus(400);
    else res.json(book.saveContactItem(<Contact>(req.body)));
});

app.listen(process.env.PORT || 9080);
