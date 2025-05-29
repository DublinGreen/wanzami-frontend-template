const LoginUserMutation = `
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
}
`;

const LogoutMutation = `
mutation Logout($token: String!) {
    logout(token: $token)
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


const CreateVideoPaymentMutation = `
mutation CreateVideoPayment(
  $video_id: Int!, 
  $email: String!, 
  $reference: String!, 
  $amount: String!, 
  $currency: String!, 
  $transaction_status: String!
  $channel: String!
) {
    createVideoPayment(
        video_id: $video_id,
        email: $email,
        reference: $reference,
        amount: $amount,
        currency: $currency,
        transaction_status: $transaction_status,
        channel: $channel,
    ) {
        id
        video_id
        email
        reference
        amount
        currency
        transaction_status
    }
}
`;

const CreateWishListMutation = `
mutation CreateWishList($video_id: Int!, $email: String!) {
    createWishList(video_id: $video_id, email: $email) {
        id
        status
    }
}
`;


const CreateOrUpdateUserMetaMutation = `
mutation CreateOrUpdateUserMeta(
  $email: String!, 
  $gender: String!, 
  $day: String!, 
  $month: String!
) {
    createOrUpdateUserMeta(
        email: $email
        gender: $gender
        day: $day
        month: $month
    ) {
        id
        email
        gender
        dayOfBirth
        monthOfBirth
    }
}
`;
