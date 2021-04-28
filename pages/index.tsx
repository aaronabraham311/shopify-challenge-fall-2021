import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"

export const getStaticProps: GetStaticProps = async () => {
  const feed = [
    {
      id: 1,
      title: "Prisma is the perfect ORM for Next.js",
      content: "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
      published: false,
      author: {
        name: "Nikolas Burk",
        email: "burk@prisma.io",
      },
    },
  ]
  return { props: { feed } }
}

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  const uploadPhoto = async(e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/inventory/create?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file}).forEach(([key, value]) => {
      formData.append(key, value);
    })

    const upload = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if(upload.ok) {
      console.log('Uploaded successfully');
    } else {
      console.log('Upload failed');
    }
  }
  
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
        <input onChange={uploadPhoto} type="file" accept="image/png, image/jpeg"/>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
