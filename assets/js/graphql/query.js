const FindAllUsersQuery = `
query FindAllUsers {
    findAllUsers {
        id
        status
        username
        email
        telephone
        password
        role
    }
}
`;