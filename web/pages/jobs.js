import NavBar from "../components/NavBar";

const MOCK_JOBS = [
  { id: 1, title: "Software Intern", company: "Acme", location: "Remote" },
  { id: 2, title: "Data Analyst Intern", company: "Nova", location: "NYC" },
  { id: 3, title: "Product Intern", company: "Luma", location: "SF" }
];

export default function Jobs() {
  return (
    <>
      <NavBar />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <ul className="space-y-3">
          {MOCK_JOBS.map(j => (
            <li key={j.id} className="rounded-lg border p-4">
              <div className="font-semibold">{j.title}</div>
              <div className="text-gray-600">{j.company} • {j.location}</div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}