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
            id
            status
            name
            description
            short_description
            thumbnail
            video_short_url
            banner
            reviews_rating
            category {
                id
                name
                status
            }
            author {
                id
                name
                email
                telephone
                status
                age
            }
            videoRating {
                id
                status
                rating
                description
            }
            videoMeta {
                id
                video_length
                video_quanlity
                video_url
                video_trailer_url
            }
        }
    }
}

`;

const FindAllVideoByRestrictedCountryQuery = `
query FindAllVideoByRestrictedCountry ($country: String!) {
    findAllVideoByRestrictedCountry(country: $country) {
        id
        status
        name
        description
        short_description
        thumbnail
        video_short_url
        banner
        reviews_rating
        category {
            id
            name
            status
        }
        author {
            id
            name
            email
            telephone
            status
            age
        }
        videoRating {
            id
            status
            rating
            description
        }
        videoMeta {
            id
            video_length
            video_quanlity
            video_url
            video_trailer_url
        }
    }
}
`;

const FindAllSubCategoryByVideoIdQuery = `
query FindAllSubCategoryByVideoId($videoId: ID!) {
    findAllSubCategoryByVideoId(videoId: $videoId) {
        id
        name
        status
    }
}
`;

const FindVideoByRestrictedCountryAndSubCategoryQuery = `
query FindVideoByRestrictedCountryAndSubCategory($country: String!, $videoCategoryId: Int!) {
    findVideoByRestrictedCountryAndSubCategory(
        country: $country
        videoCategoryId: $videoCategoryId
    ) {
        id
        status
        name
        description
        short_description
        thumbnail
        video_short_url
        banner
        reviews_rating
        category {
            id
            name
            status
        }
        author {
            id
            name
            email
            telephone
            status
            age
        }
        videoRating {
            id
            status
            rating
            description
        }
        videoMeta {
            id
            video_length
            video_quanlity
            video_url
            video_trailer_url
        }
    }
}
`;

const FindUserByEmailQuery = `
query UserByEmail($email: String!) {
    userByEmail(email: $email) {
        id
        status
        email
    }
}
`;

const VideoByIdQuery = `
query VideoById($videoId: ID!) {
    videoById(id: $videoId) {
        id
        status
        name
        description
        short_description
        thumbnail
        video_short_url
        banner
        reviews_rating
        category {
            id
            name
            status
        }
        author {
            id
            name
            email
            telephone
            status
            age
        }
        videoRating {
            id
            status
            rating
            description
        }
        videoMeta {
            id
            video_length
            video_quanlity
            video_url
            video_trailer_url
        }
    }
}
`;