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

const FindAllActiveSlidersQuery = `
query FindAllActiveSliders {
    findAllActiveSliders {
        id
        status
        name
        description
        duration
        video_quality
        image_link
        background_link
        video_link
        video {
            status
            id
        }
    }
}
`;