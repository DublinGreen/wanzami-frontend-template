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
mutation PasswordResetRequest($email: String!) {
    passwordResetRequest(email: $email)
}
`;

const PasswordResetMutation = `
mutation PasswordReset($password: String!, $code: String!) {
    passwordReset(password: $password, code: $code)
}
`;

const CreateUserMutation = `
mutation CreateUser(
  $firstName: String!, 
  $lastName: String!, 
  $email: String!, 
  $password: String!, 
  $telephone: String!, 
  $role: String!
) {
  createUser(
    firstName: $firstName, 
    lastName: $lastName, 
    email: $email, 
    password: $password, 
    telephone: $telephone, 
    role: $role
  ) {
    id
    status
    firstName
    lastName
    email
    telephone
    role
  }
}
`;

