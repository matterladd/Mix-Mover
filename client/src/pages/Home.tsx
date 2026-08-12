import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [appleLink, setAppleLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const convertPromise = fetch("/api/spotify/convert-apple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: appleLink }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        console.error(
          `unsuccessful conversion, status ${response.status}, ${data.message}`,
        );
        throw new Error(data.message);
      } else {
        setAppleLink("");
      }
    });

    toast.promise(convertPromise, {
      loading: "Converting...",
      success: "Success! Go to <playlist link> to view playlist",
      error: (err: Error) => err.message,
      position: "top-right",
    });

    try {
      await convertPromise;
      setAppleLink("");
    } catch (err) {
      console.error("unsuccessful conversion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="flex justify-center text-6xl font-bold tracking-tight">
        MixMover
      </h1>
      <h2 className="flex justify-center text-2xl font-semibold tracking-tight">
        Playlist Converter App
      </h2>
      <div className="flex justify-center items-center pt-4">
        <Card className="w-5/6 md:w-fit">
          <form
            className="flex flex-col md:flex-row pl-4 pr-4 justify-center items-center"
            onSubmit={handleSubmit}
          >
            <label htmlFor="appleLink" className="text-nowrap pb-2 md:pb-0">
              Apple Music Playlist link:
            </label>
            <div className="md:pr-2 md:pl-2 w-full md:max-w-lg md:w-lg">
              <Input
                id="appleLink"
                className=""
                value={appleLink}
                placeholder="https://music.apple.com/us/playlist/example/abc"
                onChange={(e) => setAppleLink(e.target.value)}
                required
              />
            </div>
            <div className="pt-2 md:pt-0 w-full md:w-fit">
              <Button type="submit" disabled={isLoading} className="w-full">
                convert
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <div className="flex justify-center pt-10">
        <Card className="w-5/6 md:max-w-6xl">
          <CardHeader>
            <CardTitle className="flex text-2xl font-bold tracking-tight">
              What is this?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
