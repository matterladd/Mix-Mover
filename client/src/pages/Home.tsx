import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

export default function Home() {
    const [appleLink, setAppleLink] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const response = await fetch('/api/spotify/convert-apple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: appleLink })
        });

        if (!response.ok){
            const data = await response.json();
            console.error(`unsuccessful conversion, status ${response.status}, ${data.error}`);
        }
    }

return (
  <>
    <h1 className="flex justify-center text-6xl font-extrabold tracking-tight">
      Playlist Converter
    </h1>
    <form className="flex p-8 justify-center" onSubmit={handleSubmit}>
      <Field className="w-fit" orientation="horizontal">
        <FieldLabel className="" htmlFor="appleLink">Apple Music Playlist link:</FieldLabel>
        <Input 
        id="appleLink" 
        className="w-xl"
        value={appleLink} 
        onChange={(e) => setAppleLink(e.target.value)} 
        required
        />
        <Button type="submit">convert</Button>
      </Field>
    </form>
</>
);
}