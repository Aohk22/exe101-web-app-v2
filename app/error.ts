export class NoUserContextError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'NoUserContextError'
	}
}
