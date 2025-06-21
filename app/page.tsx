
import Layout from "@/components/Layout"

export default function HomePage() {
  return (
    <Layout>
      <div className="relative h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Golden Gate Bridge"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      </div>
    </Layout>
  )
}
