let url: string = '';

if (process.env.NODE_ENV === "production") {
    url = process.env.NEXT_PUBLIC_URL
} else {
    url =  "http://localhost:3000"
}

export default url;