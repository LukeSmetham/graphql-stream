export default jest.fn().mockImplementation(options =>
	new Promise(res => {
		if (options.data.id === 2) {
			res({
				body: {
					status_code: 404,
					detail: 'Not found!',
				}
			})
		} else {
			res({
				body: options
			});
		}
	}));