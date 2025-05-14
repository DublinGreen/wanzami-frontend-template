const LoginUserMutation = `
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
}
`;


const EmailConfirmationMutation = `
mutation ConfirmEmailCode($code: String!, $id: Int!) {
    confirmEmailCode(code: $code, id: $id) {
        id
        status
        firstName
        lastName
        email
        role
    }
}
`;

const PasswordResetRequestMutation = `
mutation PasswordReset($email: String!) {
    passwordReset(email: $email)
}
`;

const PasswordResetMutation = `
mutation PasswordReset($password: String!, $code: String!,) {
    passwordReset(password: $password, code: $code)
}
`;

