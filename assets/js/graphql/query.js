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

const VideoProductionCrewByVideoIdQuery = `
query VideoProductionCrewByVideoId($videoId: ID!) {
    videoProductionCrewByVideoId(id: $videoId) {
        id
        status
        position
        name
    }
}
`;

const VideoCastByVideoIdQuery = `
query VideoCastByVideoId($videoId: ID!) {
    videoCastByVideoId(videoId: $videoId) {
        id
        status
        videoId
        cast {
            id
            status
            cast_image_url
            name
            gender
        }
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

const GeneratePresignedGetUrlQuery = `
query GeneratePresignedGetUrl($fileName: String!) {
    generatePresignedGetUrl(fileName: $fileName)
}
`;

const VideoPriceByVideoIdQuery = `
query VideoPriceByVideoId($videoId: ID!) {
    videoPriceByVideoId(videoId: $videoId) {
        id
        status
        videoId
        price {
            id
            status
            price
            currency
            country {
                id
                name
                status
            }
        }
    }
}
`;

const VerifyPaymentRequestQuery = `
query VerifyPayment($reference: String!) {
    verifyPayment(reference: $reference)
}
`;

const VideoPaymentByEmailQuery = `
query VideoPaymentByEmail($email: String!) {
    videoPaymentByEmail(email: $email) {
        id
        video_id
        email
        reference
        amount
        currency
        transaction_status
        channel
    }
}
`;

const SearchVideoByRestrictedCountryQuery = `
query SearchVideoByRestrictedCountry($country: String!, $videoName: String!) {
    searchVideoByRestrictedCountry(country: $country, videoName: $videoName) {
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

const VideosByIdsQuery = `
query VideosByIds($ids: [Int!]!) {
    videosByIds(ids: $ids) {
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

const WishListByUserEmailQuery = `
query WishListByUserEmail($email: String!) {
    wishListByUserEmail(email: $email) {
        id
        status
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

const UserMetaByEmailQuery = `
query UserMetaByEmail($email: String!) {
    userMetaByEmail(email: $email) {
        id
        email
        gender
        dayOfBirth
        monthOfBirth
    }
}
`;