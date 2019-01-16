interface iUser {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    fcmTokens?: { [token: string]: true };
}

// {
//     uid: 'userXYZ',
//         fcmTokens: {
//             tokenA: true,
//             tokenB: true,
//             //... and so on
//         }
// }