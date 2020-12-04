export class UserEventPlugin {
    constructor(capn) {
        this.capn = capn;
        console.log(capn);
    }

    test = () => true;

    _listen = async () => {
        for await (const event of this.capn.listen(this.test)) {
            console.log('UserEventsPugin:', event);
        }
    };
}
