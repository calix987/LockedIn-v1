import NavBar from "../components/NavBar";

export default function Messages() {
  return (
    <>
      <NavBar />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p className="text-gray-600">Real-time chat will land in a later bundle.</p>
      </main>
    </>
  );
}