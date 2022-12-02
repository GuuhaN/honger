export default function App() {
  return (
    <div className="flex bg-green-100 h-screen">
      <div className="flex flex-col justify-center m-auto">
        <div className="text-4xl font-bold">Honger</div>
        <div className="text-xl font-light tracking-widest">Eten</div>
        <div className="text-lg font-light tracking-wide">Schuiven</div>
        <button
          className="border rounded border-black bg-green-300 p-2"
          type="submit"
        >
          Waar gaan we eten
        </button>
      </div>
    </div>
  );
}
