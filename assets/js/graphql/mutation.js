const LoginUserMutation = `
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
}
`;
