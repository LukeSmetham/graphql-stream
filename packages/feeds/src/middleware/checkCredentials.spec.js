import { checkCredentials } from './checkCredentials';

describe('checkCredentials middleware', () => {
	test('throws an error if no credentials are provided', () => {
		const resolver = jest.fn();

		expect(() => {
			checkCredentials()(resolver, {}, {}, {}, {});
		}).toThrow(/Missing Stream Credentials/);
		expect(resolver).not.toHaveBeenCalled();
	});
	
	test('throws an error if api_key is not present in the credentials', () => {
		const resolver = jest.fn();
		
		const options1 = {
			credentials: {},
		}

		expect(() => {
			checkCredentials(options1)(resolver, {}, {}, {}, {});
		}).toThrow(/Missing Stream API Key/);
		
		expect(resolver).not.toHaveBeenCalled();
		
		const options2 = {
			credentials: {
				api_key: ''
			},
		}

		expect(() => {
			checkCredentials(options2)(resolver, {}, {}, {}, {});
		}).toThrow(/Missing Stream API Key/);
		
		expect(resolver).not.toHaveBeenCalled();
	});
	
	test('throws an error if api_secret is not present in the credentials', () => {
		const resolver = jest.fn();
		
		const options1 = {
			credentials: {
				api_key: 'STREAM_API_KEY',
			},
		}

		expect(() => {
			checkCredentials(options1)(resolver, {}, {}, {}, {});
		}).toThrow(/Missing Stream API Secret/);
		
		expect(resolver).not.toHaveBeenCalled();
		
		const options2 = {
			credentials: {
				api_key: 'STREAM_API_KEY',
				api_secret: ''
			},
		}

		expect(() => {
			checkCredentials(options2)(resolver, {}, {}, {}, {});
		}).toThrow(/Missing Stream API Secret/);
		
		expect(resolver).not.toHaveBeenCalled();
	});
})