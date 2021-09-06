export default jest.fn().mockImplementation(options => Promise.resolve({
	body: options
}));