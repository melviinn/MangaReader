export default async function TestPage() {
  const url = "https://anime-streaming.p.rapidapi.com/spotlight";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "c4afbb9ca4msha602ec73e669a9cp138764jsnf8ec574a33b9",
      "x-rapidapi-host": "anime-streaming.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
}
