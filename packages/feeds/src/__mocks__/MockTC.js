export const getMockTC = (schemaComposer) => schemaComposer.getOrCreateOTC('MockType', tc => {
	tc.addFields({
		id: 'ID',
	});
});
