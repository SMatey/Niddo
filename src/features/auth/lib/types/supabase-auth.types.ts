export interface AuthResult {
	error: string | null
}

export interface RegisterInput {
	fullName: string
	email: string
	password: string
}
