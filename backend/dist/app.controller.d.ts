export declare class AppController {
    getApiInfo(): {
        message: string;
        version: string;
        endpoints: {
            auth: {
                login: string;
                register: string;
            };
            categories: string;
            products: string;
            inventory: string;
        };
    };
}
