# Amethyst: Shopify Developer Challenge

Amethyst is a centralized platform to upload and sell images. Think of it like Shopify for images!

## Running locally
Pre-requisites:
- npm

Please run the following steps:
1. Clone the project into a directory of choice: `git clone https://github.com/aaronabraham311/shopify-challenge-fall-2021.git`
2. `cd shopify-challenge-fall-2021`
3. Copy `.env.sample` to `.env` and fill in credentials. This project requires AWS and Imagga API credentials
4. Run `npm i` to install dependencies
5. Run `npm run dev` and navigate to localhost:3000 to see the app!
6. Run tests: `npm run test`

## Architecture
I wanted to challenge myself a little with this project so I decided to design this system with speed and scalability in mind. Given these constraints, I chose to develop a Next.js powered app that would enable static generation and server-side rendering (much faster than usual React client-side rendering) along with AWS RDS & S3 as persistence layers (proven to be extremely scalable for a variety of use cases)
### Frontend
- React written in TypeScript
- [Chakra UI](https://chakra-ui.com) for fast and accessible components
- [Next.js](https://nextjs.org) for fast static-site rendering
### Backend
- [Next.js](https://nextjs.org) for serverless API functions
- PostgreSQL on AWS RDS as a persistence layer for relational data
- AWS S3 as a persistence layer for image data
- [NextAuth.js](https://next-auth.js.org) for authentication
- [Prisma](https://www.prisma.io) as an ORM
- [Imagga](https://imagga.com) for auto-tagging via machine learning on image upload

## Recording

[Loom recording](https://www.loom.com/share/d18a7d4b93fa48f9a96042211169e0f7)

## Improvements
Given the time, I would implement the following:
- Access control was not implemented due to time constraints. This is a high priority item for future development
- Implement caching through Redis/Memcached as this is an application skewed towards reads over writes. Statically rendered pages via Next.js are helpful for tackling this issue, but caching would improve performance.
- The admin portal uses the production database to read statistics, like cumulative revenue. A much better solution is to implement a data warehouse using AWS Redshift and follow [star schema practices](https://en.wikipedia.org/wiki/Star_schema) such that the load on the production DB is lowered. 
- Implement some sort of partitioning of Postgres data (if the application starts to take off) based off date if we find that users usually buy the most recent pictures (or other partition logic based on usage patterns)
- Utilize more scalable searching based off technologies like Elasticsearch rather than React-based searching.

## Challenges
- **Figuring out photo upload**: After trying to play with photo upload for several hours using the AWS SDK, I decided to go with an AWS REST API approach using multipart forms. It was not a very intuitive solution at first and difficult to test but worked like a charm.

- **Prisma**: Prisma is a great TypeScript-based ORM for relational databases like PostgreSQL and MySQL. However, it is still a new ORM with its own idiosyncrasies (eg. cascade deletion was a bit of a challenge). However, after my experience using Sequelize and Mongoose for other projects as ORMs, I believe Prisma is a notch above the rest for projects in Node. 

- **Deployment**: I decided to use Vercel due its ease of deployment. However, connecting to the AWS RDS instance from Vercel was an unanticipated challenge; Vercel uses AWS to host projects so I had to change several security configurations to enable special inbound traffic from within AWS (related to VPC security groups). I was led along several red herrings until I finally realized that it was a security group connection issue.
## Resources:
- [How to Build a Fullstack App with Next.js, Prisma, and PostgreSQL](https://vercel.com/guides/nextjs-prisma-postgres)
- [Create and Connect to a PostgreSQL Database with Amazon RDS](https://aws.amazon.com/getting-started/hands-on/create-connect-postgresql-db/)
- [Create Autotagging Uploads with NodeJS using Image Recognition API](https://imagga.com/blog/autotagging-uploads-with-nodejs/)
- [Implementing Simple Auth To Your Next.js Website using Next.js Auth](https://blog.dennisokeeffe.com/blog/2020-11-16-nextjs-simple-auth/)
- [Unit Testing Next.js API Routes](https://seanconnolly.dev/unit-testing-nextjs-api-routes)
