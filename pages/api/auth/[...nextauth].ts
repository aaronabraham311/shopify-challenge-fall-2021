import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
    providers: [
        Providers.Credentials({
            name: 'Login',
            credentials: {
                username: { label : "Username", type: "text", placeholder: "Username"},
                password: { label: "Password", type:"password"}
            },
            authorize: async (credentials) => {
                const username = process.env.AMETHYST_NEXTAUTH_USERNAME
                const password = process.env.AMETHYST_NEXTAUTH_PASSWORD
                if (credentials.username === username && credentials.password === password) {
                    return Promise.resolve({id: 1, name: "admin"});
                } else {
                    return Promise.resolve(false);
                }
            }
        })
    ],
    callbacks: {
        async redirect(url, baseUrl) {
            return url;
        }
    }
};

export default (req, res) => NextAuth(req, res, options)